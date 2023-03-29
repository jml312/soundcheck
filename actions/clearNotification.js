import axios from "axios";

export default async function clearNotification({
  notificationIDs,
  notifications,
  setNotifications,
  userId,
  setIsLoading,
  close,
}) {
  console.log(notificationIDs, notifications);
  const originalNotifications = notifications;
  setIsLoading(true);
  try {
    const newNotifications = notifications.filter(
      (n) => !notificationIDs.includes(n._key)
    );
    await axios.delete("/api/protected/notifications", {
      data: {
        userId,
        newNotifications,
      },
    });
    setNotifications(newNotifications);
    setIsLoading(false);
    if (newNotifications.length === 0) {
      close();
    }
  } catch {
    setIsLoading(false);
    setNotifications(originalNotifications);
  }
}
