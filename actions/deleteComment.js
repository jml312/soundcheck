import axios from "axios";

export default async function deleteComment({
  userId,
  createdAt,
  post,
  setPost,
  comment,
  setComment,
  commentsRef,
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
        postUserId: post?.userId,
        userId,
        createdAt,
        type: "delete",
      },
    });
    setComment({
      ...comment,
      type: originalPost?.comments?.length - 1 === 0 ? "post" : "",
      isDeleting: false,
    });
    setTimeout(() => {
      commentsRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
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
