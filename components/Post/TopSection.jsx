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
  useMantineTheme,
} from "@mantine/core";
import { FaHeart, FaUserPlus, FaUserCheck } from "react-icons/fa";
import Link from "next/link";
import { truncateText, getAvatarText } from "@/utils";
import { likePost, followUser } from "@/actions";
import { CAPTION_MAX_LENGTH } from "@/constants";
import { useState } from "react";
import dayjs from "dayjs";
import EmojiPicker from "../EmojiPicker";

export default function TopSection({
  isPostModal,
  isUser,
  isSelect,
  isDiscover,
  isProfile,
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
  isSmall,
  idx,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const theme = useMantineTheme();

  return isDiscover ? (
    <Flex
      w={"275px"}
      justify={"space-between"}
      align={"center"}
      mt={"-.65rem"}
      pb={".2rem"}
      mb={"0.75rem"}
      sx={{
        borderBottom: `1px solid ${
          theme.colors.cardDivider[theme.colorScheme]
        }`,
      }}
    >
      <Text>#{idx + 1}</Text>
      {isLikeLoading ? (
        <ActionIcon
          variant={"transparent"}
          radius="xl"
          disabled={true}
          sx={{
            color: post?.isLiked
              ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
              : theme.colors.iconDisabled[theme.colorScheme],
            "&[data-disabled]": {
              color: post?.isLiked
                ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
                : theme.colors.iconDisabled[theme.colorScheme],
            },
          }}
        >
          <FaHeart />
        </ActionIcon>
      ) : (
        <Tooltip
          withinPortal={!isPostModal}
          label={post?.isLiked ? "unlike" : "like"}
          position="top"
          zIndex={2}
          offset={3}
          disabled={isLikeLoading}
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
                isDiscover: true,
                idx,
              })
            }
            disabled={isLikeLoading}
            sx={{
              color: post?.isLiked
                ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
                : theme.colors.iconDisabled[theme.colorScheme],
              "&[data-disabled]": {
                color: post?.isLiked
                  ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
                  : theme.colors.iconDisabled[theme.colorScheme],
              },
            }}
          >
            <FaHeart />
          </ActionIcon>
        </Tooltip>
      )}
    </Flex>
  ) : (
    <>
      {!isProfile && (
        <Flex
          w={isPostModal ? "100%" : "275px"}
          justify={"space-between"}
          align={"center"}
          mt={"-.65rem"}
          pb={".2rem"}
          mb={"0.75rem"}
          sx={{
            borderBottom: `1px solid ${
              theme.colors.cardDivider[theme.colorScheme]
            }`,
          }}
        >
          <Tooltip
            disabled={isSelect || isUser}
            withinPortal
            offset={isSelect ? 5.25 : 3}
            position="top"
            label={
              <>
                <Group mt={4} spacing={"xs"} align={"start"} pl={1} pt={1}>
                  <Avatar
                    src={post?.userImage}
                    alt={`${post?.username}'s profile`}
                    style={{
                      transform: "translateY(-2px)",
                    }}
                    size={30}
                  >
                    {getAvatarText(post?.username)}
                  </Avatar>
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
                    <b>{post?.numFollowers || 0}</b> Follower
                    {post?.numFollowers !== 1 && "s"}
                  </Text>
                  <Text
                    size="sm"
                    sx={{
                      cursor: "default",
                      opacity: 0.9,
                    }}
                  >
                    <b>{post?.numFollowing || 0}</b> Following
                  </Text>
                </Group>
              </>
            }
          >
            {isSelect || isUser ? (
              <Button
                ml={"-.5rem"}
                size={"sm"}
                compact
                sx={{
                  marginTop: "0.25rem",
                  cursor: "default",
                  zIndex: 1,
                  fontSize: "0.85rem",
                  color:
                    theme.colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.75)"
                      : "rgba(0, 0, 0, 0.75)",
                  backgroundColor: "transparent !important",
                  "&:active": {
                    transform: "none !important",
                  },
                }}
                component="div"
                leftIcon={
                  <Avatar
                    size={20}
                    src={post?.userImage}
                    alt={`${post?.username}'s profile`}
                  >
                    {getAvatarText(post?.username)}
                  </Avatar>
                }
              >
                {truncateText(post?.username, 19)}
              </Button>
            ) : (
              <Link href={`/profile/${post?.userId}`} passHref>
                <Button
                  ml={"-.5rem"}
                  compact
                  size={isPostModal ? "md" : "sm"}
                  sx={{
                    zIndex: 1,
                    fontSize: isPostModal ? "0.85rem" : "0.75rem",
                    color:
                      theme.colorScheme === "dark"
                        ? "rgba(255, 255, 255, 0.75)"
                        : "rgba(0, 0, 0, 0.75)",
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
                    >
                      {getAvatarText(post?.username)}
                    </Avatar>
                  }
                >
                  {truncateText(post?.username, 19)}
                </Button>
              </Link>
            )}
          </Tooltip>

          {!isUser && (
            <Flex justify={"center"} align="center">
              {isFollowLoading ? (
                <ActionIcon
                  mr={"-.2rem"}
                  variant={"transparent"}
                  radius="xl"
                  disabled
                  sx={{
                    color: post?.isFollowing
                      ? theme.colors.green[theme.colorScheme === "dark" ? 5 : 7]
                      : theme.colors.iconDisabled[theme.colorScheme],
                    "&[data-disabled]": {
                      color: post?.isFollowing
                        ? theme.colors.green[
                            theme.colorScheme === "dark" ? 5 : 7
                          ]
                        : theme.colors.iconDisabled[theme.colorScheme],
                    },
                  }}
                >
                  {post?.isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                </ActionIcon>
              ) : (
                <Tooltip
                  withinPortal={!isPostModal}
                  label={post?.isFollowing ? "unfollow" : "follow"}
                  position="top"
                  zIndex={2}
                  offset={3}
                  disabled={isFollowLoading}
                >
                  <ActionIcon
                    mr={"-.2rem"}
                    variant={"transparent"}
                    radius="xl"
                    onClick={() => {
                      followUser({
                        session,
                        toFollowId: post?.userId,
                        isFollowing: post?.isFollowing,
                        setIsFollowLoading,
                        post,
                        setPost,
                      });
                    }}
                    disabled={isFollowLoading}
                    sx={{
                      color: post?.isFollowing
                        ? theme.colors.green[
                            theme.colorScheme === "dark" ? 5 : 7
                          ]
                        : theme.colors.iconDisabled[theme.colorScheme],
                      "&[data-disabled]": {
                        color: post?.isFollowing
                          ? theme.colors.green[
                              theme.colorScheme === "dark" ? 5 : 7
                            ]
                          : theme.colors.iconDisabled[theme.colorScheme],
                      },
                    }}
                  >
                    {post?.isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                  </ActionIcon>
                </Tooltip>
              )}
              {isLikeLoading ? (
                <ActionIcon
                  variant={"transparent"}
                  radius="xl"
                  disabled
                  sx={{
                    color: post?.isLiked
                      ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
                      : theme.colors.iconDisabled[theme.colorScheme],
                    "&[data-disabled]": {
                      color: post?.isLiked
                        ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
                        : theme.colors.iconDisabled[theme.colorScheme],
                    },
                  }}
                >
                  <FaHeart />
                </ActionIcon>
              ) : (
                <Tooltip
                  withinPortal={!isPostModal}
                  label={post?.isLiked ? "unlike" : "like"}
                  position="top"
                  zIndex={2}
                  offset={3}
                  disabled={isLikeLoading}
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
                    sx={{
                      color: post?.isLiked
                        ? theme.colors.red[theme.colorScheme === "dark" ? 5 : 7]
                        : theme.colors.iconDisabled[theme.colorScheme],
                      "&[data-disabled]": {
                        color: post?.isLiked
                          ? theme.colors.red[
                              theme.colorScheme === "dark" ? 5 : 7
                            ]
                          : theme.colors.iconDisabled[theme.colorScheme],
                      },
                    }}
                  >
                    <FaHeart />
                  </ActionIcon>
                </Tooltip>
              )}
            </Flex>
          )}
        </Flex>
      )}

      <Flex
        align="center"
        justify={"center"}
        direction={"column"}
        maw={375}
        w={"100%"}
      >
        {!isSelect || isPosting ? (
          <Flex
            w={"100%"}
            justify={"space-between"}
            align={"center"}
            mt="-.5rem"
            mb={"0.2rem"}
          >
            <Flex
              w={"100%"}
              justify={"space-between"}
              align={"start"}
              style={{
                cursor: "default",
              }}
            >
              <Text
                fw={"bold"}
                zIndex={999}
                style={{
                  marginTop: !isSelect ? "-.1rem" : "0",
                }}
              >
                {isUser ? caption?.text : post?.caption}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <TextInput
            onFocus={() =>
              !caption.isFocused &&
              setCaption({
                ...caption,
                isFocused: true,
              })
            }
            onBlur={() =>
              !caption.addedEmoji &&
              !isMobileOpen &&
              setCaption({
                ...caption,
                text: caption.text.trim(),
                isFocused: false,
              })
            }
            data-autoFocus
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
            variant={"unstyled"}
            mt="-.8rem"
            error={caption.error}
            styles={{
              zIndex: 100,
              input: {
                color: `${theme.colors.pure[theme.colorScheme]} !important`,
                fontSize: "1rem",
                fontWeight:
                  !caption.isFocused && !caption.error ? "bold" : "normal",
                "&::placeholder": {
                  color: `${theme.colors.placeholder[theme.colorScheme]}`,
                },
              },
              error: {
                color: theme.colors.red[7],
                transform: "translateY(-.5rem)",
              },
            }}
            rightSection={
              caption.isFocused && (
                <EmojiPicker
                  isDisabled={caption.text.length >= CAPTION_MAX_LENGTH}
                  isMobileOpen={isMobileOpen}
                  setIsMobileOpen={setIsMobileOpen}
                  setText={setCaption}
                  position="bottom-end"
                  inputRef={captionRef}
                  isSmall={isSmall}
                />
              )
            }
          />
        )}
      </Flex>
    </>
  );
}
