import {
  Stack,
  Flex,
  Avatar,
  Text,
  Space,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { truncateText, getAvatarText } from "@/utils";
import { deleteComment } from "@/actions";
import dayjs from "dayjs";
import { useMemo, useEffect, useRef } from "react";

/**
 * @param {string} text - The comment text
 * @param {string} createdAt - The comment's createdAt date
 * @param {string} userId - The comment's userId
 * @param {string} username - The comment's username
 * @param {string} userImage - The comment's userImage
 * @param {object} session - The session object
 * @param {object} post - The post object
 * @param {function} setPost - The setPost function
 * @param {object} comment - The comment object
 * @param {function} setComment - The setComment function
 * @param {object} commentInputRef - The commentInputRef object
 * @param {string} notificationPostId - The notificationPostId string
 * @param {string} notificationCommentId - The notificationCommentId string
 * @param {string} type - The type string
 * @param {array} allUsers - The allUsers array
 * @param {object} router - The router object
 * @param {boolean} isSmall - The isSmall boolean
 * @param {boolean} isProfile - The isProfile boolean
 * @description A comment card component
 */
export default function CommentCard({
  text,
  createdAt,
  userId,
  username,
  userImage,
  session,
  post,
  setPost,
  comment,
  setComment,
  commentInputRef,
  notificationPostId,
  notificationCommentId,
  type,
  allUsers,
  router,
  isSmall,
  isProfile,
}) {
  const theme = useMantineTheme();
  const commentRef = useRef();
  const formattedDate = useMemo(() => dayjs(createdAt).fromNow(), [post]);
  const isUser = userId === session?.user?.id;
  const splitText = text.split(" ");

  useEffect(() => {
    if (
      notificationPostId === post?._id &&
      notificationCommentId === createdAt &&
      ["comment", "mention"].includes(type)
    ) {
      router.replace(
        {
          pathname: "/feed",
          query: {},
        },
        undefined,
        { shallow: true }
      );
      setTimeout(() => {
        commentRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 275);
    }
  }, [notificationPostId, notificationCommentId]);

  return (
    <Flex
      ref={commentRef}
      w={isSmall ? "100%" : "350px"}
      pt={1}
      pl={1}
      gap={10}
      align="flex-start"
      style={{
        cursor: "default",
        placeSelf: "flex-start",
        overflowWrap: "anywhere",
      }}
    >
      <Avatar size={28} src={userImage} alt={`${username}'s profile`}>
        {getAvatarText(username)}
      </Avatar>
      <Stack
        spacing={1}
        align={"flex-start"}
        justify="flex-start"
        style={{
          transform: "translateY(-.05rem)",
        }}
        w={"100%"}
      >
        <Flex
          align="flex-start"
          style={{
            transform: "translateY(-.15rem)",
          }}
        >
          <Text
            fz={".86rem"}
            color={theme.colorScheme === "dark" ? "#F0F0F0" : "#0f0f0f"}
          >
            {truncateText(username, 12)}
          </Text>
          <Space w={6} />
          <Text
            color={theme.colorScheme === "dark" ? "#C0C0C0" : "#3f3f3f"}
            fz={".84rem"}
          >
            {formattedDate}
          </Text>
        </Flex>

        <Text
          mt=".075rem"
          fz={"1rem"}
          fw="bold"
          style={{
            transform: "translateY(-.25rem)",
          }}
        >
          {splitText.map((word, i) => {
            // check if word is a mention if it
            // starts with @, is the first occurrence of that username, and if the username exists
            const isMention =
              word.startsWith("@") &&
              text.indexOf(word) ===
                splitText.slice(0, i).join(" ").length + (i === 0 ? 0 : 1) &&
              allUsers?.some((user) => user.username === word.slice(1));
            const isEnd = i === splitText.length - 1;
            return isMention ? (
              <>
                <span
                  key={i}
                  style={{
                    color:
                      theme.colors.blue[theme.colorScheme === "dark" ? 5 : 7],
                  }}
                >
                  {word}
                </span>
                {!isEnd && " "}
              </>
            ) : (
              word + (!isEnd ? " " : "")
            );
          })}
        </Text>

        {!isProfile && (
          <Flex
            mt={isUser ? "-.45rem" : "-.1rem"}
            justify="flex-start"
            align="center"
            w={"100%"}
          >
            <UnstyledButton
              fs={"italic"}
              fz={".75rem"}
              color={theme.colorScheme === "dark" ? "#BDBDBD" : "#424242"}
              sx={{
                zIndex: 100,
              }}
              onClick={() => {
                commentInputRef.current.focus();
                setComment({
                  text:
                    comment.text + `${!comment.text ? "" : " "}@${username} `,
                  isLoading: false,
                  isDeleting: false,
                  isMentioning: false,
                  isFocused: true,
                });
              }}
            >
              Reply
            </UnstyledButton>
            {isUser && (
              <>
                &nbsp;&bull;&nbsp;
                <UnstyledButton
                  fs={"italic"}
                  fz={".75rem"}
                  color={theme.colorScheme === "dark" ? "#BDBDBD" : "#424242"}
                  sx={{
                    zIndex: 100,
                  }}
                  onClick={() =>
                    deleteComment({
                      userId,
                      createdAt,
                      post,
                      setPost,
                      text,
                      setComment,
                      allUsers,
                      session,
                    })
                  }
                >
                  Delete
                </UnstyledButton>
              </>
            )}
          </Flex>
        )}
      </Stack>
    </Flex>
  );
}
