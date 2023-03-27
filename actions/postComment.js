import dayjs from "dayjs";
import axios from "axios";

export default async function postComment({
  comment,
  setComment,
  post,
  setPost,
  session,
  badWordsFilter,
  commentScrollRef,
  setHasBlurredCommentError,
  allUsers,
}) {
  if (badWordsFilter.isProfane(comment.text)) {
    setHasBlurredCommentError(false);
    setComment({
      ...comment,
      error: "Please do not use profanity.",
    });
    return;
  }
  const originalComments = post?.comments || [];
  setComment({
    ...comment,
    isLoading: true,
  });
  try {
    const mentions = [
      ...new Set(
        comment.text
          .split(" ")
          .filter(
            (word) =>
              word.startsWith("@") &&
              word.slice(1) !== session.user.name &&
              splitText.slice(0, i).join(" ").length + (i === 0 ? 0 : 1) &&
              allUsers?.some((user) => user.username === word.slice(1))
          )
          .map(
            (word) =>
              allUsers.find((user) => user.username === word.slice(1)).userId
          )
      ),
    ];
    const now = dayjs().toISOString();
    await axios.post("/api/protected/comment", {
      postID: post?._id,
      userId: session?.user?.id,
      postUserId: post?.userId,
      text: comment.text,
      mentions,
      createdAt: now,
      type: "post",
    });
    setPost({
      ...post,
      comments: [
        ...originalComments,
        {
          text: comment.text,
          createdAt: now,
          userId: session.user.id,
          username: session.user.name,
          userImage: session.user.image,
        },
      ],
    });
    setComment({
      ...comment,
      text: "",
      isLoading: false,
    });
    setTimeout(() => {
      commentScrollRef?.current?.scrollTo({
        top: commentScrollRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  } catch {
    setPost({
      ...post,
      comments: originalComments,
    });
    setComment({
      ...comment,
      text: "",
      isLoading: false,
    });
  }
}
