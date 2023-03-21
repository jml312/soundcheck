import client from "@/lib/sanity";
import dayjs from "dayjs";
import { getDiscoverSongs } from "@/actions";
import { getSession } from "next-auth/react";

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
    genres,
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
      genres,
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

    const session = await getSession({ req });
    const recommendations = await getDiscoverSongs({
      name: session.user.name,
      accessToken: session.user.accessToken,
      client,
    });

    await client
      .patch(name)
      .inc({ postStreak: 1 })
      .set({
        discoverSongs: recommendations,
      })
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
