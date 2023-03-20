import {
  Stack,
  Flex,
  UnstyledButton,
  Avatar,
  Text,
  Group,
  Button,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { truncateText } from "@/utils/truncateText";
import { deleteComment } from "@/actions";
import { useMemo } from "react";

export default function CommentCard({
  text,
  createdAt,
  formattedCreatedAt,
  username,
  userImage,
  isUser,
  post,
  setPost,
  comment,
  setComment,
}) {
  // memoize formattedCreatedAt
  const formattedCreatedAtMemo = useMemo(() => formattedCreatedAt, []);

  return (
    <Stack
      w={"100%"}
      maw={375}
      p={"xs"}
      sx={{
        borderRadius: "0.25rem",
        border: "0.75px solid rgba(201, 201, 201, 0.25)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <Flex
        w={"100%"}
        justify={"space-between"}
        align={"center"}
        sx={{
          borderBottom: "1px solid rgba(201, 201, 201, 0.5)",
        }}
      >
        <Flex align={"center"} gap={"xs"} pb={4}>
          <Link passHref href={isUser ? "/my-profile" : `/profile/${username}`}>
            <UnstyledButton>
              <Flex
                gap={"xs"}
                title={isUser ? "Your profile" : `${username}'s profile`}
                styles={{
                  cursor: "pointer !important",
                }}
                align="center"
                mb={-1}
              >
                <Avatar
                  size={32}
                  src={userImage}
                  alt={`${username}'s profile`}
                  radius={"xl"}
                  style={{
                    border: "1px solid #c0c1c4",
                  }}
                />
                <Title
                  order={6}
                  fw={500}
                  sx={{
                    color: "#e7e7e7",
                    cursor: "default",
                  }}
                >
                  {truncateText(post?.username, 12)}
                  {isUser ? " (you)" : ""}
                </Title>
              </Flex>
            </UnstyledButton>
          </Link>
        </Flex>
        <Text
          sx={{
            color: "rgba(201, 201, 201, 0.75)",
            cursor: "default",
            transform: "translateY(-0.35rem)",
          }}
        >
          {formattedCreatedAtMemo}
        </Text>
      </Flex>
      <Flex mt={-6} mb={4} maw={375} w={"100%"}>
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
        <Group grow spacing={0} w={"100%"} mt={"-.5rem"} position="center">
          <Button
            disabled={comment?.isLoading || comment?.isDeleting}
            fullWidth
            size={"xs"}
            title="Edit comment"
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
            title="Delete comment"
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
                username,
                createdAt,
                post,
                setPost,
                comment,
                setComment,
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
