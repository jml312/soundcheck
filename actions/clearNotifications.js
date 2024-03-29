import axios from "axios";

/**
 * @param {string} notificationID
 * @param {Array} notifications
 * @param {Function} setNotifications
 * @param {string} userId
 * @param {Function} setIsLoading
 * @param {Function} close
 * @description Removes a notification from the user's notifications array
 */
export default async function clearNotifications({
  notificationIDs,
  notifications,
  setNotifications,
  userId,
  setIsLoading,
  close = () => {},
}) {
  const originalNotifications = notifications;
  setIsLoading(true);
  try {
    const newNotifications = notifications.filter(
      (notification) => !notificationIDs.includes(notification._key)
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
