import client from "@/lib/sanity";
import axios from "axios";
import { getDiscoverSongs } from "@/actions";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postID, userId, type, createdAt, playlistID, songID, accessToken } =
    req.body;

  try {
    if (type === "like") {
      const session = await getSession({ req });
      const recommendations = await getDiscoverSongs({
        userId: session.user.id,
        accessToken: session.user.accessToken,
        client,
      });

      await client
        .patch(userId)
        .set({
          discoverSongs: recommendations,
        })
        .append("likes", [
          {
            _type: "reference",
            _ref: postID,
            _key: createdAt,
          },
        ])
        .commit();
      await client
        .patch(postID)
        .append("likes", [
          {
            _type: "like",
            _key: createdAt,
            createdAt,
            user: {
              _type: "reference",
              _ref: userId,
            },
          },
        ])
        .commit();
      try {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
          {
            uris: [`spotify:track:${songID}`],
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch {}
    } else if (type === "unlike") {
      await client
        .patch(userId)
        .unset([`likes[_ref == \"${postID}\"]`])
        .commit();
      await client
        .patch(postID)
        .unset([`likes[user._ref == \"${userId}\"]`])
        .commit();

      try {
        await axios.delete(
          `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: {
              tracks: [{ uri: `spotify:track:${songID}` }],
            },
          }
        );
      } catch {}
    }

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
