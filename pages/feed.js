import { getSession, useSession } from "next-auth/react";
import { clearAuthCookies } from "@/utils";
import Post from "@/components/Post/Post";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import SelectSongModal from "@/components/modals/SelectSongModal";
import Filter from "bad-words";
import {
  Flex,
  Text,
  ScrollArea,
  Stack,
  SegmentedControl,
  useMantineTheme,
} from "@mantine/core";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import client from "@/lib/sanity";
import { allUsersQuery } from "@/lib/queries";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getPosts, getSpotify } from "@/actions";
import { NextSeo } from "next-seo";
import SEO from "seo";

export default function Feed({ spotifyData, allUsers, initialCurrentPosts }) {
  const { data: session } = useSession();
  const [postType, setPostType] = useState("everyone");
  const [posts, setPosts] = useState(initialCurrentPosts);
  const { data: currentPosts } = useQuery({
    queryKey: ["feed", dayjs().format("YYYY-MM-DD")],
    queryFn: () =>
      getPosts({
        isClient: true,
        client,
        date: dayjs(),
        userId: session?.user?.id,
      }),
    initialData: initialCurrentPosts,
    onSuccess: (data) => {
      setPosts(data);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
  });
  const [caption, setCaption] = useState({
    text: currentPosts?.userPost?.caption || "",
    error: "",
    isFocused: false,
    addedEmoji: false,
  });
  const captionRef = useRef(null);
  const [activePost, setActivePost] = useState(null);
  const [selectSongOpened, setSelectSongOpened] = useState(
    !currentPosts?.userPost
  );
  const [sliderTransition, setSliderTransition] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const badWordsFilter = new Filter();
  const theme = useMantineTheme();
  const isSmall = useMediaQuery("(max-width: 470px)");
  const isMobile = useMediaQuery("(max-width: 769px)");
  const twoCards = useMediaQuery("(min-width: 1115px) and (max-width: 1460px)");
  const threeCards = useMediaQuery(
    "(min-width: 1460px) and (max-width: 1805px)"
  );
  const fourCards = useMediaQuery("(min-width: 1805px)");

  const scrollAreaWidth = useMemo(() => {
    if (twoCards) return "705px";
    else if (threeCards) return "1050px";
    else if (fourCards) return "1395px";
    else return "360px";
  }, [twoCards, threeCards, fourCards]);

  const setUserPost = useCallback(
    (post) => {
      setPosts({
        ...posts,
        userPost: post,
      });
    },
    [posts]
  );
  const setFeedPost = useCallback(
    (post) => {
      setPosts({
        ...posts,
        feedPosts: posts.feedPosts.map((p) => (p._id === post._id ? post : p)),
      });
    },
    [posts]
  );

  const feedPosts = useMemo(
    () =>
      posts?.feedPosts?.filter(
        (post) => postType === "everyone" || post.isFollowing
      ) || [],
    [posts, postType]
  );

  useEffect(() => {
    setTimeout(() => setSliderTransition(200), 200);
  }, []);

  return (
    <>
      <NextSeo
        {...{
          ...SEO,
          title: "Feed | Soundcheck!",
          canonical: `${process.env.NEXT_PUBLIC_URL}/feed`,
          openGraph: {
            ...SEO.openGraph,
            title: "Feed | Soundcheck!",
            url: `${process.env.NEXT_PUBLIC_URL}/feed`,
          },
        }}
      />

      <SelectSongModal
        opened={selectSongOpened}
        close={() => {
          setSelectSongOpened(false);
          setCurrentlyPlaying(null);
        }}
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
                style={{
                  cursor: "default",
                  transform: isMobile && "translateY(2.4rem)",
                }}
              >{`...`}</Text>
            ) : (
              <>
                <Flex
                  w={scrollAreaWidth}
                  justify="center"
                  align="center"
                  style={{
                    transform: "translateY(2.8rem)",
                  }}
                >
                  <SegmentedControl
                    transitionDuration={sliderTransition}
                    onChange={(value) => {
                      setPostType(value);
                      setCurrentlyPlaying(null);
                    }}
                    data={[
                      { label: "Everyone", value: "everyone" },
                      { label: "Following", value: "following" },
                    ]}
                    styles={{
                      root: {
                        transform: isMobile
                          ? "translateY(-2rem)"
                          : "translateY(.25rem)",
                      },
                    }}
                  />
                </Flex>
                {/* feed posts */}
                {feedPosts.length > 0 ? (
                  <Stack spacing={0}>
                    <ScrollArea
                      offsetScrollbars={false}
                      w={scrollAreaWidth}
                      h={"565px"}
                      mt={isMobile && "1.5rem"}
                      mb={isMobile && "1rem"}
                      style={{
                        transform: !isMobile && "translateY(2.6rem)",
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
                        {feedPosts.map((post) => (
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
                  <Stack
                    h={"565px"}
                    mt={isMobile && "1.5rem"}
                    mb={isMobile && "1rem"}
                    style={{
                      transform: !isMobile && "translateY(2.8rem)",
                    }}
                    justify="center"
                  >
                    <Text
                      fz={"lg"}
                      style={{
                        transform: "translateY(-3.75rem)",
                      }}
                    >
                      Nothing yet...
                    </Text>
                  </Stack>
                )}
              </>
            )}
          </Stack>

          {/* user post */}
          <Flex
            sx={{
              borderBottom:
                isMobile &&
                `1px solid ${theme.colors.border[theme.colorScheme]}`,
              borderLeft:
                !isMobile &&
                `1px solid ${theme.colors.border[theme.colorScheme]}`,
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
                style={{
                  cursor: "default",
                  transform: isMobile && "translateY(2.4rem)",
                }}
              >{`...`}</Text>
            ) : (
              <Stack
                style={{
                  transform: "translateY(.75rem)",
                }}
              >
                <Text
                  fz={"lg"}
                  align={"center"}
                  style={{
                    cursor: "default",
                    transform: "translateY(-.625rem)",
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

    if (!!currentPosts?.userPost) {
      return {
        props: {
          dehydratedState: dehydrate(queryClient),
          allUsers,
          spotifyData: [],
          initialCurrentPosts: currentPosts,
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
        initialCurrentPosts: currentPosts,
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
