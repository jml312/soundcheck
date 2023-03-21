import { getSession } from "next-auth/react";
import { Flex } from "@mantine/core";
import client from "@/lib/sanity";
import { discoverQuery } from "@/lib/queries";
import axios from "axios";
import { clearAuthCookies } from "@/utils/clearAuthCookies";

const getMultipleRandom = (arr, n) => {
  const result = new Set();
  const len = arr.length;
  while (result.size < n && result.size < len) {
    result.add(arr[Math.floor(Math.random() * len)]);
  }
  return Array.from(result);
};

function Discover({ recommendations }) {
  return (
    <Flex
      justify={"center"}
      align={"center"}
      // direction={"column"}
      wrap={"wrap"}
      h={"calc(100vh - 5rem)"}
      w={"100%"}
      style={{
        transform: "translateY(5rem)",
      }}
    >
      {recommendations.map((item) => (
        <div
          key={item.songID}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img src={item.albumImage} alt={item.albumName} />
          <p>{item.songName}</p>
          <p>{item.albumName}</p>
          <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
          <audio src={item.previewUrl} controls />
        </div>
      ))}
    </Flex>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    clearAuthCookies(res);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const discoverData = await client.fetch(discoverQuery, {
      name: session.user.name,
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

    seedArtists = [...new Set(Array.from(seedArtists))];
    seedGenres = [...new Set(Array.from(seedGenres))];
    seedTracks = [...new Set(Array.from(seedTracks))];

    const { data } = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        params: {
          seed_artists: getMultipleRandom(seedArtists, 2).join(","),
          seed_genres: getMultipleRandom(seedGenres, 2).join(","),
          seed_tracks: getMultipleRandom(seedTracks, 1).join(","),
        },
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
        },
      }
    );

    const recommendations = data.tracks.map((item) => ({
      songName: item.name,
      songUrl: item.external_urls.spotify,
      previewUrl: item.preview_url,
      artists: item.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
      albumName: item.album.name,
      albumUrl: item.album.external_urls.spotify,
      albumImage: item.album.images[0].url,
      songID: item.id,
    }));

    return {
      props: {
        recommendations,
      },
    };
  } catch {
    clearAuthCookies(res);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export default Discover;
