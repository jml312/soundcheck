import dayjs from "dayjs";
import { getDayInterval } from "@/utils";
import { postsQuery } from "@/lib/queries";

export default async function getPosts({ isClient, client, date, userId }) {
  const { startDate, endDate } = getDayInterval(date);
  const { startDate: todayStart, endDate: todayEnd } = getDayInterval(dayjs());
  if (isClient) {
    const axios = await import("axios").then((res) => res.default);
    const { data } = await axios.get("/api/protected/search", {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        todayStart: todayStart.toISOString(),
        todayEnd: todayEnd.toISOString(),
        userId,
      },
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
