import client from "@/lib/sanity";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, userId, toFollowId } = req.body;

  try {
    if (type === "follow") {
      const createdAt = dayjs().toISOString();
      await client
        .patch(userId)
        .append("following", [
          {
            _type: "reference",
            _ref: toFollowId,
            _key: createdAt,
          },
        ])
        .commit();
      await client
        .transaction()
        .patch(toFollowId, (p) =>
          p.append("followers", [
            {
              _type: "reference",
              _ref: userId,
              _key: createdAt,
            },
          ])
        )
        .patch(toFollowId, (p) =>
          p.append("notifications", [
            {
              _type: "notification",
              _key: `follow.${userId}`,
              type: "follow",
              user: {
                _type: "reference",
                _ref: userId,
              },
              createdAt,
            },
          ])
        )
        .commit();
    } else if (type === "unfollow") {
      await client
        .patch(userId)
        .unset([`following[_ref == \"${toFollowId}\"]`])
        .commit();
      await client
        .transaction()
        .patch(toFollowId, (p) => p.unset([`followers[_ref == \"${userId}\"]`]))
        .patch(toFollowId, (p) =>
          p.unset([`notifications[_key == \"${`follow.${userId}`}\"]`])
        )
        .commit();
    }
    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
