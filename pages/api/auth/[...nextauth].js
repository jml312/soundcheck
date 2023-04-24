import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import client from "@/lib/sanity";
import {
  createPlaylist,
  checkFollowsSoundcheck,
  deleteUser,
  getTZDate,
} from "@/utils";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
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
          createdAt: getTZDate().toISOString(),
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

        const followsSoundcheck = await checkFollowsSoundcheck({
          id,
          accessToken: access_token,
          playlistID,
        });

        user.playlistID = followsSoundcheck
          ? playlistID
          : await createPlaylist({ id, accessToken: access_token, client });

        user.accessToken = access_token;

        return true;
      } catch (e) {
        console.log(e.message, e);
        await deleteUser({ client, newUserId });
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
    signIn: process.env.NEXT_PUBLIC_URL,
    error: process.env.NEXT_PUBLIC_URL,
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
});
