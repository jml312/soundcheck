import { Modal } from "@mantine/core";

export default function NotificationModal({ opened, close }) {
  return (
    <Modal
      size="auto"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={() => {
        close();
      }}
      withCloseButton={false}
      padding={0}
      trapFocus={false}
    >
      notifications
    </Modal>
  );
}
