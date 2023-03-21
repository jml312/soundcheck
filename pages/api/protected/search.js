import client from "@/lib/sanity";
import { postsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { startDate, endDate, todayStart, todayEnd, name } = req.query;

    const currentPosts = await client.fetch(postsQuery, {
      startDate,
      endDate,
      todayStart,
      todayEnd,
      name,
    });

    return res.status(200).send(currentPosts);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
