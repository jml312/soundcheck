import client from "@/lib/sanity";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postID, userId, text, createdAt, type } = req.body;

  if (!["post", "edit", "delete"].includes(type)) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    if (type === "delete") {
      await client
        .patch(postID)
        .unset([`comments[_key == \"${createdAt}\"]`])
        .commit();
      await client
        .patch(userId)
        .unset([`comments[_key == \"${createdAt}\"]`])
        .commit();
    } else if (["post", "edit"].includes(type)) {
      let created = createdAt;
      if (type === "edit") {
        await client
          .patch(postID)
          .unset([`comments[_key == \"${createdAt}\"]`])
          .commit();
        await client
          .patch(userId)
          .unset([`comments[_key == \"${createdAt}\"]`])
          .commit();
        created = dayjs().toISOString();
      }
      const newComment = {
        _key: created,
        _type: "comment",
        text,
        user: {
          _type: "reference",
          _ref: userId,
        },
        createdAt: created,
      };
      await client
        .patch(userId)
        .append("comments", [
          {
            _type: "reference",
            _ref: postID,
            _key: created,
          },
        ])
        .commit();
      await client.patch(postID).append("comments", [newComment]).commit();
    }
    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
