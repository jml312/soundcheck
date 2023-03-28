import client from "@/lib/sanity";
import { notificationsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, newNotifications } = req.query;

  try {
    switch (req.method) {
      case "GET":
        const userNotifications = await client.fetch(notificationsQuery, {
          userId,
        });
        return res.status(200).send(userNotifications);
      case "DELETE":
        await client
          .patch(userId)
          .set({
            notifications: newNotifications,
          })
          .commit();
        return res.status(200).json({ message: "Success" });
    }
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
