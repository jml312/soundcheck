import NotificationCard from "../cards/NotificationCard";
import {
  Modal,
  ScrollArea,
  Button,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { clearNotification } from "@/actions";
import { useRouter } from "next/router";

export default function NotificationModal({
  opened,
  close,
  notifications,
  setNotifications,
  session,
  isLoading,
  setIsLoading,
}) {
  const router = useRouter();
  return (
    <Modal
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      centered
      onClose={() => {
        if (!isLoading) {
          close();
        }
      }}
      trapFocus={false}
      size="21.75rem"
      title={`${notifications.length} Notification${
        notifications.length !== 1 ? "s" : ""
      }`}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayOpacity={0.55}
        overlayBlur={3}
        zIndex={1000}
      />
      <Stack w="100%" align={"center"} h="100%">
        <ScrollArea
          w={"100%"}
          type={"always"}
          h="241px"
          mt={2}
          offsetScrollbars
          styles={{
            scrollbar: {
              "&, &:hover": {
                background: "transparent",
                borderRadius: "0.5rem",
              },
              '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                backgroundColor: "#474952",
              },
            },
          }}
        >
          <Stack spacing={"md"} align={"center"} justify="center" w="100%">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                notifications={notifications}
                setNotifications={setNotifications}
                opened={opened}
                session={session}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                close={close}
                router={router}
              />
            ))}
          </Stack>
        </ScrollArea>

        <Button
          mt={"-.25rem"}
          disabled={isLoading}
          fullWidth
          color="red"
          variant={"light"}
          onClick={() =>
            clearNotification({
              notificationIDs: notifications.map((n) => n._key),
              notifications,
              setNotifications,
              userId: session?.user?.id,
              setIsLoading,
              close,
            })
          }
        >
          Clear all
        </Button>
      </Stack>
    </Modal>
  );
}
