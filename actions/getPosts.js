import dayjs from "dayjs";
import { getDayInterval } from "@/utils";
import { postsQuery } from "@/lib/queries";
import axios from "axios";

export default async function getPosts({ isClient, client, date, userId }) {
  const { startDate, endDate } = getDayInterval(date);
  const { startDate: todayStart, endDate: todayEnd } = getDayInterval(dayjs());
  if (isClient) {
    const { data } = await axios.get("/api/protected/posts", {
      params: { userId },
    });
    return data;
  } else {
    const data = await client.fetch(postsQuery, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
      userId,
    });
    return data;
  }
}
