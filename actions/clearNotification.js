import axios from "axios";

export default async function clearNotification({
  notificationID,
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
      (n) => n._key !== notificationID
    );
    await axios.post("/api/protected/notification", {
      userId,
      newNotifications,
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
