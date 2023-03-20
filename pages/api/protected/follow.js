import client from "@/lib/sanity";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, name, toFollowName } = req.body;

  try {
    if (type === "follow") {
      const key = dayjs().toISOString();
      await client
        .patch(name)
        .append("following", [
          {
            _type: "reference",
            _ref: toFollowName,
            _key: key,
          },
        ])
        .commit();
      await client
        .patch(toFollowName)
        .append("followers", [
          {
            _type: "reference",
            _ref: name,
            _key: key,
          },
        ])
        .commit();
    } else if (type === "unfollow") {
      await client
        .patch(name)
        .unset([`following[_ref == \"${toFollowName}\"]`])
        .commit();
      await client
        .patch(toFollowName)
        .unset([`followers[_ref == \"${name}\"]`])
        .commit();
    }

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
