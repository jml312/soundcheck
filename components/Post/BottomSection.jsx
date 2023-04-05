import {
  Flex,
  Stack,
  ScrollArea,
  Text,
  Box,
  Popover,
  Textarea,
  Tooltip,
  ActionIcon,
  UnstyledButton,
  Avatar,
  Group,
} from "@mantine/core";
import CommentCard from "../cards/CommentCard";
import { AiOutlineSend } from "react-icons/ai";
import { postComment } from "@/actions";
import { COMMENT_MAX_LENGTH } from "@/constants";
import { useState, useEffect, useRef, useMemo } from "react";
import dayjs from "dayjs";
import EmojiPicker from "../EmojiPicker";
import { getAvatarText } from "@/utils";

export default function BottomSection({
  isPostModal,
  isSelect,
  isDiscover,
  isSmall,
  post,
  setPost,
  comment,
  setComment,
  session,
  allUsers,
  isLikeLoading,
  isFollowLoading,
  setCurrentlyPlaying,
  openPostModal,
  badWordsFilter,
  notificationPostId,
  notificationCommentId,
  type,
  router,
}) {
  const numComments = post?.comments?.length || 0;
  const [isCommentCreated, setIsCommentCreated] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const commentInputRef = useRef(null);
  const commentScrollEndRef = useRef(null);
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
    if (
      commentInputRef?.current &&
      (!post?.comments?.some((c) => c.userId === session?.user?.id) ||
        ["comment", "mention"].includes(type))
    ) {
      commentInputRef.current.focus();
      setComment({
        ...comment,
        isFocused: true,
      });
    }
  }, [commentInputRef?.current]);

  useEffect(() => {
    if (isCommentCreated) {
      setTimeout(() => {
        commentScrollEndRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
        setIsCommentCreated(false);
      }, 100);
    }
  }, [isCommentCreated]);

  return (
    !isSelect &&
    !isDiscover && (
      <Flex
        w="100%"
        gap={"0.4rem"}
        justify={"space-between"}
        align={"start"}
        direction={"column"}
        pt="0.25rem"
        sx={(theme) => ({
          transform: "translateY(-0.3rem)",
          borderTop: `1px solid ${theme.colors.lightWhite[7]}`,
        })}
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
                offsetScrollbars
                h={!comment.error ? "148px" : "168px"}
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
                      ({ text, username, userId, userImage, createdAt }) => (
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
                          commentInputRef={commentInputRef}
                          notificationPostId={notificationPostId}
                          notificationCommentId={notificationCommentId}
                          type={type}
                          allUsers={allUsers}
                          router={router}
                          isSmall={isSmall}
                        />
                      )
                    )}
                  </Stack>
                )}
                <div ref={commentScrollEndRef} />
              </ScrollArea>
              <Box
                sx={(theme) => ({
                  borderTop: `1px solid ${theme.colors.lightWhite[7]}`,
                  width: "100%",
                })}
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
                      onFocus={() =>
                        !comment.isFocused &&
                        setComment({
                          ...comment,
                          isFocused: true,
                        })
                      }
                      onBlur={() =>
                        !comment.addedEmoji &&
                        !isMobileOpen &&
                        setComment({
                          ...comment,
                          text: comment.text.trim(),
                          isFocused: false,
                        })
                      }
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
                        comment?.isFocused && (
                          <Flex
                            justify="center"
                            align={"center"}
                            style={{
                              zIndex: 100,
                              transform: "translateX(-.25rem)",
                              borderRadius: "0.5rem",
                            }}
                            bg="lightGray"
                          >
                            <EmojiPicker
                              isDisabled={
                                comment.text.length >= COMMENT_MAX_LENGTH
                              }
                              isMobileOpen={isMobileOpen}
                              setIsMobileOpen={setIsMobileOpen}
                              setText={setComment}
                              position={"top-start"}
                              inputRef={commentInputRef}
                              isSmall={isSmall}
                            />
                            <Tooltip
                              disabled={comment.text.length === 0}
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
                                mr={"-0.3rem"}
                                disabled={
                                  !!comment.error ||
                                  comment.isLoading ||
                                  comment.isDeleting ||
                                  comment.text.length === 0
                                }
                                variant={"transparent"}
                                onMouseDown={() => {
                                  postComment({
                                    comment,
                                    setComment,
                                    post,
                                    setPost,
                                    session,
                                    badWordsFilter,
                                    commentInputRef,
                                    setIsCommentCreated,
                                    allUsers,
                                  });
                                }}
                              >
                                <AiOutlineSend />
                              </ActionIcon>
                            </Tooltip>
                          </Flex>
                        )
                      }
                    />
                  </Popover.Target>
                  <Popover.Dropdown>
                    <ScrollArea
                      h={
                        allUsers?.length === 1
                          ? "40px"
                          : allUsers?.length === 2
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
                              >
                                {getAvatarText(user.username)}
                              </Avatar>
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
              disabled={isFollowLoading || isLikeLoading}
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
    )
  );
}
