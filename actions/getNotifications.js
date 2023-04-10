import axios from "axios";

export default async function getNotifications({ userId }) {
  const { data } = await axios.get("/api/protected/notification", {
    params: { userId },
  });
  return data;
}
