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
} from "@mantine/core";
import Link from "next/link";
import { FaHeart, FaUserPlus, FaUserCheck } from "react-icons/fa";
import {
  BsSpotify,
  BsPlayCircleFill,
  BsPauseCircleFill,
  BsCheck,
  BsPencil,
} from "react-icons/bs";
import { useRef, useEffect, useState } from "react";
import { truncateText } from "@/utils/truncateText";
import PostModal from "./modals/PostModal";
import { AiOutlineComment } from "react-icons/ai";
import { useDisclosure, useHover, useMediaQuery } from "@mantine/hooks";
import CommentCard from "./CommentCard";
import EmojiPicker from "./EmojiPicker";
import { likePost, followUser, captionPost, postComment } from "@/actions";
import dayjs from "dayjs";

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
}) {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const { hovered: imageHovered, ref: imageRef } = useHover();
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [commentOpen, { open: openComment, close: closeComment }] =
    useDisclosure(false);
  const artists = post?.artists?.map((artist) => artist.name)?.join(", ");
  const numComments = post?.comments?.length || 0;
  const commentRef = useRef(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const captionRef = useRef(null);
  const theme = useMantineTheme();
  const isToday = dayjs(post?.createdAt).isSame(dayjs().toDate(), "day");
  const [hasBlurredCaptionError, setHasBlurredCaptionError] = useState(false);
  const isSmall = useMediaQuery("(max-width: 470px)");

  useEffect(() => {
    audioRef.current.addEventListener("play", () => {
      setCurrentlyPlaying(post?._id);
      setIsAudioPlaying(true);
    });
    audioRef.current.addEventListener("pause", () => {
      if (audioRef?.current?.currentTime) {
        audioRef.current.currentTime = 0;
      }
      setIsAudioPlaying(false);
    });
    audioRef.current.addEventListener("timeupdate", () => {
      if (!audioRef.current) return;
      const percent =
        (audioRef?.current?.currentTime / audioRef?.current?.duration) * 100;
      setAudioProgress(percent);
    });
    audioRef.current.addEventListener("ended", () => setAudioProgress(0));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        audioRef?.current?.pause();
      }
    });
  }, []);
  useEffect(() => {
    if (!(currentlyPlaying === post?._id)) {
      audioRef.current.pause();
    }
  }, [currentlyPlaying]);
  useEffect(() => {
    if (commentRef?.current) {
      commentRef.current.focus();
    }
  }, [comment?.type]);
  useEffect(() => {
    if (selectedSong?.isChanged) {
      setSelectedSong({
        ...selectedSong,
        isChanged: false,
      });
      setCaption({
        ...caption,
        text: "",
        originalText: "",
        isEditing: true,
      });
      setTimeout(() => {
        captionRef?.current?.focus();
        setIsAudioPlaying(false);
        setAudioProgress(0);
      }, 0);
    }
  }, [selectedSong?.isChanged]);

  return (
    <>
      <PostModal
        opened={commentOpen}
        close={closeComment}
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
        pb={isPostModal && numComments > 0 && !comment.type ? ".75rem" : "0rem"}
        sx={{
          borderRadius: "0.5rem !important",
          // border: `0.75px solid ${
          //   isUser ? theme.colors.spotify[7] : theme.colors.lightWhite[7]
          // }`,
          // border: isUser && `0.75px solid ${theme.colors.lightWhite[7]}`,
          // border: isUser && `0.75px solid ${theme.colors.spotify[7]}`,
          border: `0.75px solid ${theme.colors.lightWhite[7]}`,
        }}
      >
        {/* like + follow */}
        {!isDiscover && (
          <Flex
            w={isPostModal ? "100%" : "275px"}
            justify={"space-between"}
            align={"center"}
            mt={isSelect ? "-.4rem" : "-0.55rem"}
            pb={isSelect ? ".32rem" : "0.24rem"}
            mb={"0.75rem"}
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.colors.lightWhite[7]}`,
            })}
          >
            <Tooltip
              disabled={isSelect || isPostModal}
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
                  <Group mt={3}>
                    <Avatar
                      src={post?.userImage}
                      alt={`${post?.username}'s profile`}
                      radius="xl"
                      style={{
                        border: "1px solid #c0c1c4",
                      }}
                    />
                    <Stack spacing={5}>
                      <Text
                        size="sm"
                        weight={700}
                        sx={{ lineHeight: 1, cursor: "default" }}
                      >
                        {truncateText(post?.username, 19)}
                        {isUser ? " (you)" : ""}
                      </Text>
                      <Group mt={1}>
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
                  <Group mt={9} spacing="sm">
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
              {isSelect ? (
                <Button
                  ml={isPostModal ? "-.5rem" : "-.3rem"}
                  compact
                  size={isPostModal ? "md" : "sm"}
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
                      size={isPostModal ? 24 : 20}
                      src={post?.userImage}
                      alt={`${post?.username}'s profile`}
                      radius={"xl"}
                      style={{
                        border: "1px solid #c0c1c4",
                      }}
                    />
                  }
                >
                  {truncateText(post?.username, 19)}
                  {isUser ? " (you)" : ""}
                </Button>
              ) : (
                <Link
                  href={isUser ? "/my-profile" : `/profile/${post?.username}`}
                  passHref
                >
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
                        size={isPostModal ? 24 : 20}
                        src={post?.userImage}
                        alt={`${post?.username}'s profile`}
                        radius={"xl"}
                        style={{
                          border: "1px solid #c0c1c4",
                        }}
                      />
                    }
                  >
                    {truncateText(post?.username, 19)}
                    {isUser ? " (you)" : ""}
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
        <Flex align="center" justify={"center"} direction={"column"}>
          {isUser &&
            (!caption.isEditing && !caption.isModalEditing ? (
              <Flex w={"100%"} justify={"space-between"} align={"center"}>
                <Text
                  title={isToday && "Edit caption"}
                  color="white"
                  fw={"bold"}
                  fs="xs"
                  style={{
                    cursor: isToday ? "pointer" : "default",
                    alignSelf: "flex-start",
                  }}
                  mt="-.3rem"
                  mb={"0.2rem"}
                  zIndex={1000}
                  onClick={() => {
                    if (!isToday || comment?.isLoading) return;
                    if (setComment) {
                      setComment({
                        ...comment,
                        text: "",
                        type: "",
                      });
                    }
                    setCaption({
                      ...caption,
                      isEditing: isSelect ? true : !isPostModal,
                      isModalEditing: isSelect ? false : isPostModal,
                    });
                    setTimeout(() => {
                      captionRef?.current?.focus();
                    }, 0);
                  }}
                >
                  {caption?.text}
                </Text>
              </Flex>
            ) : (
              <TextInput
                maxLength={29}
                data-autoFocus
                pt={isPostModal ? 2 : 4}
                id="caption"
                onBlur={() => {
                  if (caption.error && !hasBlurredCaptionError) {
                    setHasBlurredCaptionError(true);
                    setCaption({
                      ...caption,
                      isEditing: true,
                    });
                    setTimeout(() => {
                      captionRef?.current?.focus();
                    }, 0);
                    return;
                  }
                  if (caption.isLoading || caption.addedEmoji) return;
                  setPost({
                    ...post,
                    caption: caption?.originalText || "",
                  });
                  setCaption({
                    ...caption,
                    text: caption?.originalText || "",
                    error: "",
                    isEditing: caption?.originalText?.length === 0,
                    isModalEditing: false,
                  });
                }}
                ref={captionRef}
                w="100%"
                value={caption.text}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 29) return;
                  setCaption({
                    ...caption,
                    text: value,
                    error: "",
                  });
                  setPost({
                    ...post,
                    caption: value,
                  });
                }}
                error={caption.error}
                placeholder="Add a caption..."
                icon={<BsPencil />}
                mb={isPostModal ? "0.75rem" : ".5rem"}
                mt={isPostModal ? "0rem" : "-.4rem"}
                rightSection={
                  <Flex
                    align="center"
                    justify="center"
                    gap={"0.35rem"}
                    style={{
                      transform: "translateX(-.75rem)",
                    }}
                  >
                    <EmojiPicker
                      text={caption}
                      setText={setCaption}
                      inputRef={captionRef}
                    />
                    <ActionIcon
                      onMouseDown={() =>
                        captionPost({
                          isSelect,
                          post,
                          setPost,
                          caption,
                          setCaption,
                          badWordsFilter,
                          setHasBlurredCaptionError,
                        })
                      }
                      title="Add caption"
                      disabled={
                        caption.isLoading ||
                        (caption.text.length === 0 &&
                          caption?.originalText?.length === 0) ||
                        caption.text === caption?.originalText ||
                        caption.error
                      }
                      loading={caption.isLoading}
                      variant={"subtle"}
                      sx={(theme) => ({
                        "&:hover": {
                          backgroundColor: theme.colors.dark[7],
                        },
                        "&:active": {
                          backgroundColor: theme.colors.dark[7],
                        },
                      })}
                    >
                      <BsCheck />
                    </ActionIcon>
                  </Flex>
                }
                sx={(theme) => ({
                  zIndex: 100,
                  input: {
                    border:
                      caption.addedEmoji &&
                      `1px solid ${theme.colors.spotify[7]}`,
                  },
                })}
              />
            ))}

          {/* non-user caption */}
          {!isUser && (
            <Text
              color="white"
              fw={"bold"}
              fs="xs"
              style={{
                cursor: "default",
                alignSelf: "flex-start",
              }}
              mt={isUser ? "-.4rem" : "-.5rem"}
              mb={"0.25rem"}
              zIndex={100}
            >
              {post?.caption}
            </Text>
          )}

          {/* image + audio */}
          <div
            style={{
              position: "relative",
            }}
            ref={imageRef}
          >
            <Image
              src={post?.albumImage}
              alt={post?.albumName}
              radius={"0.25rem"}
              // width={!isPostModal ? 275 : 375}
              // height={!isPostModal ? 275 : 375}
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
                opacity: imageHovered || isAudioPlaying ? 0.3 : 1,
                transition: "opacity 0.2s ease-in-out",
              }}
            />

            {(imageHovered || isAudioPlaying) && !!post?.previewUrl && (
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
            )}
            {imageHovered && isDiscover && !post?.previewUrl && (
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
            )}
          </div>

          <audio src={post?.previewUrl} type="audio/mpeg" ref={audioRef} />

          {/* song info */}
          <Flex
            direction={"column"}
            mt={8}
            mb={(isDiscover || isSelect) && "0.5rem"}
            w={!isPostModal ? 275 : isSmall ? "75vw" : 375}
            // w={!isPostModal ? 275 : 375}
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
              className={"truncate"}
            >
              {post?.songName}
            </Title>
            <Text
              color="rgba(255, 255, 255, 0.8)"
              sx={{
                cursor: "default",
              }}
              className={"truncate"}
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
              {isPostModal && (
                <Stack w={"100%"} spacing={8}>
                  {!!comment.type ? (
                    <>
                      <Textarea
                        onBlur={() => {
                          if (
                            comment.isLoading ||
                            comment.addedEmoji ||
                            numComments === 0
                          )
                            return;
                          if (
                            comment.type === "edit" &&
                            comment.text === comment.originalText
                          ) {
                            setComment({
                              ...comment,
                              text: "",
                              type: "",
                            });
                            return;
                          }
                          if (comment.text) return;
                          setComment({
                            ...comment,
                            text: "",
                            type: "",
                          });
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length > 100) return;
                          setComment({
                            ...comment,
                            text: value,
                            error: "",
                          });
                        }}
                        error={comment.error}
                        ref={commentRef}
                        sx={{
                          zIndex: 1000,
                        }}
                        styles={{
                          input: {
                            border:
                              comment.addedEmoji &&
                              `1px solid ${theme.colors.spotify[7]}`,
                          },
                        }}
                        maxLength={100}
                        data-autoFocus
                        value={comment.text}
                        placeholder="Add a comment..."
                        w="100%"
                        mt={"0.5rem"}
                        icon={
                          <AiOutlineComment
                            style={{
                              position: "absolute",
                              top: ".75rem",
                              left: "0.75rem",
                            }}
                          />
                        }
                        rightSection={
                          <EmojiPicker
                            text={comment}
                            setText={setComment}
                            inputRef={commentRef}
                            styles={{
                              position: "absolute",
                              top: "0.375rem",
                              right: "0.4rem",
                            }}
                          />
                        }
                      />
                      <Button
                        style={{
                          zIndex: 100,
                        }}
                        disabled={
                          comment.text.length === 0 ||
                          (comment.type === "edit" &&
                            comment.text === comment.originalText)
                        }
                        fullWidth
                        loading={comment.isLoading}
                        onClick={() =>
                          postComment({
                            comment,
                            setComment,
                            post,
                            setPost,
                            session,
                            badWordsFilter,
                            commentRef,
                          })
                        }
                      >
                        {comment.isLoading
                          ? `${
                              comment.type === "edit" ? "Updating" : "Posting"
                            }...`
                          : `${
                              comment.type === "edit" ? "Update" : "Post"
                            } Comment`}
                      </Button>
                    </>
                  ) : (
                    <Button
                      disabled={comment?.isLoading || comment?.isDeleting}
                      mt={"0.3rem"}
                      mb="1.1rem"
                      onClick={() =>
                        setComment({
                          ...comment,
                          type: "post",
                        })
                      }
                      leftIcon={<AiOutlineComment />}
                      variant={"light"}
                      color="spotify"
                      sx={{
                        zIndex: 100,
                      }}
                    >
                      Add a comment
                    </Button>
                  )}
                </Stack>
              )}
              {isPostModal ? (
                <Stack w="100%" mt={"0.5rem"} px={"0.75rem"}>
                  {numComments === 0 && !comment.type ? (
                    <Center
                      mt={"-.25rem"}
                      mb={"0.1rem"}
                      style={{
                        cursor: "default",
                        transform: "translateY(-0.75rem)",
                      }}
                    >
                      <Text color="dimmed" fontSize={"0.9rem"}>
                        No comments
                      </Text>
                    </Center>
                  ) : (
                    <Stack>
                      {!comment.type && (
                        <ScrollArea
                          h={
                            caption.isModalEditing
                              ? caption.error
                                ? "102px"
                                : "121px"
                              : "148px"
                          }
                          type={"always"}
                          offsetScrollbars
                          mt={"-1rem"}
                          px={"0.5rem"}
                          mb={"-0.5rem"}
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
                          <Stack
                            align="start"
                            justify="start"
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
                                  formattedCreatedAt={dayjs(
                                    createdAt
                                  ).fromNow()}
                                  userId={userId}
                                  username={username}
                                  userImage={userImage}
                                  isUser={userId === session?.user?.id}
                                  post={post}
                                  setPost={setPost}
                                  comment={comment}
                                  setComment={setComment}
                                  isSmall={isSmall}
                                />
                              )
                            )}
                          </Stack>
                        </ScrollArea>
                      )}
                    </Stack>
                  )}
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
                      openComment();
                    }}
                    c="dimmed"
                    sx={{
                      transform: "translateX(.25rem) translateY(-.25rem)",
                    }}
                  >
                    {numComments === 0
                      ? "Add a comment..."
                      : numComments === 1
                      ? "View comment"
                      : `View all ${numComments} comments`}
                  </UnstyledButton>
                  <Text
                    c="dimmed"
                    sx={{
                      transform: "translateX(-.15rem) translateY(-.25rem)",
                      cursor: "default",
                    }}
                  >
                    {dayjs(post?.createdAt).format("h:mm a")}
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
