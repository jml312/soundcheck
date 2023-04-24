import { discoverQuery } from "@/lib/queries";
import axios from "axios";
import { formatStats } from "@/utils";

/**
 * @param {string} userId
 * @param {string} accessToken
 * @param {Object} client
 * @description Gets a list of recommended songs based on the user's listening history
 */
export default async function getDiscoverSongs({
  userId,
  accessToken,
  client,
}) {
  const MAX_SEEDS = 5;

  try {
    const discoverData = await client.fetch(discoverQuery, {
      userId,
    });

    const keys = ["songID", "artists", "genres"];
    const formattedStats = formatStats({
      stats: discoverData,
      keys,
      truncate: false,
    }).map((item, idx) =>
      item.slice(0, MAX_SEEDS).map((el) => ({
        ...el,
        type: keys[idx],
      }))
    );

    const seedArtists = [];
    const seedGenres = [];
    const seedTracks = [];
    for (let i = 0; i < MAX_SEEDS * 3; i++) {
      if (
        seedArtists.length + seedGenres.length + seedTracks.length >=
        MAX_SEEDS
      ) {
        break;
      }
      const statIdx = i % keys.length;
      if (formattedStats[statIdx].length > 0) {
        const seed = formattedStats[statIdx].shift();
        switch (seed.type) {
          case "songID":
            seedTracks.push(seed.text);
            break;
          case "artists":
            seedArtists.push(seed.text);
            break;
          case "genres":
            seedGenres.push(seed.text);
            break;
        }
      }
    }

    const { data } = await axios.get(
      "https://api.spotify.com/v1/recommendations?limit=20",
      {
        params: {
          seed_artists: seedArtists.join(","),
          seed_genres: seedGenres.join(","),
          seed_tracks: seedTracks.join(","),
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const recommendations = data.tracks.map((item) => ({
      _key: item.id,
      songName: item.name,
      songUrl: item.external_urls.spotify,
      previewUrl: item.preview_url,
      artists: item.artists.map((artist) => ({
        _key: artist.id,
        id: artist.id,
        name: artist.name,
      })),
      albumName: item.album.name,
      albumUrl: item.album.external_urls.spotify,
      albumImage: item.album.images[0].url,
      songID: item.id,
    }));

    return recommendations;
  } catch {
    return [];
  }
}
