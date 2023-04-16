import {
  Flex,
  Stack,
  Avatar,
  Text,
  Space,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useMemo, useCallback } from "react";
import { truncateText } from "@/utils";
import dayjs from "dayjs";
import { clearNotification, viewNotification } from "@/actions";
import { getAvatarText } from "@/utils";

/**
 * @param {object} notification - The notification object
 * @param {array} notifications - The notifications array
 * @param {function} setNotifications - The setNotifications function
 * @param {boolean} opened - The opened boolean
 * @param {object} session - The session object
 * @param {boolean} isLoading - The isLoading boolean
 * @param {function} setIsLoading - The setIsLoading function
 * @param {function} close - The close function
 * @param {object} router - The router object
 * @description A notification card component
 */
export default function NotificationCard({
  notification,
  notifications,
  setNotifications,
  opened,
  session,
  isLoading,
  setIsLoading,
  close,
  router,
}) {
  const {
    type,
    createdAt,
    userImage: notificationUserImage,
    username: notificationUsername,
  } = notification;
  const formattedDate = useMemo(() => dayjs(createdAt).fromNow(), [opened]);
  const theme = useMantineTheme();
  const getNotificationAction = useCallback(() => {
    switch (type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "mention":
        return "mentioned you in a comment";
      case "follow":
        return "started following you";
      default:
        return "";
    }
  }, [type]);

  return (
    <Flex
      w={"auto"}
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
      <Avatar
        size={28}
        src={notificationUserImage}
        alt={`${notificationUsername}'s profile`}
      >
        {getAvatarText(notificationUsername)}
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
            {truncateText(notificationUsername, 12)}
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
          {getNotificationAction()}
        </Text>

        <Flex mt={"-.45rem"} justify="flex-start" align="center" w={"100%"}>
          <UnstyledButton
            disabled={isLoading}
            fs={"italic"}
            fz={".75rem"}
            color={theme.colorScheme === "dark" ? "#BDBDBD" : "#424242"}
            sx={{
              zIndex: 100,
            }}
            onClick={() =>
              clearNotification({
                notificationID: notification._key,
                notifications,
                setNotifications,
                userId: session?.user?.id,
                setIsLoading,
                close,
              })
            }
          >
            Clear
          </UnstyledButton>
          &nbsp;&bull;&nbsp;
          <UnstyledButton
            disabled={isLoading}
            fs={"italic"}
            fz={".75rem"}
            color={theme.colorScheme === "dark" ? "#BDBDBD" : "#424242"}
            sx={{
              zIndex: 100,
            }}
            onClick={() =>
              viewNotification({
                notification,
                notifications,
                setNotifications,
                userId: session?.user?.id,
                setIsLoading,
                close,
                router,
                type,
              })
            }
          >
            View
          </UnstyledButton>
        </Flex>
      </Stack>
    </Flex>
  );
}
