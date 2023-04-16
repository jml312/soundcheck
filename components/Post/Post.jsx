import { Flex, useMantineTheme, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import PostModal from "../modals/PostModal";
import TopSection from "./TopSection";
import MiddleSection from "./MiddleSection";
import BottomSection from "./BottomSection";

/**
 * @param {object} post - The post object
 * @param {function} setPost - The setPost function
 * @param {boolean} isUser - The isUser boolean
 * @param {boolean} isPostModal - The isPostModal boolean
 * @param {boolean} isSelect - The isSelect boolean
 * @param {boolean} isDiscover - The isDiscover boolean
 * @param {boolean} isProfile - The isProfile boolean
 * @param {object} currentlyPlaying - The currentlyPlaying object
 * @param {function} setCurrentlyPlaying - The setCurrentlyPlaying function
 * @param {object} selectedSong - The selectedSong object
 * @param {function} setSelectedSong - The setSelectedSong function
 * @param {object} session - The session object
 * @param {object} comment - The comment object
 * @param {function} setComment - The setComment function
 * @param {string} caption - The caption string
 * @param {function} setCaption - The setCaption function
 * @param {object} captionRef - The captionRef object
 * @param {object} badWordsFilter - The badWordsFilter object
 * @param {boolean} isPosting - The isPosting boolean
 * @param {array} allUsers - The allUsers array
 * @param {object} activePost - The activePost object
 * @param {function} setActivePost - The setActivePost function
 * @param {boolean} isSmall - The isSmall boolean
 * @param {number} idx - The idx number
 * @description A post component
 */
function Post({
  post,
  setPost,
  isUser = false,
  isPostModal = false,
  isSelect = false,
  isDiscover = false,
  isProfile = false,
  currentlyPlaying,
  setCurrentlyPlaying,
  selectedSong,
  setSelectedSong,
  session,
  comment,
  setComment,
  caption,
  setCaption,
  captionRef,
  badWordsFilter,
  isPosting,
  allUsers,
  activePost,
  setActivePost,
  isSmall,
  idx,
}) {
  const router = useRouter();
  const {
    postId: notificationPostId,
    commentId: notificationCommentId,
    type,
  } = router.query;
  const theme = useMantineTheme();
  const [postModalOpen, { open: openPostModal, close: closePostModal }] =
    useDisclosure(
      !isPostModal &&
        !isSelect &&
        !isDiscover &&
        notificationPostId === post?._id &&
        type === "like"
    );
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    setActivePost(null);
  }, [postModalOpen]);

  useEffect(() => {
    if (
      !isPostModal &&
      !isDiscover &&
      !isSelect &&
      notificationPostId === post?._id
    ) {
      openPostModal();
      if (["like", "comment", "mention"].includes(type)) {
        router.replace(
          {
            pathname: "/feed",
            query: {},
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [notificationPostId]);

  return (
    <>
      <PostModal
        opened={postModalOpen}
        close={closePostModal}
        post={post}
        setPost={setPost}
        isUser={isUser}
        session={session}
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
        caption={caption}
        setCaption={setCaption}
        badWordsFilter={badWordsFilter}
        notificationPostId={notificationPostId}
        notificationCommentId={notificationCommentId}
        allUsers={allUsers}
        isSmall={isSmall}
        isProfile={isProfile}
        isLikeLoading={isLikeLoading}
        setIsLikeLoading={setIsLikeLoading}
        isFollowLoading={isFollowLoading}
        setIsFollowLoading={setIsFollowLoading}
      />

      <Flex
        bg={theme.colors.contrast[theme.colorScheme]}
        justify={"center"}
        align={"center"}
        direction={"column"}
        px={"1.5rem"}
        pt=".85rem"
        maw={425}
        mah={"100%"}
        sx={{
          borderRadius: "0.5rem !important",
          position: "relative",
        }}
        style={{
          scrollSnapAlign: !isSelect && "start",
        }}
      >
        <LoadingOverlay
          visible={
            comment?.isLoading ||
            comment?.isDeleting ||
            isLikeLoading ||
            isFollowLoading
          }
          overlayOpacity={0.55}
          overlayBlur={3}
        />
        {/* user info, like, follow and caption */}
        <TopSection
          isPostModal={isPostModal}
          isUser={isUser}
          isSelect={isSelect}
          isDiscover={isDiscover}
          isProfile={isProfile}
          post={post}
          setPost={setPost}
          session={session}
          isPosting={isPosting}
          caption={caption}
          setCaption={setCaption}
          captionRef={captionRef}
          isLikeLoading={isLikeLoading}
          setIsLikeLoading={setIsLikeLoading}
          isFollowLoading={isFollowLoading}
          setIsFollowLoading={setIsFollowLoading}
          isSmall={isSmall}
          idx={idx}
        />
        {/* song image and details */}
        <MiddleSection
          isPostModal={isPostModal}
          isSelect={isSelect}
          isDiscover={isDiscover}
          isSmall={isSmall}
          postModalOpen={postModalOpen}
          post={post}
          activePost={activePost}
          setActivePost={setActivePost}
          currentlyPlaying={currentlyPlaying}
          setCurrentlyPlaying={setCurrentlyPlaying}
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          setCaption={setCaption}
          captionRef={captionRef}
        />
        {/* comment, view comments button, and posted at */}
        <BottomSection
          isPostModal={isPostModal}
          isSelect={isSelect}
          isDiscover={isDiscover}
          isProfile={isProfile}
          post={post}
          setPost={setPost}
          comment={comment}
          setComment={setComment}
          session={session}
          allUsers={allUsers}
          isLikeLoading={isLikeLoading}
          isFollowLoading={isFollowLoading}
          setCurrentlyPlaying={setCurrentlyPlaying}
          openPostModal={openPostModal}
          badWordsFilter={badWordsFilter}
          notificationPostId={notificationPostId}
          notificationCommentId={notificationCommentId}
          type={type}
          router={router}
          isSmall={isSmall}
        />
      </Flex>
    </>
  );
}

export default Post;
