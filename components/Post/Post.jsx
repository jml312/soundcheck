import { Flex, useMantineTheme, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import PostModal from "../modals/PostModal";
import TopSection from "./TopSection";
import MiddleSection from "./MiddleSection";
import BottomSection from "./BottomSection";

function Post({
  post,
  setPost,
  isUser = false,
  isPostModal = false,
  isSelect = false,
  isDiscover = false,
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
      />

      <Flex
        bg="lightGray"
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
          caption={caption}
          setCaption={setCaption}
          captionRef={captionRef}
          theme={theme}
        />
        {/* comment, view comments button, and posted at */}
        <BottomSection
          isPostModal={isPostModal}
          isSelect={isSelect}
          isDiscover={isDiscover}
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