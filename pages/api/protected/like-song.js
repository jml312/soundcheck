import client from "@/lib/sanity";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, type, idx, post, playlistID, songID, accessToken } = req.body;

  try {
    await client
      .patch(userId)
      .insert("replace", `discoverSongs[${idx}]`, [
        {
          ...post,
        },
      ])
      .commit();

    if (type === "like") {
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
  } catch (e) {
    console.log(e.message, e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
