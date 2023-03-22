import dayjs from "dayjs";
import axios from "axios";

export default async function postComment({
  comment,
  setComment,
  post,
  setPost,
  session,
  badWordsFilter,
  commentRef,
}) {
  if (badWordsFilter.isProfane(comment.text)) {
    setComment({
      ...comment,
      type: comment.type,
      error: "Please do not use profanity.",
    });
    commentRef.current.focus();
    return;
  }
  const originalComments = post?.comments || [];
  setComment({
    ...comment,
    isLoading: true,
  });
  try {
    const now = dayjs().toISOString();
    if (comment.type === "post") {
      setPost({
        ...post,
        comments: [
          {
            text: comment.text,
            createdAt: now,
            userId: session.user.id,
            username: session.user.name,
            userImage: session.user.image,
          },
          ...originalComments,
        ],
      });
    } else {
      setPost({
        ...post,
        comments: originalComments
          .map((c) =>
            c.createdAt === comment.editedAt
              ? {
                  ...c,
                  text: comment.text,
                  createdAt: now,
                }
              : c
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      });
    }
    await axios.post("/api/protected/comment", {
      postID: post?._id,
      userId: session?.user?.id,
      text: comment.text,
      createdAt: comment.type === "post" ? now : comment.editedAt,
      type: comment.type,
    });
    setComment({
      ...comment,
      text: "",
      originalText: "",
      type: "",
      editedAt: "",
      isLoading: false,
    });
  } catch {
    setPost({
      ...post,
      comments: originalComments,
    });
    setComment({
      ...comment,
      text: "",
      originalText: "",
      type: "",
      editedAt: "",
      isLoading: false,
    });
  }
}
