import client from "@/lib/sanity";
import { postsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { startDate, endDate, type, name } = req.query;

    if (!["everyone", "following"].includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Bad request" });
    }

    const { userPost, feedPosts } = await client.fetch(postsQuery, {
      startDate,
      endDate,
      name,
    });

    return res.status(200).json({
      message: "Success",
      userPost,
      feedPosts,
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
