import { getSession, useSession } from "next-auth/react";
import { Flex, ScrollArea, Title, Text, Stack } from "@mantine/core";
import { getDayInterval, clearAuthCookies } from "@/utils";
import Post from "@/components/Post/Post";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import client from "@/lib/sanity";
import { userDiscoverQuery, hasPostedTodayQuery } from "@/lib/queries";
import dayjs from "dayjs";

function Discover({ recommendations }) {
  const { data: session } = useSession();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [activePost, setActivePost] = useState(null);

  const twoCards = useMediaQuery("(min-width: 745px) and (max-width: 1092px)");
  const threeCards = useMediaQuery(
    "(min-width: 1092px) and (max-width: 1425px)"
  );
  const fourCards = useMediaQuery("(min-width: 1425px)");

  const getScrollAreaWidth = () => {
    if (twoCards) return "705px";
    else if (threeCards) return "1050px";
    else if (fourCards) return "1395px";
    else return "360px";
  };

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
        <Stack
          align={"center"}
          spacing={8}
          style={{
            transform: "translateY(1.5rem)",
            userSelect: "none",
          }}
        >
          <Title order={2}>Discover</Title>
          <Text c="dimmed">Like posts or come back tomorrow for more!</Text>
        </Stack>
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
          w={getScrollAreaWidth()}
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
                activePost={activePost}
                setActivePost={setActivePost}
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
    const { startDate: todayStart, endDate: todayEnd } = getDayInterval(
      dayjs()
    );
    const hasPostedToday = await client.fetch(hasPostedTodayQuery, {
      userId: session.user.id,
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
    });

    if (!hasPostedToday) {
      return {
        redirect: {
          destination: "/feed",
          permanent: false,
        },
      };
    }

    const recommendations = await client.fetch(userDiscoverQuery, {
      userId: session.user.id,
    });

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
