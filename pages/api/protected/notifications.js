import client from "@/lib/sanity";
import { notificationsQuery } from "@/lib/queries";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    switch (req.method) {
      case "GET":
        const userNotifications = await client.fetch(notificationsQuery, {
          userId: req?.query?.userId,
        });
        return res.status(200).send(userNotifications);
      case "DELETE":
        await client
          .patch(req?.body?.userId)
          .set({
            notifications: req?.body?.newNotifications,
          })
          .commit();
        return res.status(200).json({ message: "Success" });
    }
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
