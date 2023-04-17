import axios from "axios";

/**
 * @param {string} id
 * @param {string} accessToken
 * @param {string} playlistID
 * @description Checks if the user follows the Soundcheck! playlist
 */
export const checkFollowsSoundcheck = async ({
  id,
  accessToken,
  playlistID,
}) => {
  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistID}/followers/contains?ids=${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data[0];
  } catch {
    return false;
  }
};
