import { getSession, useSession } from "next-auth/react";
import { clearAuthCookies } from "@/utils";
import Post from "@/components/Post/Post";
import { useDisclosure, useMediaQuery, useDidUpdate } from "@mantine/hooks";
import dayjs from "dayjs";
import SelectSongModal from "@/components/modals/SelectSongModal";
import Filter from "bad-words";
import { Flex, Text, ScrollArea, Stack, SegmentedControl } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import client from "@/lib/sanity";
import { allUsersQuery } from "@/lib/queries";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getPosts, getSpotify } from "@/actions";

function Feed({ spotifyData, allUsers }) {
  const { data: session } = useSession();
  const [postType, setPostType] = useState("everyone");
  const [posts, setPosts] = useState();
  const { data: currentPosts } = useQuery({
    queryKey: ["feed", dayjs().format("YYYY-MM-DD")],
    queryFn: () =>
      getPosts({
        isClient: true,
        client,
        date: dayjs(),
        userId: session?.user?.id,
      }),
    onSuccess: (data) => {
      setPosts({
        feedPosts: data.feedPosts,
        userPost: data.userPost,
        hasPostedToday: data.hasPostedToday,
      });
    },
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
  const [caption, setCaption] = useState({
    text: currentPosts?.userPost?.caption || "",
    error: "",
    isFocused: false,
    addedEmoji: false,
  });
  const captionRef = useRef(null);
  const [activePost, setActivePost] = useState(null);
  const [selectSongOpened, { close: closeSelectSong, open: openSelectSong }] =
    useDisclosure(
      typeof currentPosts?.hasPostedToday === "boolean" &&
        !currentPosts?.hasPostedToday
    );
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const badWordsFilter = new Filter();
  const isSmall = useMediaQuery("(max-width: 470px)");
  const isMobile = useMediaQuery("(max-width: 769px)");
  const twoCards = useMediaQuery("(min-width: 1115px) and (max-width: 1460px)");
  const threeCards = useMediaQuery(
    "(min-width: 1460px) and (max-width: 1805px)"
  );
  const fourCards = useMediaQuery("(min-width: 1805px)");

  const getScrollAreaWidth = () => {
    if (twoCards) return "705px";
    else if (threeCards) return "1050px";
    else if (fourCards) return "1395px";
    else return "360px";
  };

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

  useEffect(() => {
    if (
      typeof currentPosts?.hasPostedToday === "boolean" &&
      !currentPosts?.hasPostedToday
    ) {
      openSelectSong();
    }
    setPosts({
      feedPosts: currentPosts?.feedPosts,
      userPost: currentPosts?.userPost,
      hasPostedToday: currentPosts?.hasPostedToday,
    });
    setCaption({
      text: currentPosts?.userPost?.caption || "",
      error: "",
      isFocused: false,
      addedEmoji: false,
    });
  }, [currentPosts]);

  useDidUpdate(() => {
    const updatedOriginalPosts = currentPosts?.feedPosts?.map((post) => {
      const foundPost = posts?.feedPosts?.find((p) => p._id === post._id);
      if (foundPost) {
        return {
          ...post,
          isFollowing: foundPost.isFollowing,
          numFollowers: foundPost.numFollowers,
        };
      }
      return post;
    });
    setPosts({
      ...posts,
      feedPosts:
        postType === "everyone"
          ? updatedOriginalPosts
          : posts?.feedPosts?.filter((post) => post.isFollowing),
    });
  }, [postType]);

  useDidUpdate(() => {
    if (postType === "following") {
      setPosts({
        ...posts,
        feedPosts: posts?.feedPosts?.filter((post) => post.isFollowing),
      });
    }
  }, [posts]);

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
        activePost={activePost}
        setActivePost={setActivePost}
        captionRef={captionRef}
        isSmall={isSmall}
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
          style={{
            transform: isMobile ? "translateY(8rem)" : "translateY(5rem)",
          }}
          w="100%"
          h={isMobile ? "auto" : "100%"}
          justify={"space-between"}
          align={"center"}
          direction={isMobile ? "column-reverse" : "row"}
        >
          <Stack
            align={"center"}
            h="100%"
            justify="center"
            w={isMobile ? "100%" : "calc(100% - 375px)"}
          >
            {selectSongOpened ? (
              <Text
                fz={"lg"}
                fw={"bold"}
                style={{
                  cursor: "default",
                  transform: isMobile && "translateY(2.4rem)",
                }}
              >{`-`}</Text>
            ) : (
              <>
                <Flex
                  w={getScrollAreaWidth()}
                  justify="center"
                  align="center"
                  style={{
                    transform:
                      posts?.feedPosts?.length > 0
                        ? "translateY(2.8rem)"
                        : "translateY(0)",
                  }}
                >
                  <SegmentedControl
                    value={postType}
                    onChange={setPostType}
                    data={[
                      { label: "Everyone", value: "everyone" },
                      { label: "Following", value: "following" },
                    ]}
                  />
                </Flex>
                {/* feed posts */}
                {posts?.feedPosts?.length > 0 ? (
                  <Stack spacing={0}>
                    <ScrollArea
                      type="always"
                      w={getScrollAreaWidth()}
                      h={"565px"}
                      mt={isMobile && "1.5rem"}
                      mb={isMobile && "1rem"}
                      style={{
                        transform: !isMobile && "translateY(2.8rem)",
                      }}
                      styles={{
                        scrollbar: {
                          "&, &:hover": {
                            backgroundColor: "transparent",
                            borderRadius: "0.5rem",
                          },
                          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb':
                            {
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
                        align={"end"}
                        w={"100%"}
                        h={"100%"}
                        wrap={"wrap"}
                        gap="1.5rem"
                      >
                        {posts?.feedPosts?.map((post) => (
                          <Post
                            key={post._id}
                            post={post}
                            setPost={setFeedPost}
                            currentlyPlaying={currentlyPlaying}
                            setCurrentlyPlaying={setCurrentlyPlaying}
                            session={session}
                            caption={caption}
                            setCaption={setCaption}
                            badWordsFilter={badWordsFilter}
                            allUsers={allUsers}
                            activePost={activePost}
                            setActivePost={setActivePost}
                            isSmall={isSmall}
                          />
                        ))}
                      </Flex>
                    </ScrollArea>
                  </Stack>
                ) : (
                  <Text
                    fz={"lg"}
                    fw={"bold"}
                    style={{
                      cursor: "default",
                      transform: isMobile && "translateY(1rem)",
                    }}
                  >
                    {postType === "everyone"
                      ? "No posts yet"
                      : "No following posts yet"}
                  </Text>
                )}
              </>
            )}
          </Stack>

          {/* user post */}
          <Flex
            sx={{
              borderBottom: isMobile && "1px solid rgba(230, 236, 240, 0.5)",
              borderLeft: !isMobile && "1px solid rgba(230, 236, 240, 0.5)",
              height: "100%",
            }}
            align="center"
            justify="center"
            w={!isMobile ? "375px" : "100%"}
            pb={isMobile && "3rem"}
            mb={isMobile && "3rem"}
          >
            {selectSongOpened ? (
              <Text
                fz={"lg"}
                fw={"bold"}
                style={{
                  cursor: "default",
                  transform: isMobile && "translateY(2.4rem)",
                }}
              >{`-`}</Text>
            ) : (
              <Stack>
                <Text
                  fz={"lg"}
                  fw={"bold"}
                  align={"center"}
                  style={{
                    cursor: "default",
                  }}
                >{`Your post`}</Text>
                <Post
                  key={posts?.userPost?._id}
                  isUser
                  post={posts?.userPost}
                  setPost={setUserPost}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  session={session}
                  caption={caption}
                  setCaption={setCaption}
                  badWordsFilter={badWordsFilter}
                  allUsers={allUsers}
                  activePost={activePost}
                  setActivePost={setActivePost}
                  isSmall={isSmall}
                />
              </Stack>
            )}
          </Flex>
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
    const allUsers = await client.fetch(allUsersQuery);

    const queryClient = new QueryClient();
    const currentPosts = await queryClient.fetchQuery({
      queryKey: ["feed", dayjs().format("YYYY-MM-DD")],
      queryFn: () =>
        getPosts({
          isClient: false,
          client,
          date: dayjs(),
          userId: session?.user?.id,
        }),
    });

    if (currentPosts?.hasPostedToday) {
      return {
        props: {
          dehydratedState: dehydrate(queryClient),
          allUsers,
          spotifyData: [],
        },
      };
    }

    const spotifyData = await getSpotify({ session, client });

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
        dehydratedState: dehydrate(queryClient),
        allUsers,
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

export default Feed;
