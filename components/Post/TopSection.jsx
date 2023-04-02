import {
  Flex,
  Tooltip,
  Group,
  Avatar,
  Stack,
  Text,
  Button,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { FaHeart, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { VscAdd, VscRemove } from "react-icons/vsc";
import Link from "next/link";
import { truncateText } from "@/utils";
import { likePost, followUser, captionPost } from "@/actions";
import { CAPTION_MAX_LENGTH } from "@/constants";
import dayjs from "dayjs";
import { useState } from "react";
import EmojiPicker from "../EmojiPicker";

export default function TopSection({
  isPostModal,
  isUser,
  isSelect,
  isDiscover,
  post,
  setPost,
  session,
  isPosting,
  caption,
  setCaption,
  captionRef,
  isLikeLoading,
  setIsLikeLoading,
  isFollowLoading,
  setIsFollowLoading,
}) {
  const [hasBlurredCaptionError, setHasBlurredCaptionError] = useState(false);

  return (
    <>
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
            disabled={isSelect || isUser || isPostModal}
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
                events={{
                  hover: true,
                  focus: false,
                  touch: false,
                }}
                withinPortal
                label={post?.isFollowing ? "Unfollow" : "Follow"}
                position="top"
                zIndex={2}
                offset={3}
                disabled={isFollowLoading}
                color="dark.7"
                styles={{
                  tooltip: {
                    border: "none",
                    outline: "1px solid rgba(192, 193, 196, 0.75)",
                  },
                }}
              >
                <ActionIcon
                  mr={"-.2rem"}
                  variant={"transparent"}
                  radius="xl"
                  onClick={() => {
                    followUser({
                      isFollowing: post?.isFollowing,
                      setIsFollowLoading,
                      post,
                      setPost,
                      session,
                    });
                  }}
                  disabled={isFollowLoading}
                  sx={(theme) => ({
                    color: post?.isFollowing
                      ? theme.colors.green[6]
                      : "#c1c2c5",
                    "&[data-disabled]": {
                      color: post?.isFollowing
                        ? theme.colors.green[6]
                        : "#c1c2c5",
                    },
                  })}
                >
                  {post?.isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                </ActionIcon>
              </Tooltip>
              <Tooltip
                events={{
                  hover: true,
                  focus: false,
                  touch: false,
                }}
                withinPortal
                label={post?.isLiked ? "Unlike" : "Like"}
                position="top"
                zIndex={2}
                offset={3}
                disabled={isLikeLoading}
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
                  disabled={isLikeLoading}
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
      {!isDiscover && (
        <Flex
          align="center"
          justify={"center"}
          direction={"column"}
          maw={375}
          w={"100%"}
        >
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
                  align={"start"}
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
                      userSelect: "none",
                    }}
                  >
                    {isUser ? caption?.text : post?.caption}
                  </Text>
                </Flex>
              </Tooltip.Floating>
              {isSelect && !isPosting && (
                <Tooltip
                  offset={-2}
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
                    variant={"transparent"}
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
                    offset={-2}
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
                      variant={"transparent"}
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
        </Flex>
      )}
    </>
  );
}
