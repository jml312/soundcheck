import { discoverQuery } from "@/lib/queries";
import axios from "axios";

const getMultipleRandom = (arr, n) => {
  const result = new Set();
  const len = arr.length;
  while (result.size < n && result.size < len) {
    result.add(arr[Math.floor(Math.random() * len)]);
  }
  return Array.from(result);
};

export default async function getDiscoverSongs({
  userId,
  accessToken,
  client,
}) {
  const discoverData = await client.fetch(discoverQuery, {
    userId,
  });

  let seedArtists = [],
    seedGenres = [],
    seedTracks = [];

  discoverData.forEach((item) => {
    if (item?.artists?.length > 0) {
      seedArtists.push(...item.artists);
    }
    if (item?.genres?.length > 0) {
      seedGenres.push(...item.genres);
    }
    if (item?.songID) {
      seedTracks.push(item.songID);
    }
  });

  seedArtists = [...new Set(Array.from(seedArtists))].map((item) => ({
    value: item,
    type: "artist",
  }));
  seedGenres = [...new Set(Array.from(seedGenres))].map((item) => ({
    value: item,
    type: "genre",
  }));
  seedTracks = [...new Set(Array.from(seedTracks))].map((item) => ({
    value: item,
    type: "track",
  }));

  const mergedSeeds = getMultipleRandom(
    [...seedArtists, ...seedGenres, ...seedTracks],
    5
  ).reduce(
    (acc, item) => {
      if (item.type === "artist") {
        acc["artists"].push(item.value);
      } else if (item.type === "genre") {
        acc["genres"].push(item.value);
      } else if (item.type === "track") {
        acc["tracks"].push(item.value);
      }
      return acc;
    },
    {
      artists: [],
      genres: [],
      tracks: [],
    }
  );

  const { data } = await axios.get(
    "https://api.spotify.com/v1/recommendations?limit=21",
    {
      params: {
        seed_artists: mergedSeeds.artists.join(","),
        seed_genres: mergedSeeds.genres.join(","),
        seed_tracks: mergedSeeds.tracks.join(","),
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
}
