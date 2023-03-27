import client from "@/lib/sanity";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, userId,  toFollowId } = req.body;

  try {
    if (type === "follow") {
      const key = dayjs().toISOString();
      await client
        .patch(userId)
        .append("following", [
          {
            _type: "reference",
            _ref: toFollowId,
            _key: key,
          },
        ])
        .commit();
      await client
        .patch(toFollowId)
        .append("followers", [
          {
            _type: "reference",
            _ref: userId,
            _key: key,
          },
        ])
        .append("notifications", [
          {
            _type: "notification",
            _key: key,
            type: "follow",
            user: {
              _type: "reference",
              _ref: userId,
            },
            createdAt: key,
          },
        ])
        .commit();
    } else if (type === "unfollow") {
      await client
        .patch(userId)
        .unset([`following[_ref == \"${toFollowId}\"]`])
        .commit();
      await client
        .patch(toFollowId)
        .unset([`followers[_ref == \"${userId}\"]`])
        .unset([
          `notifications[type == \"follow\" && user._ref == \"${userId}\"]`,
        ])
        .commit();
    }

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
