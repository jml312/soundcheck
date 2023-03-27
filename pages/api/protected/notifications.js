import client from "@/lib/sanity";
import { notificationsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;

  try {
    const userNotifications = await client.fetch(notificationsQuery, {
      userId,
    });
    return res.status(200).send(userNotifications);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
