import axios from "axios";

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
    await axios.delete("/api/protected/comment", {
      data: {
        postID: post?._id,
        userId,
        postUserId: post?.userId,
        mentions,
        createdAt,
        type: "delete",
      },
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
