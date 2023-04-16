import NotificationCard from "../cards/NotificationCard";
import { Modal, ScrollArea, Stack, LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";

/**
 * @param {boolean} opened - The opened boolean
 * @param {function} close - The close function
 * @param {array} notifications - The notifications array
 * @param {function} setNotifications - The setNotifications function
 * @param {object} session - The session object
 * @param {boolean} isLoading - The isLoading boolean
 * @param {function} setIsLoading - The setIsLoading function
 * @description A notification modal component
 */
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
          h="241px"
          mt={2}
          styles={{
            viewport: {
              scrollSnapType: "none",
            },
          }}
        >
          <Stack spacing={"md"} align={"center"} justify="center" w="100%">
            {notifications?.map((notification) => (
              <NotificationCard
                key={notification._key}
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
      </Stack>
    </Modal>
  );
}
