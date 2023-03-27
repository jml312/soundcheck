import {
  Flex,
  Image,
  Title,
  Text,
  ActionIcon,
  RingProgress,
  Center,
  UnstyledButton,
  useMantineTheme,
  Tooltip,
  Stack,
  ScrollArea,
  Avatar,
  Button,
  TextInput,
  Textarea,
  Group,
  LoadingOverlay,
  Box,
  Popover,
} from "@mantine/core";
import Link from "next/link";
import { FaHeart, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { BsSpotify, BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { useRef, useEffect, useState, useMemo } from "react";
import { truncateText } from "@/utils";
import PostModal from "./modals/PostModal";
import { AiOutlineSend } from "react-icons/ai";
import { useDisclosure, useHover, useMediaQuery } from "@mantine/hooks";
import CommentCard from "./cards/CommentCard";
import { likePost, followUser, captionPost, postComment } from "@/actions";
import dayjs from "dayjs";
import { COMMENT_MAX_LENGTH, CAPTION_MAX_LENGTH } from "@/constants";
import { VscAdd, VscRemove } from "react-icons/vsc";

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
  badWordsFilter,
  notificationPostId,
  notificationCommentId,
  isPosting,
  allUsers,
  activePost,
  setActivePost,
}) {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const { hovered: imageHovered, ref: imageRef } = useHover();
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const isSmall = useMediaQuery("(max-width: 470px)");
  const [postModalOpen, { open: openPostModal, close: closePostModal }] =
    useDisclosure(
      !isPostModal &&
        !isSelect &&
        !isDiscover &&
        notificationPostId === post?._id
    );
  const isActivePost = postModalOpen
    ? isPostModal && activePost === post?._id
    : activePost === post?._id;
  const imageFocused = isSmall
    ? isActivePost || isAudioPlaying
    : isActivePost || imageHovered || isAudioPlaying;
  const artists = post?.artists?.map((artist) => artist.name)?.join(", ");
  const numComments = post?.comments?.length || 0;
  const commentInputRef = useRef(null);
  const commentScrollRef = useRef(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const captionRef = useRef(null);
  const theme = useMantineTheme();
  const [hasBlurredCaptionError, setHasBlurredCaptionError] = useState(false);
  const [hasBlurredCommentError, setHasBlurredCommentError] = useState(false);
  const formattedPostedAt = useMemo(
    () => dayjs(post?.createdAt).fromNow(),
    [post]
  );

  const getViewCommentText = () => {
    if (numComments === 0) {
      return "Add a comment...";
    } else if (numComments === 1) {
      return "View comment";
    } else if (numComments < 10) {
      return `View all ${numComments} comments`;
    }
    return "View all comments";
  };

  useEffect(() => {
    audioRef.current.addEventListener("play", () => {
      setCurrentlyPlaying(post?._id);
      setActivePost(post?._id);
      setIsAudioPlaying(true);
    });
    audioRef.current.addEventListener("pause", () => {
      if (audioRef?.current?.currentTime) {
        audioRef.current.currentTime = 0;
      }
      setIsAudioPlaying(false);
      if (currentlyPlaying === post?._id) {
        setCurrentlyPlaying(null);
      }
      setActivePost(currentlyPlaying);
    });
    audioRef.current.addEventListener("timeupdate", () => {
      if (!audioRef.current) return;
      const percent =
        (audioRef?.current?.currentTime / audioRef?.current?.duration) * 100;
      setAudioProgress(percent);
    });
    audioRef.current.addEventListener("ended", () => {
      setAudioProgress(0);
      setActivePost(post?._id);
      setCurrentlyPlaying(null);
      setIsAudioPlaying(false);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        audioRef?.current?.pause();
        setActivePost(null);
        setCurrentlyPlaying(null);
        setIsAudioPlaying(false);
      }
    });
  }, []);
  useEffect(() => {
    if (currentlyPlaying !== post?._id) {
      audioRef.current.pause();
    }
  }, [currentlyPlaying]);
  useEffect(() => {
    if (
      commentInputRef?.current &&
      !post?.comments?.some((comment) => comment.userId === session?.user?.id)
    ) {
      commentInputRef.current.focus();
      setComment({
        ...comment,
        isFocused: true,
      });
    }
  }, [commentInputRef?.current]);
  useEffect(() => {
    if (selectedSong?.isChanged) {
      setActivePost(null);
      setSelectedSong({
        ...selectedSong,
        isChanged: false,
      });
      setCaption({
        ...caption,
        text: "",
        originalText: "",
        isEditing: true,
        isFocused: true,
      });
      setTimeout(() => {
        captionRef?.current?.focus();
        setIsAudioPlaying(false);
        setAudioProgress(0);
      }, 0);
    }
  }, [selectedSong?.isChanged]);
  useEffect(() => {
    setActivePost(null);
  }, [postModalOpen]);

  return (
    <>
      <PostModal
        opened={postModalOpen}
        close={closePostModal}
        post={post}
        setPost={setPost}
        isUser={isUser}
        isSelect={isSelect}
        session={session}
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
        caption={caption}
        setCaption={setCaption}
        numComments={numComments}
        badWordsFilter={badWordsFilter}
        notificationPostId={notificationPostId}
        notificationCommentId={notificationCommentId}
        allUsers={allUsers}
        activePost={activePost}
        setActivePost={setActivePost}
      />

      {/* <LoadingOverlay
        visible={
          comment?.isLoading || comment?.isDeleting || caption?.isLoading
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        zIndex={1000}
      /> */}

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
        }}
      >
        {/* like + follow */}
        {!isDiscover && (
          <Flex
            w={isPostModal ? "100%" : "275px"}
            justify={"space-between"}
            align={"center"}
            mt={"-.65rem"}
            pb={".2rem"}
            mb={"0.75rem"}
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.colors.lightWhite[7]}`,
            })}
          >
            <Tooltip
              disabled={isSelect || isUser}
              color="dark.7"
              styles={{
                tooltip: {
                  border: "none",
                  outline: "1px solid rgba(192, 193, 196, 0.75)",
                },
              }}
              withinPortal
              shadow="md"
              offset={isSelect ? 5.25 : 3}
              position="top"
              label={
                <>
                  <Group mt={4} spacing={"xs"} align={"start"} pl={1} pt={1}>
                    <Avatar
                      src={post?.userImage}
                      alt={`${post?.username}'s profile`}
                      radius="xl"
                      style={{
                        outline: "1px solid #c0c1c4",
                        transform: "translateY(-2px)",
                      }}
                      size={30}
                    />
                    <Stack
                      spacing={5}
                      sx={{
                        transform: "translateY(-2px)",
                      }}
                    >
                      <Text
                        size="sm"
                        weight={700}
                        sx={{ lineHeight: 1, cursor: "default" }}
                      >
                        {truncateText(post?.username, 19)}
                      </Text>
                      <Group mt={1.5}>
                        <Text
                          color="dimmed"
                          size="xs"
                          sx={{ lineHeight: 1, cursor: "default" }}
                        >
                          {dayjs(post?.joined).format("MMM D, YYYY")}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                  <Group mt={4.5} spacing="sm">
                    <Text
                      size="sm"
                      sx={{
                        cursor: "default",
                        opacity: 0.9,
                      }}
                    >
                      <b>{post?.numFollowing || 0}</b> Following
                    </Text>
                    <Text
                      size="sm"
                      sx={{
                        cursor: "default",
                        opacity: 0.9,
                      }}
                    >
                      <b>{post?.numFollowers || 0}</b> Follower
                      {post?.numFollowers !== 1 && "s"}
                    </Text>
                  </Group>
                </>
              }
            >
              {isSelect || isUser ? (
                <Button
                  ml={"-.3rem"}
                  size={"sm"}
                  compact
                  sx={{
                    cursor: "default",
                    zIndex: 1,
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.75)",
                    backgroundColor: "transparent !important",
                    "&:active": {
                      transform: "none",
                    },
                  }}
                  component="div"
                  leftIcon={
                    <Avatar
                      size={20}
                      src={post?.userImage}
                      alt={`${post?.username}'s profile`}
                      radius={"xl"}
                      style={{
                        outline: "1px solid #c0c1c4",
                      }}
                    />
                  }
                >
                  {truncateText(post?.username, 19)}
                </Button>
              ) : (
                <Link href={`/profile/${post?.userId}`} passHref>
                  <Button
                    ml={isPostModal ? "-.5rem" : "-.3rem"}
                    compact
                    size={isPostModal ? "md" : "sm"}
                    sx={{
                      zIndex: 1,
                      fontSize: isPostModal ? "0.85rem" : "0.75rem",
                      color: "rgba(255, 255, 255, 0.75)",
                      backgroundColor: "transparent !important",
                      cursor: "pointer",
                      transform: "translateY(.1rem)",
                    }}
                    component="a"
                    leftIcon={
                      <Avatar
                        size={20}
                        src={post?.userImage}
                        alt={`${post?.username}'s profile`}
                        radius={"xl"}
                        style={{
                          outline: "1px solid #c0c1c4",
                        }}
                      />
                    }
                  >
                    {truncateText(post?.username, 19)}
                  </Button>
                </Link>
              )}
            </Tooltip>

            {!isUser && (
              <Flex justify={"center"} align="center">
                <Tooltip
                  offset={3}
                  label={post?.isFollowing ? `Unfollow` : `Follow`}
                  position="top"
                  withinPortal
                  disabled={isFollowLoading || isPostModal}
                  color="dark.7"
                  styles={{
                    tooltip: {
                      border: "none",
                      outline: "1px solid rgba(192, 193, 196, 0.75)",
                    },
                  }}
                >
                  <ActionIcon
                    sx={(theme) => ({
                      transform: "translateX(.1rem)",
                      color: post?.isFollowing
                        ? theme.colors.green[6]
                        : "#c1c2c5",
                      "&[data-disabled]": {
                        color: post?.isFollowing
                          ? theme.colors.green[6]
                          : "#c1c2c5",
                      },
                    })}
                    variant={"transparent"}
                    radius="xl"
                    disabled={isFollowLoading || isUser}
                    onClick={() =>
                      followUser({
                        isFollowing: post?.isFollowing,
                        setIsFollowLoading,
                        post,
                        setPost,
                        session,
                      })
                    }
                  >
                    {post?.isFollowing ? (
                      <FaUserCheck fontSize="1.175rem" />
                    ) : (
                      <FaUserPlus fontSize="1.175rem" />
                    )}
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  withinPortal
                  label={post?.isLiked ? "Unlike" : "Like"}
                  position="top"
                  zIndex={2}
                  offset={3}
                  disabled={isLikeLoading || isPostModal}
                  color="dark.7"
                  styles={{
                    tooltip: {
                      border: "none",
                      outline: "1px solid rgba(192, 193, 196, 0.75)",
                    },
                  }}
                >
                  <ActionIcon
                    variant={"transparent"}
                    radius="xl"
                    onClick={() =>
                      likePost({
                        isLiked: post?.isLiked,
                        setIsLikeLoading,
                        post,
                        setPost,
                        session,
                      })
                    }
                    disabled={isLikeLoading || isUser}
                    sx={(theme) => ({
                      color: post?.isLiked ? theme.colors.red[6] : "#c1c2c5",
                      "&[data-disabled]": {
                        color: post?.isLiked ? theme.colors.red[6] : "#c1c2c5",
                      },
                    })}
                  >
                    <FaHeart />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            )}
          </Flex>
        )}

        {/* caption */}
        <Flex align="center" justify={"center"} direction={"column"} maw={375}>
          {!isSelect || isPosting || !caption.isEditing ? (
            <Flex
              w={"100%"}
              justify={"space-between"}
              align={"center"}
              mt="-.5rem"
              mb={"0.2rem"}
            >
              <Tooltip.Floating
                offset={17.5}
                position="bottom"
                disabled={!isSelect}
                label={"Edit"}
                color="dark.7"
                styles={{
                  tooltip: {
                    border: "none",
                    outline: "1px solid rgba(192, 193, 196, 0.75)",
                  },
                }}
              >
                <Flex
                  w={"100%"}
                  justify={"space-between"}
                  align={"center"}
                  style={{
                    cursor: isSelect ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (!isSelect) return;
                    setCaption({
                      ...caption,
                      isEditing: isSelect ? true : !isPostModal,
                      isFocused: isSelect ? true : !isPostModal,
                    });
                    setTimeout(() => {
                      captionRef?.current?.focus();
                    }, 0);
                  }}
                >
                  <Text
                    color="white"
                    fw={"bold"}
                    zIndex={999}
                    style={{
                      marginTop: !isSelect ? "-.1rem" : "0",
                    }}
                  >
                    {isUser ? caption?.text : post?.caption}
                  </Text>
                </Flex>
              </Tooltip.Floating>
              {isSelect && !isPosting && (
                <Tooltip
                  offset={5.25}
                  withinPortal
                  position="bottom"
                  label={"Remove"}
                  color="dark.7"
                  styles={{
                    tooltip: {
                      border: "none",
                      outline: "1px solid rgba(192, 193, 196, 0.75)",
                    },
                  }}
                >
                  <ActionIcon
                    color={"red"}
                    variant={"subtle"}
                    onClick={() => {
                      setCaption({
                        ...caption,
                        text: "",
                        originalText: "",
                        isEditing: true,
                        isFocused: false,
                      });
                    }}
                  >
                    <VscRemove fontSize="0.75rem" />
                  </ActionIcon>
                </Tooltip>
              )}
            </Flex>
          ) : (
            <TextInput
              data-autoFocus
              onFocus={() => {
                setCaption({
                  ...caption,
                  isFocused: true,
                });
              }}
              onBlur={() => {
                if (caption.error && !hasBlurredCaptionError) {
                  setHasBlurredCaptionError(true);
                  setCaption({
                    ...caption,
                    isEditing: true,
                    isFocused: true,
                  });
                  setTimeout(() => {
                    captionRef?.current?.focus();
                  }, 0);
                  return;
                }
                setCaption({
                  ...caption,
                  text: caption?.originalText || "",
                  error: "",
                  isEditing: caption?.originalText?.length === 0,
                  isFocused: false,
                });
              }}
              ref={captionRef}
              w="100%"
              value={caption.text}
              maxLength={CAPTION_MAX_LENGTH}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > CAPTION_MAX_LENGTH) return;
                setCaption({
                  ...caption,
                  text: value,
                  error: "",
                });
              }}
              placeholder="Add a caption..."
              rightSection={
                caption.text.length > 0 && (
                  <Tooltip
                    offset={5.25}
                    withinPortal
                    position="bottom"
                    label={"Add"}
                    color="dark.7"
                    styles={{
                      tooltip: {
                        border: "none",
                        outline: "1px solid rgba(192, 193, 196, 0.75)",
                      },
                    }}
                  >
                    <ActionIcon
                      onMouseDown={() =>
                        captionPost({
                          post,
                          setPost,
                          caption,
                          setCaption,
                          badWordsFilter,
                          setHasBlurredCaptionError,
                        })
                      }
                      disabled={
                        (caption.text.length === 0 &&
                          caption?.originalText?.length === 0) ||
                        caption.text === caption?.originalText ||
                        caption.error
                      }
                      color={"green"}
                      variant={"subtle"}
                      sx={{
                        "&[data-disabled]": {
                          backgroundColor: "transparent",
                          border: "none",
                        },
                      }}
                    >
                      <VscAdd fontSize="0.75rem" />
                    </ActionIcon>
                  </Tooltip>
                )
              }
              variant={"unstyled"}
              mt="-.8rem"
              error={caption.error}
              styles={{
                zIndex: 100,
                input: {
                  color: "white",
                  fontSize: "1rem",
                },
                description: {
                  transform: "translateY(.5rem)",
                },
                error: {
                  transform: "translateY(-.5rem)",
                },
              }}
            />
          )}

          {/* image + audio */}
          <div
            style={{
              position: "relative",
            }}
            ref={imageRef}
          >
            <Image
              onClick={() => {
                if (currentlyPlaying !== null) return;
                if (!activePost) {
                  setActivePost(post?._id);
                } else if (activePost === post?._id) {
                  setActivePost(null);
                } else {
                  setActivePost(post?._id);
                }
              }}
              src={post?.albumImage}
              alt={post?.albumName}
              radius={"0.25rem"}
              width={!isPostModal ? 275 : isSmall ? "75vw" : 375}
              height={!isPostModal ? 275 : isSmall ? "75vw" : 375}
              withPlaceholder
              placeholder={
                <Stack align="center">
                  <Text>{post?.albumName}</Text>
                  <Text>{artists}</Text>
                </Stack>
              }
              style={{
                opacity: imageFocused ? 0.3 : 1,
                transition: "opacity 0.2s ease-in-out",
                zIndex: 1,
                cursor: "pointer",
              }}
            />

            {imageFocused &&
              (!!post?.previewUrl ? (
                <>
                  <RingProgress
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    title={isAudioPlaying ? "Pause" : "Play"}
                    sections={[
                      {
                        value: audioProgress,
                        color: theme.colors.spotify[8],
                      },
                    ]}
                    size={isPostModal ? 105 : 90}
                    thickness={isPostModal ? 7.5 : 7.5}
                    label={
                      <Center>
                        <ActionIcon
                          onClick={() => {
                            audioRef.current.currentTime = 0;
                            if (!isAudioPlaying) {
                              audioRef.current.play();
                              setIsAudioPlaying(true);
                            } else {
                              audioRef.current.pause();
                              setIsAudioPlaying(false);
                            }
                          }}
                          title={isAudioPlaying ? "Pause" : "Play"}
                          size={isPostModal ? "4.5rem" : "3.75rem"}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent !important",
                            },
                          }}
                        >
                          {!isAudioPlaying ? (
                            <BsPlayCircleFill
                              style={{
                                cursor: "pointer",
                              }}
                              fontSize={isPostModal ? "4.5rem" : "3.75rem"}
                            />
                          ) : (
                            <BsPauseCircleFill
                              style={{
                                cursor: "pointer",
                              }}
                              fontSize={isPostModal ? "4.5rem" : "3.75rem"}
                            />
                          )}
                        </ActionIcon>
                      </Center>
                    }
                  />
                  <ActionIcon
                    title="Listen on Spotify"
                    component="a"
                    href={post?.songUrl}
                    target="_blank"
                    radius={"xl"}
                    size={isPostModal ? "2rem" : "1.6rem"}
                    variant={"transparent"}
                    sx={{
                      cursor: "pointer !important",
                      position: "absolute",
                      top: "0.6rem",
                      right: "0.6rem",
                    }}
                    onClick={() => {
                      audioRef.current.pause();
                      setIsAudioPlaying(false);
                    }}
                  >
                    <BsSpotify
                      fontSize={isPostModal ? "2rem" : "1.6rem"}
                      style={{
                        cursor: "pointer !important",
                        color: theme.colors.spotify[8],
                      }}
                    />
                  </ActionIcon>
                </>
              ) : (
                <Center
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <ActionIcon
                    title="Listen on Spotify"
                    component="a"
                    href={post?.songUrl}
                    target="_blank"
                    radius={"xl"}
                    size={"3.75rem"}
                    variant={"transparent"}
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent !important",
                      },
                    }}
                    onClick={() => {
                      audioRef.current.pause();
                      setIsAudioPlaying(false);
                    }}
                  >
                    <BsSpotify
                      fontSize={"3.75rem"}
                      style={{
                        cursor: "pointer !important",
                        color: theme.colors.spotify[8],
                      }}
                    />
                  </ActionIcon>
                </Center>
              ))}
          </div>

          <audio src={post?.previewUrl} type="audio/mpeg" ref={audioRef} />

          {/* song info */}
          <Flex
            direction={"column"}
            mt={8}
            mb={(isDiscover || isSelect) && "0.5rem"}
            w={!isPostModal ? 275 : isSmall ? "75vw" : 375}
            style={{
              textAlign: "center",
            }}
          >
            <Title
              order={3}
              color="white"
              sx={{
                cursor: "default",
              }}
              truncate
            >
              {post?.songName}
            </Title>
            <Text
              color="rgba(255, 255, 255, 0.8)"
              sx={{
                cursor: "default",
              }}
              truncate
            >
              {artists}
            </Text>
          </Flex>

          {/* comments */}
          {!isSelect && !isDiscover && (
            <Flex
              w="100%"
              gap={"0.4rem"}
              justify={"space-between"}
              align={"start"}
              direction={"column"}
              pt="0.25rem"
              sx={{
                transform: "translateY(-0.3rem)",
                borderTop: `1px solid ${theme.colors.lightWhite[7]}`,
              }}
            >
              {isPostModal ? (
                <Stack
                  w="100%"
                  mt={"0.5rem"}
                  align={"center"}
                  justify={"center"}
                  maw={375}
                >
                  <Stack w="100%" align={"center"} spacing={0}>
                    <ScrollArea
                      viewportRef={commentScrollRef}
                      offsetScrollbars
                      h={comment.error ? "177px" : "190px"}
                      w="100%"
                      type={"always"}
                      pb={"0.5rem"}
                      styles={{
                        scrollbar: {
                          "&, &:hover": {
                            background: "transparent",
                            borderRadius: "0.5rem",
                          },
                          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb':
                            {
                              backgroundColor: "#474952",
                            },
                        },
                      }}
                    >
                      {numComments === 0 ? (
                        <Text
                          color="white"
                          sx={{
                            cursor: "default",
                          }}
                          mb={"1.5rem"}
                          align={"center"}
                          fz={"0.95rem"}
                        >
                          No comments yet...
                        </Text>
                      ) : (
                        <Stack
                          w="100%"
                          align="center"
                          justify="center"
                          spacing={"md"}
                          style={{
                            zIndex: 1,
                          }}
                        >
                          {post?.comments?.map(
                            ({
                              text,
                              username,
                              userId,
                              userImage,
                              createdAt,
                            }) => (
                              <CommentCard
                                key={createdAt}
                                text={text}
                                createdAt={createdAt}
                                userId={userId}
                                username={username}
                                userImage={userImage}
                                session={session}
                                post={post}
                                setPost={setPost}
                                comment={comment}
                                setComment={setComment}
                                numComments={numComments}
                                commentInputRef={commentInputRef}
                                notificationPostId={notificationPostId}
                                notificationCommentId={notificationCommentId}
                                commentScrollRef={commentScrollRef}
                                allUsers={allUsers}
                                isSmall={isSmall}
                              />
                            )
                          )}
                        </Stack>
                      )}
                    </ScrollArea>
                    <Box
                      sx={{
                        borderTop: `1px solid ${theme.colors.lightWhite[7]}`,
                        width: "100%",
                      }}
                      mb={"0.25rem"}
                    >
                      <Popover
                        position="top"
                        opened={comment.isMentioning && comment.isFocused}
                        width="target"
                        offset={1}
                        withinPortal
                        color="dark.7"
                        styles={{
                          dropdown: {
                            zIndex: 100,
                            border: "none",
                            outline: "1px solid rgba(192, 193, 196, 0.75)",
                          },
                        }}
                      >
                        <Popover.Target>
                          <Textarea
                            autosize
                            minRows={1}
                            maxRows={1}
                            disabled={comment.isLoading || comment.isDeleting}
                            ref={commentInputRef}
                            variant={"unstyled"}
                            placeholder="Add a comment..."
                            inputWrapperOrder={["error", "input"]}
                            styles={{
                              zIndex: 100,
                              input: {
                                color: "white",
                                fontSize: "1rem",
                                marginBottom: "-.35rem",
                              },
                              error: {
                                transform: "translateY(.7rem)",
                              },
                            }}
                            error={comment.error}
                            value={comment.text}
                            onFocus={() => {
                              setComment({
                                ...comment,
                                isFocused: true,
                              });
                            }}
                            onBlur={() => {
                              if (comment.error && !hasBlurredCommentError) {
                                setHasBlurredCommentError(true);
                                setComment({
                                  ...comment,
                                  isFocused: true,
                                });
                                setTimeout(() => {
                                  commentInputRef.current?.focus();
                                }, 0);
                                return;
                              }
                              setComment({
                                ...comment,
                                error: "",
                                isFocused: false,
                              });
                            }}
                            maxLength={COMMENT_MAX_LENGTH}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length > COMMENT_MAX_LENGTH) return;
                              setComment({
                                ...comment,
                                text: value,
                                error: "",
                                isMentioning: value.slice(-1) === "@",
                              });
                            }}
                            rightSection={
                              comment.text.length > 0 && (
                                <Tooltip
                                  offset={-2}
                                  withinPortal
                                  position="top"
                                  label={"Post"}
                                  color="dark.7"
                                  styles={{
                                    tooltip: {
                                      border: "none",
                                      outline:
                                        "1px solid rgba(192, 193, 196, 0.75)",
                                    },
                                  }}
                                >
                                  <ActionIcon
                                    disabled={
                                      !!comment.error ||
                                      comment.isLoading ||
                                      comment.isDeleting
                                    }
                                    variant={"transparent"}
                                    onMouseDown={() =>
                                      postComment({
                                        comment,
                                        setComment,
                                        post,
                                        setPost,
                                        session,
                                        badWordsFilter,
                                        commentInputRef,
                                        commentScrollRef,
                                        setHasBlurredCommentError,
                                        allUsers,
                                      })
                                    }
                                  >
                                    <AiOutlineSend />
                                  </ActionIcon>
                                </Tooltip>
                              )
                            }
                          />
                        </Popover.Target>
                        <Popover.Dropdown>
                          <ScrollArea
                            viewportRef={commentScrollRef}
                            h={
                              allUsers.length === 1
                                ? "40px"
                                : allUsers.length === 2
                                ? "90px"
                                : "140px"
                            }
                            type={"always"}
                            styles={{
                              scrollbar: {
                                "&, &:hover": {
                                  background: "transparent",
                                  borderRadius: "0.5rem",
                                },
                                '&[data-orientation="vertical"] .mantine-ScrollArea-thumb':
                                  {
                                    backgroundColor: "#474952",
                                  },
                              },
                            }}
                          >
                            <Stack w="100%" spacing={"xs"}>
                              {allUsers?.map((user) => (
                                <UnstyledButton
                                  key={user.userId}
                                  onClick={() => {
                                    const newText = `${comment.text.slice(
                                      0,
                                      comment.text.length - 1
                                    )}@${user.username} `;
                                    setComment({
                                      ...comment,
                                      text: newText,
                                      isMentioning: false,
                                    });
                                    setTimeout(() => {
                                      commentInputRef.current.focus();
                                    }, 0);
                                  }}
                                  w="100%"
                                  sx={{
                                    borderRadius: "0.5rem !important",
                                    transition: "all 0.1s ease-in-out",
                                    "&:hover": {
                                      // backgroundColor: theme.colors.dark[5],
                                      backgroundColor: "#141517",
                                    },
                                  }}
                                >
                                  <Flex
                                    justify="start"
                                    align="center"
                                    p="0.5rem 0.5rem 0.5rem .7rem"
                                    gap="0.65rem"
                                  >
                                    <Avatar
                                      src={user.userImage}
                                      name={user.username}
                                      radius="xl"
                                      style={{
                                        outline: "1px solid #c0c1c4",
                                      }}
                                      size={24}
                                    />
                                    <Text color="white" fz={"0.95rem"}>
                                      {user.username}
                                    </Text>
                                  </Flex>
                                </UnstyledButton>
                              ))}
                            </Stack>
                          </ScrollArea>
                        </Popover.Dropdown>
                      </Popover>
                    </Box>
                  </Stack>
                </Stack>
              ) : (
                <Flex
                  w="100%"
                  justify={"space-between"}
                  align={"center"}
                  mt={".3rem"}
                >
                  <UnstyledButton
                    onClick={() => {
                      setCurrentlyPlaying(null);
                      openPostModal();
                    }}
                    c="dimmed"
                    sx={{
                      transform: "translateX(.25rem) translateY(-.25rem)",
                    }}
                  >
                    {getViewCommentText()}
                  </UnstyledButton>
                  <Text
                    c="dimmed"
                    sx={{
                      transform: "translateX(-.15rem) translateY(-.25rem)",
                      cursor: "default",
                    }}
                  >
                    {formattedPostedAt}
                  </Text>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default Post;
