import client from "@/lib/sanity";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postID, name, type, createdAt, playlistID, songID, accessToken } =
    req.body;

  try {
    if (type === "like") {
      await client
        .patch(name)
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
              _ref: name,
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
        .patch(name)
        .unset([`likes[_ref == \"${postID}\"]`])
        .commit();
      await client
        .patch(postID)
        .unset([`likes[user._ref == \"${name}\"]`])
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
