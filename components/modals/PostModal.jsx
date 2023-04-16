import Post from "../Post/Post";
import { useState } from "react";
import { Modal, LoadingOverlay } from "@mantine/core";

/**
 * @param {boolean} opened - The opened boolean
 * @param {function} close - The close function
 * @param {object} post - The post object
 * @param {function} setPost - The setPost function
 * @param {boolean} isUser - The isUser boolean
 * @param {object} session - The session object
 * @param {object} currentlyPlaying - The currentlyPlaying object
 * @param {function} setCurrentlyPlaying - The setCurrentlyPlaying function
 * @param {object} caption - The caption object
 * @param {function} setCaption - The setCaption function
 * @param {object} badWordsFilter - The badWordsFilter object
 * @param {string} notificationPostId - The notificationPostId string
 * @param {string} notificationCommentId - The notificationCommentId string
 * @param {array} allUsers - The allUsers array
 * @param {boolean} isSmall - The isSmall boolean
 * @param {boolean} isProfile - The isProfile boolean
 * @param {boolean} isLikeLoading - The isLikeLoading boolean
 * @param {function} setIsLikeLoading - The setIsLikeLoading function
 * @param {boolean} isFollowLoading - The isFollowLoading boolean
 * @param {function} setIsFollowLoading - The setIsFollowLoading function
 * @description A post modal component
 */
export default function PostModal({
  opened,
  close,
  post,
  setPost,
  isUser = false,
  session,
  currentlyPlaying,
  setCurrentlyPlaying,
  caption,
  setCaption,
  badWordsFilter,
  notificationPostId,
  notificationCommentId,
  allUsers,
  isSmall,
  isProfile,
  isLikeLoading,
  setIsLikeLoading,
  isFollowLoading,
  setIsFollowLoading,
}) {
  const [comment, setComment] = useState({
    text: "",
    error: "",
    addedEmoji: false,
    isLoading: false,
    isDeleting: false,
    isMentioning: false,
    isFocused: false,
  });
  const [activePost, setActivePost] = useState(null);

  return (
    <Modal
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
            error: "",
            addedEmoji: false,
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
        isSmall={isSmall}
        isProfile={isProfile}
        isLikeLoading={isLikeLoading}
        setIsLikeLoading={setIsLikeLoading}
        isFollowLoading={isFollowLoading}
        setIsFollowLoading={setIsFollowLoading}
      />
    </Modal>
  );
}
