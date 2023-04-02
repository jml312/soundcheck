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
} from "@mantine/core";
import CommentCard from "../cards/CommentCard";
import { AiOutlineSend } from "react-icons/ai";
import { postComment } from "@/actions";
import { COMMENT_MAX_LENGTH } from "@/constants";
import { useState, useEffect, useRef, useMemo } from "react";
import dayjs from "dayjs";
import EmojiPicker from "../EmojiPicker";

export default function BottomSection({
  isSelect,
  isDiscover,
  post,
  comment,
  setComment,
  session,
  allUsers,
  isLikeLoading,
  isFollowLoading,
}) {
  const numComments = post?.comments?.length || 0;
  const [isCommentCreated, setIsCommentCreated] = useState(false);
  const [hasBlurredCommentError, setHasBlurredCommentError] = useState(false);
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
                                outline: "1px solid rgba(192, 193, 196, 0.75)",
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
                                  setHasBlurredCommentError,
                                  allUsers,
                                });
                              }}
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
