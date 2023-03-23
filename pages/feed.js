import { getSession, useSession } from "next-auth/react";
import { clearAuthCookies, fetchSpotify } from "@/utils";
import Post from "@/components/Post";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SelectSongModal from "@/components/modals/SelectSongModal";
import Filter from "bad-words";
import { useRouter } from "next/router";
import {
  Flex,
  Text,
  ScrollArea,
  ActionIcon,
  Loader,
  Transition,
  Tooltip,
  Stack,
  Group,
  Box,
} from "@mantine/core";
import { MdOutlineDateRange } from "react-icons/md";
import { DatePickerInput } from "@mantine/dates";
import { VscDebugRestart } from "react-icons/vsc";
import { START_DATE } from "@/constants";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getPosts } from "@/actions";
import client from "@/lib/sanity";
import Rightbar from "@/components/Rightbar";

function Feed({ spotifyData, isRouteLoading }) {
  const router = useRouter();
  const { date } = router.query;
  const { data: session } = useSession();
  const {
    data: currentPosts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["posts", dayjs(date).format("YYYY-MM-DD")],
    queryFn: () =>
      getPosts({
        isClient: true,
        date: dayjs(date),
        userId: session?.user?.id,
      }),
    // refetchOnMount: false,
    // refetchOnReconnect: false,
    // refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
    retryDelay: 0,
    notifyOnChangeProps: ["data"],
  });

  const [posts, setPosts] = useState({
    feedPosts: currentPosts?.feedPosts,
    userPost: currentPosts?.userPost,
    hasPostedToday: currentPosts?.hasPostedToday,
  });
  const isToday = dayjs(date).isSame(dayjs(), "day");
  const [caption, setCaption] = useState({
    text: currentPosts?.userPost?.caption || "",
    originalText: currentPosts?.userPost?.caption || "",
    error: "",
    isEditing: isToday && !currentPosts?.userPost?.caption,
    isModalEditing: false,
    isLoading: false,
    addedEmoji: false,
  });
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const [selectSongOpened, { close: closeSelectSong, open: openSelectSong }] =
    useDisclosure(
      typeof currentPosts?.hasPostedToday === "boolean" &&
        !currentPosts?.hasPostedToday
    );
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const badWordsFilter = new Filter();
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
      originalText: currentPosts?.userPost?.caption || "",
      error: "",
      isEditing: isToday && !currentPosts?.userPost?.caption,
      isModalEditing: false,
      isLoading: false,
      addedEmoji: false,
    });
  }, [currentPosts]);

  if (isRouteLoading) {
    return (
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
          <Loader size="xl" />
        </Flex>
      </Flex>
    );
  }

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
            {/* date picker */}
            <Group w="100%" position="center">
              <DatePickerInput
                icon={<MdOutlineDateRange />}
                dropdownType="modal"
                modalProps={{
                  centered: true,
                  overlayProps: {
                    blur: 3,
                    opacity: 0.55,
                  },
                }}
                value={dayjs(date).isValid() ? dayjs(date).toDate() : null}
                onChange={(newDate) => {
                  router.push(
                    `/feed?date=${dayjs(newDate).format("YYYY-MM-DD")}`,
                    undefined,
                    { shallow: true }
                  );
                }}
                minDate={dayjs(START_DATE).toDate()}
                maxDate={dayjs().toDate()}
                styles={{
                  month: {
                    ".mantine-DatePickerInput-day[data-weekend]": {
                      color: "#c1c2c5 !important",
                    },
                    ".mantine-DatePickerInput-day[data-weekend][data-selected]":
                      {
                        color: "#ffffff !important",
                      },
                  },
                  input: {},
                }}
              />
              <Transition
                mounted={!isToday}
                transition="slide-right"
                duration={200}
                exitDuration={0}
              >
                {(styles) => (
                  <Tooltip
                    label="Reset"
                    position="right"
                    color="dark.7"
                    styles={{
                      tooltip: {
                        border: "none",
                        outline: "1px solid rgba(192, 193, 196, 0.75)",
                      },
                    }}
                  >
                    <ActionIcon
                      style={styles}
                      onClick={() => {
                        router.push(
                          `/feed?date=${dayjs().format("YYYY-MM-DD")}`,
                          undefined,
                          { shallow: true }
                        );
                      }}
                      color={"gray"}
                      variant="outline"
                    >
                      <VscDebugRestart />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Transition>
            </Group>

            {/* feed posts */}
            {posts?.feedPosts?.length > 0 ? (
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
                      isLoading={isLoading}
                      post={post}
                      setPost={setFeedPost}
                      currentlyPlaying={currentlyPlaying}
                      setCurrentlyPlaying={setCurrentlyPlaying}
                      session={session}
                      caption={caption}
                      setCaption={setCaption}
                      badWordsFilter={badWordsFilter}
                    />
                  ))}
                </Flex>
              </ScrollArea>
            ) : (
              <Text
                fz={"lg"}
                fw={"bold"}
              >{`No posts on ${formattedDate}`}</Text>
            )}

            <Box></Box>
          </Stack>

          {/* user post */}
          <Rightbar
            post={posts?.userPost}
            setPost={setUserPost}
            isLoading={isLoading}
            currentlyPlaying={currentlyPlaying}
            setCurrentlyPlaying={setCurrentlyPlaying}
            session={session}
            caption={caption}
            setCaption={setCaption}
            badWordsFilter={badWordsFilter}
            isMobile={isMobile}
          />
        </Flex>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
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
    const { date } = query;
    const currentDate = dayjs(date);

    if (
      !date ||
      !currentDate.isValid() ||
      !currentDate.isBetween(
        START_DATE,
        dayjs().format("YYYY-MM-DD"),
        "day",
        "[]"
      )
    ) {
      return {
        redirect: {
          destination: `/feed?date=${dayjs().format("YYYY-MM-DD")}`,
          permanent: false,
        },
      };
    }

    const queryClient = new QueryClient();
    const currentPosts = await queryClient.fetchQuery(
      ["posts", currentDate.format("YYYY-MM-DD")],
      () =>
        getPosts({
          isClient: false,
          client,
          date: currentDate,
          userId: session?.user?.id,
        })
    );

    if (currentPosts?.hasPostedToday) {
      return {
        props: {
          dehydratedState: dehydrate(queryClient),
          spotifyData: [],
        },
      };
    }

    const spotifyData = await fetchSpotify({ session, client });

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
        spotifyData,
      },
      redirect: !currentDate.isSame(dayjs(), "day") && {
        destination: `/feed?date=${dayjs().format("YYYY-MM-DD")}`,
        permanent: false,
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
