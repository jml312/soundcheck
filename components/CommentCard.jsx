import { Stack, Flex, Avatar, Text, Group, Button } from "@mantine/core";
import Link from "next/link";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { truncateText } from "@/utils";
import { deleteComment } from "@/actions";
import { useMemo } from "react";

export default function CommentCard({
  text,
  createdAt,
  formattedCreatedAt,
  userId,
  username,
  userImage,
  isUser,
  post,
  setPost,
  comment,
  setComment,
  numComments,
  commentsRef,
}) {
  const formattedCreatedAtMemo = useMemo(() => formattedCreatedAt, []);

  return (
    <Stack
      w={"95%"}
      maw={375}
      p={"xs"}
      sx={{
        borderRadius: "0.5rem",
        border: "0.75px solid rgba(201, 201, 201, 0.25)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        placeSelf: numComments > 1 ? "start" : "center",
      }}
    >
      <Flex
        w={"100%"}
        justify={"space-between"}
        align={"center"}
        sx={{
          borderBottom: "1px solid rgba(201, 201, 201, 0.5)",
        }}
        mt={-4}
        pb={4}
      >
        <Link
          href={isUser ? "/my-profile" : `/profile/${post?.userId}`}
          passHref
        >
          <Button
            ml={"-.5rem"}
            compact
            size={"md"}
            sx={{
              zIndex: 1,
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.75)",
              backgroundColor: "transparent !important",
              cursor: "pointer",
              "&:active": {
                transform: "none",
              },
            }}
            fz={".86rem"}
            fw={500}
            component="a"
            leftIcon={
              <Avatar
                size={21}
                src={userImage}
                alt={`${username}'s profile`}
                radius={"xl"}
                style={{
                  outline: "1px solid #c0c1c4",
                }}
              />
            }
          >
            {truncateText(username, 12)}
            {isUser ? " (you)" : ""}
          </Button>
        </Link>
        <Text
          sx={{
            color: "rgba(201, 201, 201, 0.75)",
            cursor: "default",
          }}
          fz={".84rem"}
        >
          {formattedCreatedAtMemo}
        </Text>
      </Flex>
      <Flex
        mt={-6}
        mb={4}
        w={"99%"}
        style={{
          userSelect: "none !important",
        }}
      >
        <Text
          sx={{
            color: "#c9c9c9",
            cursor: "default",
            wordBreak: "break-word",
            transform: "translateX(0.25rem)",
          }}
        >
          {text}
        </Text>
      </Flex>
      {isUser && (
        <Group grow spacing={0} w={"100%"} mt={"-.75rem"} position="center">
          <Button
            disabled={comment?.isLoading || comment?.isDeleting}
            fullWidth
            size={"xs"}
            variant={"default"}
            color="blue"
            sx={{
              borderTopRightRadius: "0rem",
              borderBottomRightRadius: "0rem",
              borderBottomLeftRadius: "0.25rem",
              borderTopLeftRadius: "0.25rem",
              "&:hover": {
                backgroundColor: "rgba(25, 113, 194, 0.2) !important",
              },
            }}
            leftIcon={<AiFillEdit />}
            onClick={() => {
              setComment({
                ...comment,
                type: "edit",
              });
              setTimeout(() => {
                setComment({
                  ...comment,
                  text,
                  originalText: text,
                  type: "edit",
                  editedAt: createdAt,
                });
              }, 0);
            }}
          >
            Edit
          </Button>
          <Button
            disabled={comment?.isLoading || comment?.isDeleting}
            fullWidth
            size={"xs"}
            variant={"default"}
            color="red"
            sx={{
              borderTopRightRadius: "0.25rem",
              borderBottomRightRadius: "0.25rem",
              borderBottomLeftRadius: "0rem",
              borderTopLeftRadius: "0rem",
              "&:hover": {
                backgroundColor: "#4b272b !important",
              },
            }}
            leftIcon={<AiFillDelete />}
            onClick={() =>
              deleteComment({
                userId,
                createdAt,
                post,
                setPost,
                comment,
                setComment,
                commentsRef,
              })
            }
          >
            Delete
          </Button>
        </Group>
      )}
    </Stack>
  );
}
