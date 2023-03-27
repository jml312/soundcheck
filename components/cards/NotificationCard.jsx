import { Flex, Stack, Avatar, Button, Text, Group } from "@mantine/core";
import Link from "next/link";
import { truncateText } from "@/utils";
import { BsCheck, BsEyeFill } from "react-icons/bs";

export default function NotificationCard({
  type,
  postId,
  commentId,
  userId,
  username,
  userImage,
  createdAt,
  formattedCreatedAt,
}) {
  const getNotificationAction = () => {
    switch (type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "";
    }
  };
  return (
    <Stack
      // w="100%"
      w={"95%"}
      p={"xs"}
      style={{
        borderRadius: "0.5rem",
        border: "0.75px solid rgba(201, 201, 201, 0.25)",
      }}
    >
      <Flex
        justify={"space-between"}
        align={"center"}
        pb={"xs"}
        style={{
          borderBottom: "1px solid rgba(201, 201, 201, 0.5)",
        }}
      >
        <Link href={`/profile/${userId}`} passHref>
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
          </Button>
        </Link>
        <Text
          sx={{
            color: "rgba(201, 201, 201, 0.75)",
            cursor: "default",
          }}
          fz={".84rem"}
        >
          {formattedCreatedAt}
        </Text>
      </Flex>

      <Text align="center">
        {username} {getNotificationAction()}
      </Text>

      <Group grow spacing={0} w={"100%"} position="center">
        <Button
          // disabled={}
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
          leftIcon={<BsCheck />}
          onClick={() => {}}
        >
          Clear
        </Button>
        {type !== "follow" && (
          <Button
            // disabled={}
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
            leftIcon={<BsEyeFill />}
            onClick={() => {}}
          >
            View
          </Button>
        )}
      </Group>
    </Stack>
  );
}
