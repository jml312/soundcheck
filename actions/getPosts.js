import { getDayInterval } from "@/utils";
import { postsQuery } from "@/lib/queries";
import axios from "axios";

const getDayIntervalParams = (date) => {
  const { startDate: todayStart, endDate: todayEnd } = getDayInterval(date);
  return {
    todayStart: todayStart.toISOString(),
    todayEnd: todayEnd.toISOString(),
  };
};

const getClientPosts = async (client, params) => {
  const data = await client.fetch(postsQuery, {
    ...params,
  });
  return data;
};

const getApiPosts = async (params) => {
  const { data } = await axios.get("/api/protected/posts", { params });
  return data;
};

/**
 * @param {object} isClient - whether the function is being called on the client or server
 * @param {object} client - sanity client
 * @param {object} date - date to get posts for
 * @param {string} userId - user id
 * @description - gets posts for a given user and date
 */
export default async function getPosts({ isClient, client, date, userId }) {
  try {
    const params = { userId, ...getDayIntervalParams(date) };

    if (isClient) {
      return await getApiPosts(params);
    } else {
      return await getClientPosts(client, params);
    }
  } catch {
    return {};
  }
}
