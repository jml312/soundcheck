import axios from "axios";

/**
 * @param {string} userId
 * @description Gets the user's notifications
 */
export default async function getNotifications({ userId }) {
  const { data } = await axios.get("/api/protected/notification", {
    params: { userId },
  });
  return data;
}
