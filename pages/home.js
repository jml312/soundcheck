import { getSession } from "next-auth/react";
import Rightbar from "@/components/Rightbar";
import { fetchSpotify } from "@/utils/fetchSpotify";
import client from "@/lib/sanity";
import { hasPostedTodayQuery, todayPostsQuery } from "@/lib/queries";
import { useState } from "react";
import { serverLogout } from "@/utils/serverLogout";
import Post from "@/components/Post";
import { Flex, Button, Text, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FilterModal from "@/components/modals/FilterModal";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

function Home({ spotifyData, userPost, todayPosts }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [posts, setPosts] = useState({
    feedPosts: todayPosts,
    userPost,
  });
  const [feedFilter, setFeedFilter] = useState({
    date: new Date(),
    type: "Everyone",
  });
  const [filterOpened, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo("en-US");
  const feedPosts = posts?.feedPosts;
  const setFeedPosts = (posts) => {
    setPosts({ ...posts, feedPosts: posts });
  };
  const setFeedPost = (post) => {
    setPosts({
      ...posts,
      feedPosts: [...feedPosts.filter((p) => p._id !== post._id), post].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    });
  };
  const setUserPost = (post) => {
    setPosts({ ...posts, userPost: post });
  };

  // console.log(posts.feedPosts);

  return (
    <>
      <FilterModal
        opened={filterOpened}
        close={closeFilter}
        feedFilter={feedFilter}
        setFeedFilter={setFeedFilter}
        todayPosts={todayPosts}
        feedPosts={feedPosts}
        setFeedPosts={setFeedPosts}
      />

      <Flex
        style={{
          height: "calc(100vh - 5rem)",
        }}
        justify={"space-between"}
        align={"stretch"}
        direction={"column"}
      >
        <Flex
          w={"75%"}
          h="100%"
          justify={"center"}
          align={"center"}
          style={{
            transform: "translateY(5rem)",
          }}
          direction={"column"}
        >
          <Flex
            w="100%"
            justify={"center"}
            align={"center"}
            style={{
              transform: "translateY(-4rem)",
            }}
          >
            <Button variant="light" color="gray" size="sm" onClick={openFilter}>
              {feedFilter.type} on{" "}
              {feedFilter.date.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Button>
          </Flex>

          {!feedPosts ? (
            <Text fz={"lg"}>
              {`No posts found for ${feedFilter.type.toLowerCase()} on ${feedFilter.date.toLocaleString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}`}
            </Text>
          ) : (
            <ScrollArea
              w="75%"
              h={500}
              // h={475}
              // type="never"
              type="hover"
              // type="always"
              pt={"2rem"}
              styles={{
                scrollbar: {
                  transform: "translateY(2rem)",
                },
              }}
              style={{
                transform: "translateY(-2rem)",
              }}
            >
              <Flex
                gap={"2.5rem"}
                justify={"space-evenly"}
                align={"center"}
                wrap={"wrap"}
                w={"100%"}
                h="100%"
              >
                {feedPosts?.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    setPost={setFeedPost}
                    currentlyPlaying={currentlyPlaying}
                    setCurrentlyPlaying={setCurrentlyPlaying}
                    timeAgo={timeAgo}
                  />
                ))}
              </Flex>
            </ScrollArea>
          )}
        </Flex>

        <Rightbar
          spotifyData={spotifyData}
          post={posts?.userPost}
          setPost={setUserPost}
          currentlyPlaying={currentlyPlaying}
          setCurrentlyPlaying={setCurrentlyPlaying}
          timeAgo={timeAgo}
        />
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    serverLogout(res);
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysString = today.toISOString();

    const { userPost } = await client.fetch(hasPostedTodayQuery, {
      name: session?.user?.name,
      todayStart: todaysString,
    });

    const todayPosts = await client.fetch(todayPostsQuery, {
      name: session?.user?.name,
      todayStart: todaysString,
    });

    if (userPost) {
      return {
        props: {
          userPost,
          todayPosts,
        },
      };
    }

    const spotifyData = await fetchSpotify(session?.user?.access_token);

    return {
      props: {
        todayPosts,
        spotifyData,
      },
    };
  } catch {
    serverLogout(res);
  }
}

export default Home;
