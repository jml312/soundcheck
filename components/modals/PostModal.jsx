import Post from "../Post";
import { useState } from "react";
import { Modal } from "@mantine/core";

export default function PostModal({
  opened,
  close,
  post,
  setPost,
  isUser = false,
  currentlyPlaying,
  setCurrentlyPlaying,
  caption,
  setCaption,
  session,
  numComments,
  badWordsFilter,
}) {
  const hasCommented = post?.comments?.some(
    (comment) => comment.userId === session?.user?.id
  );
  const [comment, setComment] = useState({
    text: "",
    originalText: "",
    type: !hasCommented ? "post" : "", // "post" or "edit"
    error: "",
    editedAt: "",
    isLoading: false,
    isDeleting: false,
    addedEmoji: false,
  });

  return (
    <Modal
      yOffset={hasCommented && !comment.type ? "2vh" : "5vh"}
      centered={!hasCommented || comment.type}
      size="auto"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={() => {
        if (!comment.isLoading && !comment.isDeleting && !caption?.isLoading) {
          setComment({
            text: "",
            originalText: "",
            type: numComments === 0 ? "post" : "",
            editedAt: "",
            isLoading: false,
            isDeleting: false,
            addedEmoji: false,
          });
          close();
        }
      }}
      withCloseButton={false}
      padding={0}
      trapFocus={false}
    >
      <Post
        post={post}
        setPost={setPost}
        isUser={isUser}
        isPostModal
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
        comment={comment}
        setComment={setComment}
        caption={caption}
        setCaption={setCaption}
        session={session}
        badWordsFilter={badWordsFilter}
      />
    </Modal>
  );
}
