import { postsQuery } from "@/lib/queries";
import axios from "axios";

const getServerPosts = async (client, params) => {
  const currentPosts = await client.fetch(postsQuery, params);
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
 * @param {string} currentDate - current day
 * @description - gets posts for a given user and date
 */
export default async function getPosts({
  isClient,
  client,
  userId,
  currentDate,
}) {
  try {
    const params = {
      userId,
      currentDate,
    };

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
