import client from "@/lib/sanity";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    caption,
    songName,
    songUrl,
    previewUrl,
    artists,
    albumName,
    albumUrl,
    albumImage,
    name,
    songID,
  } = req.body;

  try {
    const today = dayjs().toISOString();
    const { _id } = await client.create({
      _type: "post",
      caption,
      songName,
      songUrl,
      previewUrl,
      artists,
      albumName,
      albumUrl,
      albumImage,
      songID,
      likes: [],
      comments: [],
      createdAt: today,
      user: {
        _type: "reference",
        _ref: name,
      },
    });

    await client
      .patch(name)
      .inc({ postStreak: 1 })
      .append("posts", [
        {
          _type: "reference",
          _ref: _id,
          _key: today,
        },
      ])
      .commit();

    return res.status(200).json({ message: "Success", _id });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
