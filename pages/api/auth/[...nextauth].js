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
      try {
        const { name, email, image } = user;
        const { playlistID } = await client.createIfNotExists({
          _type: "user",
          _id: name,
          name,
          email,
          image,
          postStreak: 0,
          createdAt: dayjs().toISOString(),
          posts: [],
          likes: [],
          comments: [],
          following: [],
          followers: [],
        });

        let followsSoundcheck = false;
        try {
          const { data } = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistID}/followers/contains?ids=${name}`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );
          followsSoundcheck = data[0];
        } catch {}

        if (followsSoundcheck) {
          user.playlistID = playlistID;
        } else {
          const {
            data: { id },
          } = await axios.post(
            `https://api.spotify.com/v1/users/${name}/playlists`,
            {
              name: "Soundcheck!",
              public: false,
              collaborative: false,
              description: "Liked songs from Soundcheck!",
            },
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          await client.patch(name).set({ playlistID: id }).commit();
          user.playlistID = id;
        }

        user.access_token = account.access_token;

        return true;
      } catch {
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
