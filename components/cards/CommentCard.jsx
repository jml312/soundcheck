import {
  Stack,
  Flex,
  Avatar,
  Text,
  Space,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { truncateText } from "@/utils";
import { deleteComment } from "@/actions";
import { useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";

export default function CommentCard({
  text,
  createdAt,
  userId,
  username,
  userImage,
  post,
  setPost,
  comment,
  setComment,
  commentInputRef,
  notificationPostId,
  notificationCommentId,
  commentScrollRef,
  allUsers,
  isSmall,
  session,
}) {
  const theme = useMantineTheme();
  const commentRef = useRef();
  const formattedDate = useMemo(() => dayjs(createdAt).fromNow(), [post]);
  const isUser = userId === session?.user?.id;

  const splitText = text.split(" ");

  const newText = splitText
    .map((word, i) => {
      const isMention =
        word.startsWith("@") &&
        text.indexOf(word) ===
          splitText.slice(0, i).join(" ").length + (i === 0 ? 0 : 1) &&
        allUsers?.some((user) => user.username === word.slice(1));
      return isMention ? (
        <span
          key={i}
          style={{
            color: theme.colors.blue[6],
          }}
        >
          {word}
        </span>
      ) : (
        word
      );
    })
    .join(" ");

  console.log(newText);

  useEffect(() => {
    if (
      notificationPostId === post?._id &&
      notificationCommentId === createdAt
    ) {
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
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
      }}
    >
      <Avatar
        size={28}
        src={userImage}
        alt={`${username}'s profile`}
        radius={"xl"}
        style={{
          outline: "1px solid #c0c1c4",
        }}
      />
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
          <Text fz={".86rem"} color="#F0F0F0">
            {truncateText(username, 12)}
          </Text>
          <Space w={6} />
          <Text color="#C0C0C0" fz={".84rem"}>
            {formattedDate}
          </Text>
        </Flex>

        <Text
          mt=".1rem"
          color="#FFFFFF"
          fz={"1rem"}
          fw="bold"
          style={{
            lineHeight: "1.25rem",
            transform: "translateY(-.25rem)",
          }}
        >
          {splitText.map((word, i) => {
            // check if word is a mention
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
                    color: theme.colors.blue[6],
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

        <Flex
          mt={isUser ? "-.4rem" : "-.2rem"}
          justify="flex-start"
          align="center"
          w={"100%"}
        >
          <UnstyledButton
            fz={".75rem"}
            color="#BDBDBD"
            sx={{
              zIndex: 100,
            }}
            onClick={() => {
              commentInputRef.current.focus();
              setComment({
                text: comment.text + `${!comment.text ? "" : " "}@${username} `,
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
                fz={".75rem"}
                color="#BDBDBD"
                sx={{
                  zIndex: 100,
                }}
                onClick={() =>
                  deleteComment({
                    userId,
                    createdAt,
                    post,
                    setPost,
                    comment,
                    setComment,
                    commentScrollRef,
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
      </Stack>
    </Flex>
  );
}
