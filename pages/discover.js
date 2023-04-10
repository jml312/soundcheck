import { getSession, useSession } from "next-auth/react";
import { Flex, ScrollArea, Title, Text, Stack } from "@mantine/core";
import { getDayInterval, clearAuthCookies } from "@/utils";
import Post from "@/components/Post/Post";
import { useState } from "react";
import client from "@/lib/sanity";
import { userDiscoverQuery, hasPostedTodayQuery } from "@/lib/queries";
import dayjs from "dayjs";

function Discover({ recommendations }) {
  const { data: session } = useSession();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [recs, setRecs] = useState(
    recommendations.map((r) => ({ ...r, _id: r.songID }))
  );

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
          }}
        >
          <Title order={2}>Discover</Title>
          <Text
            sx={(theme) => ({
              color: theme.colors.dimmed[theme.colorScheme],
            })}
          >
            Like posts or come back tomorrow for more!
          </Text>
        </Stack>
      ) : null}

      {!recommendations?.length ? (
        <Title order={3}>Nothing to discover yet. Go like some posts!</Title>
      ) : (
        <ScrollArea
          mb={"4.5rem"}
          w="92%"
          maw="1050x"
          style={{
            transform: "translateY(2.8rem)",
          }}
        >
          <Flex justify={"center"} wrap={"wrap"} gap="1.5rem">
            {recs?.map((rec, idx) => (
              <Post
                key={rec._id}
                post={rec}
                setPost={(newPost) => {
                  setRecs((prev) => {
                    const newRecs = [...prev];
                    newRecs[idx] = newPost;
                    return newRecs;
                  });
                }}
                isDiscover
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
                session={session}
                activePost={activePost}
                setActivePost={setActivePost}
                idx={idx}
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
