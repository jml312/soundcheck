import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import client from "@/lib/sanity";
import axios from "axios";
import dayjs from "dayjs";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account.provider !== "spotify") return false;
      const { id, name, email, image } = user;
      const { access_token } = account;
      let newUserId;
      try {
        const { _id, playlistID } = await client.createIfNotExists({
          _type: "user",
          _id: id,
          name,
          email,
          image,
          createdAt: dayjs().toISOString(),
          postStreak: 0,
          playlistID: "",
          recentlyPlayed: [],
          discoverSongs: [],
          posts: [],
          likes: [],
          comments: [],
          following: [],
          followers: [],
          notifications: [],
        });
        newUserId = _id;

        let followsSoundcheck = false;
        try {
          const { data } = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistID}/followers/contains?ids=${id}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          followsSoundcheck = data[0];
        } catch {}

        if (followsSoundcheck) {
          user.playlistID = playlistID;
        } else {
          const {
            data: { id: _playlistID },
          } = await axios.post(
            `https://api.spotify.com/v1/users/${id}/playlists`,
            {
              name: "Soundcheck!",
              public: false,
              collaborative: false,
              description: "Liked songs from Soundcheck!",
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          // add image to playlist
          // await axios.put(
          //   `https://api.spotify.com/v1/playlists/${_playlistID}/images`,
          //   {
          //     url: "",
          //   },
          //   {
          //     headers: {
          //       Authorization: `Bearer ${access_token}`,
          //     },
          //   }
          // );

          await client.patch(id).set({ playlistID: _playlistID }).commit();
          user.playlistID = _playlistID;
        }

        user.accessToken = access_token;

        return true;
      } catch {
        await client.delete(newUserId).commit();
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    error: process.env.NEXT_PUBLIC_URL,
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
});
