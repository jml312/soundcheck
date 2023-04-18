import { getDayInterval } from "@/utils";
import { postsQuery } from "@/lib/queries";
import axios from "axios";
import dayjs from "dayjs";

const getDayIntervalParams = (date) => {
  const { startDate: todayStart, endDate: todayEnd } = getDayInterval(date);
  return {
    todayStart: todayStart.toISOString(),
    todayEnd: todayEnd.toISOString(),
  };
};

const getServerPosts = async (client, params) => {
  const currentPosts = await client.fetch(postsQuery, {
    userId: params.userId,
    todayStart: params.todayStart,
    todayEnd: params.todayEnd,
  });
  return currentPosts;
};

const getClientPosts = async (params) => {
  const { data: currentPosts } = await axios.get("/api/protected/posts", {
    params,
  });
  return currentPosts;
};

/**
 * @param {object} isClient - whether the function is being called on the client or server
 * @param {object} client - sanity client
 * @param {object} date - date to get posts for
 * @param {string} userId - user id
 * @description - gets posts for a given user and date
 */
export default async function getPosts({ isClient, client, userId }) {
  try {
    const params = { userId, ...getDayIntervalParams(dayjs()) };

    if (isClient) {
      return await getClientPosts(params);
    } else {
      return await getServerPosts(client, params);
    }
  } catch {
    return {
      userPost: null,
      feedPosts: [],
    };
  }
}
