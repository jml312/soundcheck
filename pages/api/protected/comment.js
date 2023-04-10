import client from "@/lib/sanity";
// import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postID, userId, postUserId, text, mentions, createdAt, type } =
    req.body;

  if (!["post", "delete"].includes(type)) {
    return res.status(400).json({ message: "Bad request" });
  }

  const isUserComment = userId === postUserId;

  try {
    if (type === "delete") {
      // delete comment from post
      await client
        .patch(postID)
        .unset([`comments[_key == \"${createdAt}\"]`])
        .commit();
      // delete comment from user
      await client
        .patch(userId)
        .unset([`comments[_key == \"${createdAt}\"]`])
        .commit();
      // delete notification from post user if they are not mentioned
      if (!isUserComment && !mentions?.includes(postUserId)) {
        await client
          .patch(postUserId)
          .unset([
            `notifications[_key == \"comment.${userId}.${postID}.${createdAt}\"]`,
          ])
          .commit();
      }
      // delete notification from mentioned users
      else if (!isUserComment && mentions?.length > 0) {
        await Promise.all(
          mentions.map(async (mentionUserId) => {
            await client
              .patch(mentionUserId)
              .unset([
                `notifications[_key == \"mention.${userId}.${postID}.${createdAt}\"]`,
              ])
              .commit();
          })
        );
      }
    } else if (type === "post") {
      const newComment = {
        _key: createdAt,
        _type: "comment",
        text,
        user: {
          _type: "reference",
          _ref: userId,
        },
        createdAt,
      };
      // add comment to post
      await client
        .patch(userId)
        .append("comments", [
          {
            _type: "reference",
            _ref: postID,
            _key: createdAt,
          },
        ])
        .commit();
      // add comment to user
      await client.patch(postID).append("comments", [newComment]).commit();
      // add notification to post user if they are not mentioned
      if (!isUserComment && !mentions?.includes(postUserId)) {
        await client
          .patch(postUserId)
          .append("notifications", [
            {
              _type: "notification",
              _key: `comment.${userId}.${postID}.${createdAt}`,
              type: "comment",
              user: {
                _type: "reference",
                _ref: userId,
              },
              post: {
                _type: "reference",
                _ref: postID,
              },
              commentId: createdAt,
              createdAt,
            },
          ])
          .commit();
      }
      // add notification to mentioned users
      else if (!isUserComment && mentions?.length > 0) {
        await Promise.all(
          mentions.map(async (mentionUserId) => {
            await client
              .patch(mentionUserId)
              .append("notifications", [
                {
                  _type: "notification",
                  _key: `mention.${userId}.${postID}.${createdAt}`,
                  type: "mention",
                  post: {
                    _type: "reference",
                    _ref: postID,
                  },
                  commentId: createdAt,
                  user: {
                    _type: "reference",
                    _ref: userId,
                  },
                  createdAt,
                },
              ])
              .commit();
          })
        );
      }
    }
    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
