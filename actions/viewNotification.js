import axios from "axios";

export default async function viewNotification({
  notification,
  notifications,
  setNotifications,
  userId,
  setIsLoading,
  close,
  router,
  type,
}) {
  const originalNotifications = notifications;
  setIsLoading(true);
  try {
    const newNotifications = notifications.filter(
      (n) => n._id !== notification._id
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
    let pathname, shallow;
    switch (type) {
      case "like":
        pathname = `/feed?postId=${notification.postID}&type=like`;
        shallow = router.pathname === "/feed";
        break;
      case "comment":
      case "mention":
        pathname = `/feed?postId=${notification.postID}&commentId=${notification.commentID}&type=${type}`;
        shallow = router.pathname === "/feed";
        break;
      case "follow":
        pathname = `/profile/${notification.userID}`;
        shallow = false;
    }
    router.push(pathname, undefined, { shallow });
  } catch {
    setIsLoading(false);
    setNotifications(originalNotifications);
  }
}
