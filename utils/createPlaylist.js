import axios from "axios";

/**
 * @param {string} url
 * @description Converts an image URL to a base64 string
 */
const toBase64 = async (url) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = new Uint8Array(response.data);
  const base64 = Buffer.from(buffer).toString("base64");
  return base64;
};

/**
 * @param {string} id
 * @param {string} accessToken
 * @param {any} client
 * @description Creates a new playlist for the user and returns the playlist ID
 */
export const createPlaylist = async ({ id, accessToken, client }) => {
  try {
    const {
      data: { id: newPlaylistID },
    } = await axios.post(
      `https://api.spotify.com/v1/users/${id}/playlists`,
      {
        name: "Soundcheck!",
        public: false,
        collaborative: false,
        description: "Liked songs from Soundcheck!",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const base64Image = await toBase64(
      `${process.env.NEXT_PUBLIC_URL}/logo/soundcheck-spotify.png`
    );
    await axios.put(
      `https://api.spotify.com/v1/playlists/${newPlaylistID}/images`,
      base64Image,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ContentType: "image/jpeg",
        },
      }
    );

    await client.patch(id).set({ playlistID: newPlaylistID }).commit();

    return newPlaylistID;
  } catch {
    throw new Error("Failed to create playlist");
  }
};
