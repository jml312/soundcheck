import { getSession, useSession } from "next-auth/react";
import { Flex, ScrollArea, Title } from "@mantine/core";
import client from "@/lib/sanity";
import { discoverQuery } from "@/lib/queries";
import axios from "axios";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
import Post from "@/components/Post";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

const getMultipleRandom = (arr, n) => {
  const result = new Set();
  const len = arr.length;
  while (result.size < n && result.size < len) {
    result.add(arr[Math.floor(Math.random() * len)]);
  }
  return Array.from(result);
};

function Discover({ recommendations }) {
  const { data: session } = useSession();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const oneCard = useMediaQuery("(max-width: 900px)");
  const twoCards = useMediaQuery("(max-width: 1200px)");

  return (
    <Flex
      justify={"center"}
      align={"center"}
      direction={"column"}
      h={"calc(100vh - 5rem)"}
      w={"100%"}
      style={{
        transform: "translateY(5rem)",
        overflow: "hidden",
      }}
    >
      <Title
        style={{
          transform: "translateY(1.5rem)",
          userSelect: "none",
        }}
      >
        Discover
      </Title>
      <ScrollArea
        mb={"4.5rem"}
        w={oneCard ? "354px" : twoCards ? "700px" : "1050px"}
        type={"always"}
        offsetScrollbars
        style={{
          transform: "translateY(2.8rem)",
        }}
        styles={{
          scrollbar: {
            "&, &:hover": {
              background: "transparent",
              borderRadius: "0.5rem",
            },
            '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
              backgroundColor: "#474952",
            },
            '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
              display: "none",
            },
            corner: {
              display: "none !important",
            },
          },
        }}
      >
        <Flex justify={"center"} wrap={"wrap"} gap="1.5rem">
          {recommendations.map((item) => (
            <Post
              key={item.songID}
              post={{ ...item, _id: item.songID }}
              isDiscover
              currentlyPlaying={currentlyPlaying}
              setCurrentlyPlaying={setCurrentlyPlaying}
              session={session}
            />
          ))}
        </Flex>
      </ScrollArea>
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
