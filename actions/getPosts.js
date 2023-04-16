import dayjs from "dayjs";
import { getDayInterval } from "@/utils";
import { postsQuery } from "@/lib/queries";
import axios from "axios";

/**
 * @param {boolean} isClient
 * @param {Object} client
 * @param {string} date
 * @param {string} userId
 * @description Gets the user's posts for a given day
 */
export default async function getPosts({ isClient, client, date, userId }) {
  try {
    const { startDate, endDate } = getDayInterval(date);
    const { startDate: todayStart, endDate: todayEnd } = getDayInterval(
      dayjs()
    );
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
      userId,
    };
    if (isClient) {
      const { data } = await axios.get("/api/protected/posts", { params });
      return data;
    } else {
      const data = await client.fetch(postsQuery, params);
      return data;
    }
  } catch {
    return {};
  }
}
