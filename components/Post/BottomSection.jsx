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
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import CommentCard from "../cards/CommentCard";
import { AiOutlineSend } from "react-icons/ai";
import { postComment } from "@/actions";
import { COMMENT_MAX_LENGTH } from "@/constants";
import { useState, useEffect, useRef, useMemo } from "react";
import dayjs from "dayjs";
import MentionCard from "../cards/MentionCard";

/**
 * @param {boolean} isPostModal - The isPostModal boolean
 * @param {boolean} isSelect - The isSelect boolean
 * @param {boolean} isDiscover - The isDiscover boolean
 * @param {boolean} isProfile - The isProfile boolean
 * @param {boolean} isSmall - The isSmall boolean
 * @param {object} post - The post object
 * @param {function} setPost - The setPost function
 * @param {object} comment - The comment object
 * @param {function} setComment - The setComment function
 * @param {object} session - The session object
 * @param {array} allUsers - The allUsers array
 * @param {boolean} isLikeLoading - The isLikeLoading boolean
 * @param {boolean} isFollowLoading - The isFollowLoading boolean
 * @param {function} setCurrentlyPlaying - The setCurrentlyPlaying function
 * @param {function} openPostModal - The openPostModal function
 * @param {object} badWordsFilter - The badWordsFilter object
 * @param {string} notificationPostId - The notificationPostId string
 * @param {string} notificationCommentId - The notificationCommentId string
 * @param {string} type - The type string
 * @param {object} router - The router object
 * @description The bottom section of a post
 */
export default function BottomSection({
  isPostModal,
  isSelect,
  isDiscover,
  isProfile,
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
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const numComments = post?.comments?.length || 0;
  const [isCommentCreated, setIsCommentCreated] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const commentInputRef = useRef(null);
  const commentScrollEndRef = useRef(null);
  const formattedPostedAt = useMemo(
    () => dayjs(post?.createdAt).fromNow(),
    [post]
  );

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
          borderTop: `1px solid ${theme.colors.cardDivider[colorScheme]}`,
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
                h={!comment.error ? "148px" : "168px"}
                w="100%"
                pb={"0.5rem"}
                styles={{
                  viewport: {
                    scrollSnapType: "none",
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
                    {isProfile ? "No comments" : "No comments yet..."}
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
                          isProfile={isProfile}
                        />
                      )
                    )}
                  </Stack>
                )}
                <div ref={commentScrollEndRef} />
              </ScrollArea>
              {!isProfile && (
                <Box
                  sx={{
                    borderTop: `1px solid ${
                      theme.colors.cardDivider[theme.colorScheme]
                    }`,
                    width: "100%",
                  }}
                  mb={"0.25rem"}
                >
                  <Popover
                    opened={comment.isMentioning && comment.isFocused}
                    position="top"
                    width="target"
                    offset={1}
                    withinPortal
                    color="dark.7"
                    styles={{
                      dropdown: {
                        zIndex: 100,
                        border: "none",
                        outline: `1px solid ${
                          theme.colors.border[theme.colorScheme]
                        }`,
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
                            color: theme.colors.pure[theme.colorScheme],
                            borderTopColor: `${
                              theme.colors.cardDivider[theme.colorScheme]
                            }`,
                            fontSize: "1rem",
                            marginBottom: "-.35rem",
                            "&:focus": {
                              borderTopColor: `${
                                theme.colors.cardDivider[theme.colorScheme]
                              }`,
                            },
                            "&::placeholder": {
                              color:
                                theme.colors.placeholder[theme.colorScheme],
                            },
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
                                transform: "translateX(.3rem)",
                                borderRadius: "0.5rem",
                              }}
                            >
                              <Tooltip
                                disabled={comment.text.length === 0}
                                offset={-2}
                                position="top"
                                label={"post"}
                                withinPortal
                              >
                                <ActionIcon
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
                                  sx={{
                                    cursor: "pointer",
                                    color: theme.colors.pure[theme.colorScheme],
                                    "&[data-disabled]": {
                                      color:
                                        theme.colorScheme === "dark"
                                          ? "#868e96 !important"
                                          : "#797169 !important",
                                    },
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
                        offsetScrollbars={false}
                        styles={{
                          viewport: {
                            scrollSnapType: "none",
                          },
                        }}
                      >
                        <Stack w="100%" spacing={"xs"}>
                          {allUsers?.map((user) => (
                            <MentionCard
                              key={user.userId}
                              user={user}
                              comment={comment}
                              setComment={setComment}
                              commentInputRef={commentInputRef}
                            />
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Popover.Dropdown>
                  </Popover>
                </Box>
              )}
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
              sx={{
                color: theme.colors.dimmed[theme.colorScheme],
                transform: "translateX(.25rem) translateY(-.25rem)",
              }}
            >
              {numComments === 0
                ? isProfile
                  ? "No comments"
                  : "Add a comment..."
                : `View comment${numComments === 1 ? "" : "s"}`}
            </UnstyledButton>
            <Text
              sx={{
                transform: "translateX(-.15rem) translateY(-.25rem)",
                cursor: "default",
                color: theme.colors.dimmed[theme.colorScheme],
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
