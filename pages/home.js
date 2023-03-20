import { getSession, useSession } from "next-auth/react";
import { fetchSpotify } from "@/utils/fetchSpotify";
import client from "@/lib/sanity";
import { postsQuery } from "@/lib/queries";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
import Post from "@/components/Post";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import FilterModal from "@/components/modals/FilterModal";
import { getDayInterval } from "@/utils/getDayInterval";
import dayjs from "dayjs";
import { useState } from "react";
import { Flex, Button, Text, ScrollArea } from "@mantine/core";
import SelectSongModal from "@/components/modals/SelectSongModal";
import Filter from "bad-words";

function Home({ spotifyData, todayPosts }) {
  const { data: session } = useSession();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [posts, setPosts] = useState({
    feedPosts: todayPosts.feedPosts,
    userPost: todayPosts.userPost,
  });
  const [feedFilter, setFeedFilter] = useState({
    date: dayjs().toDate(),
    type: "Everyone",
  });
  const [caption, setCaption] = useState({
    text: posts.userPost?.caption || "",
    originalText: posts.userPost?.caption || "",
    error: "",
    isEditing: !posts.userPost?.caption,
    isLoading: false,
    addedEmoji: false,
    isModalEditing: false,
  });
  const badWordsFilter = new Filter();
  const oneCard = useMediaQuery("(max-width: 900px)");
  const twoCards = useMediaQuery("(max-width: 1200px)");
  const allPosts = !!posts?.userPost
    ? [posts.userPost, ...posts.feedPosts]
    : posts?.feedPosts || [];
  const formattedDate = dayjs(feedFilter.date).format("MMMM D, YYYY");
  const [filterOpened, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);
  const [selectSongOpened, { close: closeSelectSong }] = useDisclosure(
    !todayPosts?.userPost
  );

  const setUserPost = (post) =>
    setPosts({
      ...posts,
      userPost: post,
    });
  const setFeedPost = (post) =>
    setPosts({
      ...posts,
      feedPosts: posts.feedPosts.map((p) => (p._id === post._id ? post : p)),
    });

  return (
    <>
      <SelectSongModal
        opened={selectSongOpened}
        close={closeSelectSong}
        spotifyData={spotifyData}
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
        session={session}
        setPost={setUserPost}
        caption={caption}
        setCaption={setCaption}
        badWordsFilter={badWordsFilter}
      />
      <FilterModal
        opened={filterOpened}
        close={closeFilter}
        feedFilter={feedFilter}
        setFeedFilter={setFeedFilter}
        posts={posts}
        setPosts={setPosts}
        formattedDate={formattedDate}
        session={session}
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
          w={"100%"}
          h="100%"
          justify={"center"}
          align={"center"}
          style={{
            transform: "translateY(5rem)",
          }}
          direction={"column"}
          mt={"2.25rem"}
        >
          <Flex
            w="100%"
            justify={"center"}
            align={"center"}
            gap={".5rem"}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              transform: "translateY(1.5rem)",
            }}
          >
            <Button
              variant="light"
              color="gray"
              size="sm"
              onClick={openFilter}
              fw={"bold"}
              mb={"2.15rem"}
            >
              {feedFilter.type} on {formattedDate}
            </Button>
          </Flex>
          {allPosts.length > 0 ? (
            <ScrollArea
              type="always"
              w={oneCard ? "350px" : twoCards ? "700px" : "1050px"}
              h={"565px"}
              style={{
                transform: "translateY(2.8rem)",
              }}
              styles={{
                scrollbar: {
                  "&, &:hover": {
                    backgroundColor: "transparent",
                    borderRadius: "0.5rem",
                  },
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: "#474952",
                  },
                },
                corner: {
                  display: "none",
                },
              }}
            >
              <Flex
                justify={"center"}
                align={"center"}
                w={"100%"}
                h={"100%"}
                wrap={"wrap"}
                gap="1.5rem"
              >
                {allPosts?.map((post) => {
                  const isUser = post?.username === session?.user?.name;
                  return (
                    <Post
                      key={post._id}
                      isUser={isUser}
                      post={post}
                      setPost={isUser ? setUserPost : setFeedPost}
                      currentlyPlaying={currentlyPlaying}
                      setCurrentlyPlaying={setCurrentlyPlaying}
                      session={session}
                      caption={caption}
                      setCaption={setCaption}
                      badWordsFilter={badWordsFilter}
                    />
                  );
                })}
              </Flex>
            </ScrollArea>
          ) : (
            <Text fz={"lg"}>{`No posts 
            for ${feedFilter.type} on
            ${formattedDate}
            `}</Text>
          )}
        </Flex>
      </Flex>
    </>
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
    const { startDate, endDate } = getDayInterval(dayjs());
    const todayPosts = await client.fetch(postsQuery, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      name: session?.user?.name,
    });

    if (!!todayPosts.userPost) {
      return {
        props: {
          todayPosts,
        },
      };
    }

    const spotifyData = await fetchSpotify(session?.user?.access_token);

    if (!spotifyData?.length) {
      clearAuthCookies(res);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        todayPosts,
        spotifyData,
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

export default Home;
