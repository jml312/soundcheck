import axios from "axios";

/**
 * @param {string} userId
 * @param {Object} notification
 * @param {Array} notifications
 * @param {Function} setNotifications
 * @param {Function} setIsLoading
 * @param {Function} close
 * @param {Object} router
 * @description Removes a notification from the user's notifications array
 * and redirects the user to the appropriate page
 */
export default async function viewNotification({
  userId,
  notification,
  notifications,
  setNotifications,
  setIsLoading,
  close,
  router,
}) {
  const {
    _key,
    type,
    commentId,
    post,
    userId: notificationUserId,
  } = notification;

  const originalNotifications = notifications;
  setIsLoading(true);
  try {
    const newNotifications = notifications.filter((n) => n._key !== _key);
    await axios.post("/api/protected/notification", {
      userId,
      newNotifications,
    });
    setNotifications(newNotifications);
    setIsLoading(false);
    if (close) {
      close();
    }
    let pathname, shallow;
    switch (type) {
      case "like":
        pathname = `/feed?postId=${post?._ref}&type=like`;
        shallow = router.pathname === "/feed";
        break;
      case "comment":
      case "mention":
        pathname = `/feed?postId=${post?._ref}&commentId=${commentId}&type=${type}`;
        shallow = router.pathname === "/feed";
        break;
      case "follow":
        pathname = `/profile/${notificationUserId}`;
        shallow = false;
    }
    router.push(pathname, undefined, { shallow });
  } catch {
    setIsLoading(false);
    setNotifications(originalNotifications);
  }
}
