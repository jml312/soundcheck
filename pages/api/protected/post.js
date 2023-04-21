import client from "@/lib/sanity";
import { getDiscoverSongs } from "@/actions";
import { getTZDate } from "@/utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    songName,
    songUrl,
    caption,
    artists,
    previewUrl,
    genres,
    albumName,
    albumUrl,
    albumImage,
    userId,
    accessToken,
    songID,
  } = req.body;

  try {
    const date = getTZDate();
    const today = date.toISOString();
    const postID = `post-${userId}-${date.format("YYYY-MM-DD")}`;
    const { _id } = await client.createIfNotExists({
      _id: postID,
      _type: "post",
      songName,
      songUrl,
      previewUrl,
      artists,
      genres,
      albumName,
      albumUrl,
      albumImage,
      songID,
      createdAt: today,
      caption,
      user: {
        _type: "reference",
        _ref: userId,
      },
      likes: [],
      comments: [],
    });

    const recommendations = await getDiscoverSongs({
      userId,
      accessToken,
      client,
    });

    const results = await client
      .transaction()
      .patch(userId, (p) => p.inc({ postStreak: 1 }))
      .patch(userId, (p) => {
        if (recommendations.length > 0) {
          p.set({ discoverSongs: recommendations });
        }
        return p;
      })
      .patch(userId, (p) => p.unset(["recentlyPlayed"]))
      .patch(userId, (p) =>
        p.append("posts", [{ _type: "reference", _ref: _id, _key: today }])
      )
      .commit({
        returnDocuments: true,
        visibility: "async",
      });

    return res
      .status(200)
      .json({ message: "Success", _id, postStreak: results[0].postStreak });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
