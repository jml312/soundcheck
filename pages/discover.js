import { getSession, useSession } from "next-auth/react";
import { Flex, ScrollArea, Title, Text } from "@mantine/core";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
import Post from "@/components/Post";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import client from "@/lib/sanity";
import { userDiscoverQuery } from "@/lib/queries";
import dayjs from "dayjs";

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
      {recommendations?.length > 0 ? (
        <Title
          style={{
            transform: "translateY(1.5rem)",
            userSelect: "none",
          }}
          order={2}
        >
          Discover
        </Title>
      ) : null}

      {!recommendations?.length ? (
        <Title
          order={3}
          style={{
            userSelect: "none",
          }}
        >
          Nothing to discover yet. Go like some posts!
        </Title>
      ) : (
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
            {recommendations?.map((item) => (
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
      )}
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
    const recommendations = await client.fetch(userDiscoverQuery, {
      name: session.user.name,
    });

    if (!recommendations?.length) {
      return {
        redirect: {
          destination: `/feed?date=${dayjs().format("YYYY-MM-DD")}`,
          permanent: false,
        },
      };
    }

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