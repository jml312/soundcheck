import client from "@/lib/sanity";
import { postsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, todayStart, todayEnd } = req.query;

    const currentPosts = await client.fetch(postsQuery, {
      userId,
      todayStart,
      todayEnd,
    });

    return res.status(200).send(currentPosts);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
