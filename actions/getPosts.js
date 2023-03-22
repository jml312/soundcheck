import dayjs from "dayjs";
import { getDayInterval } from "@/utils/getDayInterval";

export default async function getPosts({ isClient, date, userId }) {
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
    const client = await import("@/lib/sanity").then((res) => res.default);
    const { postsQuery } = await import("@/lib/queries");
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
