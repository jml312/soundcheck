import axios from "axios";
import dayjs from "dayjs";
import client from "@/lib/sanity";
import { recentlyPlayedQuery } from "@/lib/queries";

export const fetchSpotify = async (session) => {
  const { accessToken, id } = session.user;

  try {
    const recentlyPlayedSongs = await client.fetch(recentlyPlayedQuery, {
      userId: id,
    });

    if (recentlyPlayedSongs?.length > 0) {
      return recentlyPlayedSongs;
    }

    const spotifyData = [];

    // fetch currently playing
    const { data: currentlyPlaying } = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: "application/json",
          contentType: "application/json",
        },
      }
    );
    if (
      !!currentlyPlaying &&
      currentlyPlaying.currently_playing_type === "track"
    ) {
      spotifyData.push({
        playedAt: dayjs(Number(currentlyPlaying.timestamp)).toISOString(),
        songName: currentlyPlaying.item.name,
        songUrl: currentlyPlaying.item.external_urls.spotify,
        previewUrl: currentlyPlaying.item.preview_url,
        artists: currentlyPlaying.item.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        albumName: currentlyPlaying.item.album.name,
        albumUrl: currentlyPlaying.item.album.external_urls.spotify,
        albumImage: currentlyPlaying.item.album.images[0].url,
        songID: currentlyPlaying.item.id,
      });
    }

    // fetch recently played
    const { data: recentlyPlayed } = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const filteredRecentlyPlayed = recentlyPlayed.items
      .filter((item) => item.track.type === "track")
      .map((item) => ({
        playedAt: item.played_at,
        songName: item.track.name,
        songUrl: item.track.external_urls.spotify,
        previewUrl: item.track.preview_url,
        artists: item.track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        albumName: item.track.album.name,
        albumUrl: item.track.album.external_urls.spotify,
        albumImage: item.track.album.images[0].url,
        songID: item.track.id,
      }))
      .filter(
        (v, i, a) =>
          a.findIndex((t) => t.songName === v.songName) === i &&
          v.songName !== spotifyData[0]?.songName
      )
      .sort((a, b) => (a.playedAt < b.playedAt ? 1 : -1));

    const allData = await Promise.all(
      [...spotifyData, ...filteredRecentlyPlayed].map(async (item) => {
        const genres = await Promise.all(
          item.artists.map(async (artist) => {
            const { data } = await axios.get(
              `https://api.spotify.com/v1/artists/${artist.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            return data.genres;
          })
        );
        return {
          ...item,
          _key: item.songID,
          artists: item.artists.map((artist) => ({
            ...artist,
            _key: artist.id,
          })),
          genres: [...new Set(genres.flat())],
        };
      })
    );

    await client
      .patch(id)
      .set({
        recentlyPlayed: allData,
      })
      .commit();

    return allData;
  } catch {
    return [];
  }
};
