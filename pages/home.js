import { getSession, useSession } from "next-auth/react";
import { fetchSpotify } from "@/utils/fetchSpotify";
import { clearAuthCookies } from "@/utils/clearAuthCookies";
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
} from "@mantine/core";
import { MdOutlineDateRange } from "react-icons/md";
import { DatePickerInput } from "@mantine/dates";
import { VscDebugRestart } from "react-icons/vsc";
import { START_DATE } from "@/constants";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getPosts } from "@/actions";

function Home({ spotifyData, isRouteLoading }) {
  const router = useRouter();
  const { date } = router.query;
  const { data: session } = useSession();
  const { data: currentPosts, isLoading } = useQuery({
    queryKey: ["posts", dayjs(date).format("YYYY-MM-DD")],
    queryFn: () =>
      getPosts({
        isClient: true,
        date: dayjs(date),
        name: session?.user?.name,
      }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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
    text: posts.userPost?.caption || "",
    originalText: posts.userPost?.caption || "",
    error: "",
    isEditing: isToday && !posts.userPost?.caption,
    isModalEditing: isToday && !posts.userPost?.caption,
    isLoading: false,
    addedEmoji: false,
  });
  const allPosts = !!posts?.userPost
    ? [posts.userPost, ...posts.feedPosts]
    : posts?.feedPosts || [];
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const [selectSongOpened, { close: closeSelectSong, open: openSelectSong }] =
    useDisclosure(
      typeof currentPosts?.hasPostedToday === "boolean" &&
        !currentPosts?.hasPostedToday
    );
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const badWordsFilter = new Filter();
  const oneCard = useMediaQuery("(max-width: 900px)");
  const twoCards = useMediaQuery("(max-width: 1200px)");

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
    setCaption({
      text: currentPosts?.userPost?.caption || "",
      originalText: currentPosts?.userPost?.caption || "",
      error: "",
      isEditing: isToday && !currentPosts?.userPost?.caption,
      isModalEditing: isToday && !posts.userPost?.caption,
      isLoading: false,
      addedEmoji: false,
    });
    setPosts({
      feedPosts: currentPosts?.feedPosts,
      userPost: currentPosts?.userPost,
      hasPostedToday: currentPosts?.hasPostedToday,
    });
  }, [currentPosts]);

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
            gap="0.75rem"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              transform: "translateY(1.5rem)",
            }}
          >
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
                  `/home?date=${dayjs(newDate).format("YYYY-MM-DD")}`,
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
                  ".mantine-DatePickerInput-day[data-weekend][data-selected]": {
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
                        `/home?date=${dayjs().format("YYYY-MM-DD")}`,
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
          </Flex>
          {(isRouteLoading && !isLoading) || isLoading ? (
            <Loader size="xl" />
          ) : allPosts.length > 0 ? (
            <ScrollArea
              type="always"
              w={oneCard ? "354px" : twoCards ? "700px" : "1050px"}
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
                // align={"stretch"}
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
                      isLoading={isLoading}
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
            <Text fz={"lg"} fw={"bold"}>{`No posts on ${formattedDate}`}</Text>
          )}
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
          destination: `/home?date=${dayjs().format("YYYY-MM-DD")}`,
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
          date: currentDate,
          name: session?.user?.name,
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

    const spotifyData = await fetchSpotify(session);

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
        destination: `/home?date=${dayjs().format("YYYY-MM-DD")}`,
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

export default Home;
