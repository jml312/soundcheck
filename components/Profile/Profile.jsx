import {
  Flex,
  Avatar,
  Tabs,
  Text,
  Group,
  ActionIcon,
  Stack,
  Tooltip,
  ScrollArea,
  Anchor,
  Button,
  useMantineTheme,
  SegmentedControl,
  Center,
} from "@mantine/core";
import { followUser } from "@/actions";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useState, useMemo, useEffect } from "react";
import { BsSpotify, BsHeadphones, BsFillCloudsFill } from "react-icons/bs";
import Post from "../Post";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import FollowListModal from "../modals/FollowListModal";
import { getAvatarText, formatStats, getTZDate } from "@/utils";
import WordCloud from "./WordCloud";

/**
 * @param {object} profile - The profile object
 * @param {boolean} isUser - Whether the profile is the user's
 * @description A profile component
 */
export default function Profile({ isUser, profile }) {
  const {
    _id,
    name,
    image,
    createdAt,
    postStreak,
    likes,
    posts,
    followers: followersProp,
    following,
    stats,
    playlistID,
  } = profile;

  const [selectedTab, setSelectedTab] = useState("posts");
  const [cloudsTransition, setCloudsTransition] = useState(0);
  const [artists, albums, genres] = useMemo(
    () => formatStats({ stats, keys: ["artists", "album", "genres"] }),
    []
  );
  const [selectedStat, setSelectedStat] = useState("artists");
  const statData = useMemo(() => {
    switch (selectedStat) {
      case "artists":
        return artists;
      case "albums":
        return albums;
      case "genres":
        return genres;
    }
  }, [selectedStat, artists, albums, genres]);
  const theme = useMantineTheme();
  const isSmall = useMediaQuery("(max-width: 470px)");
  const BODY_WIDTH = "87.5%";
  const BODY_MAX_WIDTH = "1050px";
  const TAB_VIEWPORT_HEIGHT = !isSmall ? "479px" : "475px";
  const TAB_MARGIN_TOP = "1.4rem";
  const { data: session } = useSession();
  const [activePost, setActivePost] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isFollowing, setIsFollowing] = useState(
    !!followersProp.find((follower) => follower.userId === session?.user?.id)
  );
  const [followers, setFollowers] = useState(followersProp || []);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followersOpened, { open: openFollowers, close: closeFollowers }] =
    useDisclosure(false);
  const [followingOpened, { open: openFollowing, close: closeFollowing }] =
    useDisclosure(false);
  const numFollowers = followers?.length;
  const numFollowing = following?.length;

  useEffect(() => {
    if (selectedTab === "clouds") {
      setTimeout(() => setCloudsTransition(200), 200);
    } else {
      setCloudsTransition(0);
    }
  }, [selectedTab]);

  return (
    <Flex
      align={"center"}
      justify={"space-between"}
      direction={"column"}
      h={"calc(100vh - 5rem)"}
      gap={40}
      style={{
        transform: "translateY(5rem)",
        overflow: "hidden",
      }}
    >
      <Flex
        justify={"space-between"}
        align={"end"}
        w={BODY_WIDTH}
        maw={BODY_MAX_WIDTH}
        gap={10}
        mt={30}
        pb={11}
        style={{
          borderBottom: `1px solid ${theme.colors.border[theme.colorScheme]}`,
          flexGrow: 0,
        }}
      >
        <Group spacing={10}>
          <Avatar
            size={32}
            src={image}
            style={{
              transform: "translateY(.225rem)",
            }}
          >
            {getAvatarText(name)}
          </Avatar>
          <Stack spacing={0}>
            <Group
              spacing={8}
              align={"end"}
              style={{
                transform: "translateY(.05rem)",
              }}
            >
              <Text fz="sm">{name}</Text>
              {isUser ? (
                <Tooltip
                  offset={6}
                  withinPortal
                  position="right"
                  disabled={isFollowLoading}
                  label={"soundcheck playlist"}
                >
                  <Anchor
                    href={`https://open.spotify.com/playlist/${playlistID}`}
                    target="_blank"
                    fontSize={"1.6rem"}
                    sx={{
                      cursor: "pointer !important",
                      color: theme.colors.spotify.main,
                      transform: "translateX(-.15rem) translateY(.12rem)",
                    }}
                  >
                    <BsSpotify />
                  </Anchor>
                </Tooltip>
              ) : isFollowLoading ? (
                <ActionIcon
                  sx={{
                    transform: "translateX(-.375rem) translateY(.12rem)",
                    color: theme.colors.iconDisabled[theme.colorScheme],
                  }}
                  disabled
                  variant={"transparent"}
                  radius="xl"
                >
                  {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                </ActionIcon>
              ) : (
                <Tooltip
                  offset={-2}
                  withinPortal
                  position="right"
                  disabled={isFollowLoading}
                  label={isFollowing ? "unfollow" : "follow"}
                >
                  <ActionIcon
                    sx={{
                      transform: "translateX(-.375rem) translateY(.12rem)",
                      "&:active": {
                        transform: "translateX(-.375rem) translateY(.2rem)",
                      },
                      color: isFollowing
                        ? theme.colors.green[
                            theme.colorScheme === "dark" ? 5 : 7
                          ]
                        : theme.colors.iconDisabled[theme.colorScheme],
                      "&[data-disabled]": {
                        color: isFollowing
                          ? theme.colors.green[
                              theme.colorScheme === "dark" ? 5 : 7
                            ]
                          : theme.colors.iconDisabled[theme.colorScheme],
                      },
                    }}
                    disabled={isFollowLoading}
                    variant={"transparent"}
                    radius="xl"
                    onClick={() =>
                      followUser({
                        session,
                        toFollowId: _id,
                        isFollowing,
                        setIsFollowing,
                        setIsFollowLoading,
                        setFollowers,
                      })
                    }
                  >
                    {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
            <Text fz="xs">{getTZDate(createdAt).format("MMM D, YYYY")}</Text>
          </Stack>
        </Group>
        <Text fz={isSmall ? "md" : "lg"}>🔥 {postStreak} day streak</Text>
      </Flex>

      <Flex
        w={BODY_WIDTH}
        maw={"450px"}
        my={10}
        justify="space-evenly"
        style={{
          flexGrow: 0,
          transform: isSmall ? "translateY(-.6rem)" : "translateY(1rem)",
        }}
      >
        {/* followers */}
        <FollowListModal
          opened={followersOpened}
          close={closeFollowers}
          title={"Followers"}
          data={followers}
        />
        <Group>
          <Button
            size="md"
            variant="light"
            color="gray"
            title={numFollowers > 0 ? "View Followers" : ""}
            disabled={numFollowers === 0}
            onClick={openFollowers}
            p={10}
            sx={{
              backgroundColor:
                theme.colors.lightBtn.bg.abled[theme.colorScheme],
              color:
                numFollowers === 0
                  ? theme.colors.lightBtn.color.base[theme.colorScheme]
                  : theme.colors.lightBtn.color.multiple[theme.colorScheme],
              cursor: numFollowers === 0 ? "default" : "pointer",
              fontSize: "1rem",
              fontWeight: "400",
              "&:hover": {
                backgroundColor:
                  theme.colors.lightBtn.bg.hover[theme.colorScheme],
              },
              "&[data-disabled]": {
                backgroundColor: "transparent",
                color: theme.colors.lightBtn.color.base[theme.colorScheme],
              },
            }}
          >
            {numFollowers} Follower{numFollowers === 1 ? "" : "s"}
          </Button>
        </Group>

        {/* following */}
        <FollowListModal
          opened={followingOpened}
          close={closeFollowing}
          title={"Following"}
          data={following}
        />
        <Group>
          <Button
            size="md"
            variant="light"
            color="gray"
            title={numFollowing > 0 ? "View Following" : ""}
            disabled={numFollowing === 0}
            onClick={openFollowing}
            p={10}
            sx={{
              backgroundColor:
                theme.colors.lightBtn.bg.abled[theme.colorScheme],
              color:
                numFollowing === 0
                  ? theme.colors.lightBtn.color.base[theme.colorScheme]
                  : theme.colors.lightBtn.color.multiple[theme.colorScheme],
              cursor: numFollowing === 0 ? "default" : "pointer",
              fontSize: "1rem",
              fontWeight: "400",
              "&:hover": {
                backgroundColor:
                  theme.colors.lightBtn.bg.hover[theme.colorScheme],
              },
              "&[data-disabled]": {
                backgroundColor: "transparent",
                color: theme.colors.lightBtn.color.base[theme.colorScheme],
              },
            }}
          >
            {numFollowing} Following
          </Button>
        </Group>
      </Flex>

      <Tabs
        w={BODY_WIDTH}
        maw={BODY_MAX_WIDTH}
        style={{
          flexGrow: 2,
        }}
        mt={isSmall && "-2.2rem"}
        value={selectedTab}
        onTabChange={(newTab) => {
          setCurrentlyPlaying(null);
          setActivePost(null);
          setSelectedTab(newTab);
        }}
        styles={{
          tab: {
            borderBottom: `2px solid ${
              theme.colorScheme === "dark" ? "#373A40" : "#c8c5bf"
            }`,
            "&[data-active]": {
              borderBottom: `2px solid ${theme.colors.spotify.main}`,
              "&:hover": {
                borderBottom: `2px solid ${theme.colors.spotify.main}`,
              },
            },
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark" ? "#25262b" : "#dad9d4",
              borderBottom: `2px solid ${
                theme.colorScheme === "dark" ? "#373A40" : "#c8c5bf"
              }`,
            },
          },
        }}
      >
        <Tabs.List grow>
          <Tabs.Tab label="Posts" value="posts" icon={<BsHeadphones />}>
            <Text>Posts</Text>
          </Tabs.Tab>
          <Tabs.Tab label="Likes" value="likes" icon={<AiFillHeart />}>
            <Text>Likes</Text>
          </Tabs.Tab>
          <Tabs.Tab label="Clouds" value="clouds" icon={<BsFillCloudsFill />}>
            <Text>Clouds</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts">
          <Stack>
            <ScrollArea
              mt={TAB_MARGIN_TOP}
              w="104%"
              maw={BODY_MAX_WIDTH}
              h={TAB_VIEWPORT_HEIGHT}
              styles={{
                viewport: {
                  paddingBottom: "1.075rem",
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
                {posts?.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    activePost={activePost}
                    setActivePost={setActivePost}
                    currentlyPlaying={currentlyPlaying}
                    setCurrentlyPlaying={setCurrentlyPlaying}
                    isProfile
                    isUser
                    isSmall={isSmall}
                  />
                ))}
              </Flex>
            </ScrollArea>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="likes">
          {likes.length === 0 ? (
            <Flex
              justify="center"
              align="center"
              w="100%"
              mt={TAB_MARGIN_TOP}
              h={TAB_VIEWPORT_HEIGHT}
            >
              <Text fz="lg">No likes yet...</Text>
            </Flex>
          ) : (
            <Stack>
              <ScrollArea
                mt={TAB_MARGIN_TOP}
                w="104%"
                maw={BODY_MAX_WIDTH}
                h={TAB_VIEWPORT_HEIGHT}
                styles={{
                  viewport: {
                    paddingBottom: "1.075rem",
                  },
                }}
              >
                <Flex
                  justify={"center"}
                  align={"end"}
                  w={"100%"}
                  h={"100%"}
                  gap="1.5rem"
                >
                  {likes?.map((post) => (
                    <Post
                      key={post._id}
                      post={post}
                      activePost={activePost}
                      setActivePost={setActivePost}
                      currentlyPlaying={currentlyPlaying}
                      setCurrentlyPlaying={setCurrentlyPlaying}
                      isProfile
                      isSmall={isSmall}
                    />
                  ))}
                </Flex>
              </ScrollArea>
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="clouds">
          <Stack
            h={TAB_VIEWPORT_HEIGHT}
            mt={TAB_MARGIN_TOP}
            maw={BODY_MAX_WIDTH}
            align="center"
            justify="space-between"
          >
            <Center w={"100%"} h={"100%"}>
              <WordCloud data={statData} theme={theme} isSmall={isSmall} />
            </Center>
            <SegmentedControl
              w="100%"
              value={selectedStat}
              onChange={setSelectedStat}
              data={[
                { label: "Artists", value: "artists" },
                { label: "Albums", value: "albums" },
                { label: "Genres", value: "genres" },
              ]}
              transitionDuration={cloudsTransition}
              size="md"
              styles={{
                root: {
                  transform: "translateY(-1rem)",
                },
              }}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
