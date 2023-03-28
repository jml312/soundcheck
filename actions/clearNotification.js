import axios from "axios";

export default async function clearNotification({
  notificationIDs,
  notifications,
  setNotifications,
  userId,
  setIsLoading,
  close,
}) {
  const originalNotifications = notifications;
  setIsLoading(true);
  try {
    const newNotifications = notifications.filter(
      (n) => !notificationIDs.includes(n._id)
    );
    // await axios.delete("/api/protected/notifications", {
    //   data: {
    //     userId,
    //     newNotifications,
    //   },
    // });
    setNotifications(newNotifications);
    setIsLoading(false);
    if (close) {
      close();
    }
  } catch {
    setIsLoading(false);
    setNotifications(originalNotifications);
  }
}
