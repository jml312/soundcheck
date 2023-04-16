import axios from "axios";

/**
 * @param {string} userId
 * @param {string} createdAt
 * @param {Object} post
 * @param {Function} setPost
 * @param {string} text
 * @param {Function} setComment
 * @param {Array} allUsers
 * @param {Object} session
 * @description Deletes a comment from a post
 */
export default async function deleteComment({
  userId,
  createdAt,
  post,
  setPost,
  text,
  setComment,
  allUsers,
  session,
}) {
  const originalPost = post;
  setComment((prev) => ({
    ...prev,
    isDeleting: true,
  }));

  try {
    const mentions = [
      ...new Set(
        text
          .split(" ")
          .filter(
            (word) =>
              word[0] === "@" &&
              word.slice(1) !== session.user.name &&
              allUsers.some((user) => user.username === word.slice(1))
          )
          .map(
            (word) =>
              allUsers.find((user) => user.username === word.slice(1)).userId
          )
      ),
    ];
    await axios.post("/api/protected/comment", {
      postID: post?._id,
      userId,
      postUserId: post?.userId,
      mentions,
      createdAt,
      type: "delete",
    });
    setPost({
      ...post,
      comments: post?.comments?.filter((c) => c.createdAt !== createdAt),
    });
    setComment((prev) => ({
      ...prev,
      text: "",
      isDeleting: false,
    }));
  } catch {
    setComment((prev) => ({
      ...prev,
      text,
      isDeleting: false,
    }));
    setPost({
      ...originalPost,
    });
  }
}
