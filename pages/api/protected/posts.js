import client from "@/lib/sanity";
import { postsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, currentDate } = req.query;

    const currentPosts = await client.fetch(postsQuery, {
      userId,
      currentDate,
    });

    return res.status(200).send(currentPosts);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
