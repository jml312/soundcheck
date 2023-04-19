import { getTZDate } from "@/utils";
import axios from "axios";

/**
 * @param {Object} comment
 * @param {Function} setComment
 * @param {Object} post
 * @param {Function} setPost
 * @param {Object} session
 * @param {Object} badWordsFilter
 * @param {Array} allUsers
 * @param {Function} setIsCommentCreated
 * @description Posts a comment
 */
export default async function postComment({
  comment,
  setComment,
  post,
  setPost,
  session,
  badWordsFilter,
  allUsers,
  setIsCommentCreated,
}) {
  if (badWordsFilter.isProfane(comment.text)) {
    setComment({
      ...comment,
      error: "Please don't use profanity.",
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
    const now = getTZDate().toISOString();
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
    setIsCommentCreated(true);
    setComment({
      ...comment,
      text: "",
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
      isLoading: false,
    });
  }
}
