import client from "@/lib/sanity";
import { notificationsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    if (req.method === "POST") {
      const { userId, newNotifications } = req.body;
      await client
        .patch(userId)
        .set({
          notifications: newNotifications,
        })
        .commit();
    } else if (req.method === "GET") {
      const { userId } = req.query;
      const userNotifications = await client.fetch(notificationsQuery, {
        userId,
      });
      return res.status(200).send(userNotifications);
    }

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
