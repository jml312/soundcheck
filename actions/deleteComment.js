import axios from "axios";

export default async function deleteComment({
  userId,
  createdAt,
  post,
  setPost,
  comment,
  setComment,
}) {
  const originalPost = post;
  setComment({
    ...comment,
    isDeleting: true,
  });
  try {
    setPost({
      ...post,
      comments: post?.comments?.filter(
        (comment) => comment.createdAt !== createdAt
      ),
    });
    await axios.delete("/api/protected/comment", {
      data: {
        postID: post?._id,
        userId,
        createdAt,
        type: "delete",
      },
    });
    setComment({
      ...comment,
      isDeleting: false,
    });
  } catch {
    setComment({
      ...comment,
      isDeleting: false,
    });
    setPost({
      ...originalPost,
    });
  }
}
