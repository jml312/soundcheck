import Post from "../Post";
import { useState, useEffect } from "react";
import { Modal, LoadingOverlay } from "@mantine/core";

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
  notificationPostId,
  notificationCommentId,
  allUsers,
}) {
  const [comment, setComment] = useState({
    text: "",
    error: "",
    isLoading: false,
    isDeleting: false,
    isMentioning: false,
    isFocused: false,
  });
  const [activePost, setActivePost] = useState(null);

  return (
    <Modal
      // yOffset={"3vh"}
      // yOffset={"2vh"}
      centered
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
            isLoading: false,
            isDeleting: false,
            isMentioning: false,
            isFocused: false,
          });
          setActivePost(null);
          close();
        }
      }}
      withCloseButton={false}
      padding={0}
      trapFocus={false}
    >
      <LoadingOverlay
        visible={comment.isLoading || comment.isDeleting}
        overlayOpacity={0.55}
        overlayBlur={3}
        zIndex={1000}
      />
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
        notificationPostId={notificationPostId}
        notificationCommentId={notificationCommentId}
        allUsers={allUsers}
        activePost={activePost}
        setActivePost={setActivePost}
      />
    </Modal>
  );
}
