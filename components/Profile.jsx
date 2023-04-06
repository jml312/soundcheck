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
  Modal,
  Button,
  Box,
  Title,
} from "@mantine/core";
import { followUser } from "@/actions";
import dayjs from "dayjs";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { BsSpotify } from "react-icons/bs";
import Post from "./Post/Post";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { VictoryPie, VictoryLabel } from "victory";
import { getAvatarText } from "@/utils";

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

  const { artists, genres } = useMemo(
    () =>
      stats.reduce(
        (acc, stat) => {
          const { artists, genres } = stat;
          artists.forEach((artist) => {
            const artistIndex = acc.artists.findIndex(
              (item) => item.name === artist
            );
            if (artistIndex === -1) {
              acc.artists.push({ name: artist, value: 1 });
            } else {
              acc.artists[artistIndex].value++;
            }
          });
          genres.forEach((genre) => {
            const genreIndex = acc.genres.findIndex(
              (item) => item.name === genre
            );
            if (genreIndex === -1) {
              acc.genres.push({ name: genre, value: 1 });
            } else {
              acc.genres[genreIndex].value++;
            }
          });
          return acc;
        },
        {
          artists: [],
          genres: [],
        }
      ),
    []
  );

  const isMobile = useMediaQuery("(max-width: 769px)");
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
  const BODY_WIDTH = "87.5%";
  const BODY_MAX_WIDTH = "925px";

  return (
    <Flex
      align={"center"}
      justify={"space-between"}
      direction={"column"}
      h={"calc(100vh - 5rem)"}
      gap={40}
      style={{
        transform: "translateY(5rem)",
        userSelect: "none",
        // overflow: "hidden",
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
          borderBottom: "1px solid rgba(192, 193, 196, 0.65)",
          flexGrow: 0,
        }}
      >
        <Group spacing={10}>
          <Avatar
            size={32}
            src={image}
            radius={"50%"}
            style={{
              outline: "1px solid #c0c1c4",
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
                  label={"your soundcheck playlist"}
                  color="dark.7"
                  styles={{
                    tooltip: {
                      border: "none",
                      outline: "1px solid rgba(192, 193, 196, 0.75)",
                    },
                  }}
                >
                  <Anchor
                    href={`https://open.spotify.com/playlist/${playlistID}`}
                    target="_blank"
                    fontSize={"1.6rem"}
                    sx={(theme) => ({
                      cursor: "pointer !important",
                      color: theme.colors.spotify[8],
                      transform: "translateX(-.15rem) translateY(.12rem)",
                    })}
                  >
                    <BsSpotify />
                  </Anchor>
                </Tooltip>
              ) : isFollowLoading ? (
                <ActionIcon
                  sx={{
                    transform: "translateX(-.375rem) translateY(.12rem)",
                    color: "#b3b6b9",
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
                  color="dark.7"
                  styles={{
                    tooltip: {
                      border: "none",
                      outline: "1px solid rgba(192, 193, 196, 0.75)",
                    },
                  }}
                >
                  <ActionIcon
                    sx={(theme) => ({
                      transform: "translateX(-.375rem) translateY(.12rem)",
                      "&:active": {
                        transform: "translateX(-.375rem) translateY(.2rem)",
                      },
                      color: isFollowing ? theme.colors.green[6] : "#c1c2c5",
                      "&[data-disabled]": {
                        color: isFollowing ? theme.colors.green[6] : "#c1c2c5",
                      },
                    })}
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
            <Text fz="xs" color="#C0C0C0">
              {dayjs(createdAt).format("MMM D, YYYY")}
            </Text>
          </Stack>
        </Group>
        <Text fz="lg">🔥 {postStreak} day streak</Text>
      </Flex>

      <Flex
        w={BODY_WIDTH}
        maw={"450px"}
        my={10}
        justify="space-evenly"
        style={{
          flexGrow: 0,
        }}
      >
        <Modal
          opened={followersOpened}
          onClose={closeFollowers}
          title={"Followers"}
          centered
          className="profile-modal"
          overlayProps={{
            blur: 3,
            opacity: 0.55,
          }}
        >
          {followers.map((user) => (
            <Link
              href={`/profile/${user?.userId}`}
              passHref
              key={user.userId}
              w="100%"
              sx={{
                borderRadius: "0.5rem !important",
                transition: "all 0.1s ease-in-out",
                "&:hover": {
                  backgroundColor: "#141517",
                },
              }}
            >
              <Flex
                justify="start"
                align="center"
                p="0.5rem 0.5rem 0.5rem .7rem"
                gap="0.65rem"
              >
                <Avatar
                  src={user.userImage}
                  alt={user.username}
                  radius="xl"
                  style={{
                    outline: "1px solid #c0c1c4",
                    zIndex: -1,
                  }}
                  size={24}
                >
                  {getAvatarText(user.username)}
                </Avatar>
                <Text color="white" fz={"0.95rem"}>
                  {user.username}
                </Text>
              </Flex>
            </Link>
          ))}
        </Modal>
        <Group>
          <Button
            size="md"
            variant="light"
            color="gray"
            title={numFollowers > 0 && "View Followers"}
            disabled={numFollowers === 0}
            onClick={openFollowers}
            p={10}
            sx={{
              color:
                numFollowers === 0 ? "#919397" : "rgba(255, 255, 255, 0.95)",
              cursor: numFollowers === 0 ? "default" : "pointer",
              fontSize: "1rem",
              fontWeight: "400",
              "&[data-disabled]": {
                backgroundColor: "transparent",
                color: "#919397",
              },
            }}
          >
            {numFollowers} Follower{numFollowers === 1 ? "" : "s"}
          </Button>
        </Group>
        <Modal
          opened={followingOpened}
          onClose={closeFollowing}
          title={"Following"}
          centered
          className="profile-modal"
          overlayProps={{
            blur: 3,
            opacity: 0.55,
          }}
        >
          {following.map((user) => (
            <Link
              href={`/profile/${user?.userId}`}
              passHref
              key={user.userId}
              w="100%"
              sx={{
                borderRadius: "0.5rem !important",
                transition: "all 0.1s ease-in-out",
                "&:hover": {
                  backgroundColor: "#141517",
                },
              }}
            >
              <Flex
                justify="start"
                align="center"
                p="0.5rem 0.5rem 0.5rem .7rem"
                gap="0.65rem"
              >
                <Avatar
                  src={user.userImage}
                  alt={user.username}
                  radius="xl"
                  style={{
                    outline: "1px solid #c0c1c4",
                    zIndex: -1,
                  }}
                  size={24}
                >
                  {getAvatarText(user.username)}
                </Avatar>
                <Text color="white" fz={"0.95rem"}>
                  {user.username}
                </Text>
              </Flex>
            </Link>
          ))}
        </Modal>
        <Group>
          <Button
            size="md"
            variant="light"
            color="gray"
            title={numFollowing > 0 && "View Following"}
            disabled={numFollowing === 0}
            onClick={openFollowing}
            p={10}
            sx={{
              color:
                numFollowing === 0 ? "#919397" : "rgba(255, 255, 255, 0.95)",
              cursor: numFollowing === 0 ? "default" : "pointer",
              fontSize: "1rem",
              fontWeight: "400",
              "&[data-disabled]": {
                backgroundColor: "transparent",
                color: "#919397",
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
          transform: "translateY(-.5rem)",
        }}
        defaultValue="posts"
        onTabChange={() => {
          setCurrentlyPlaying(null);
          setActivePost(null);
        }}
      >
        <Tabs.List grow>
          <Tabs.Tab label="Posts" value="posts">
            <Text>Posts</Text>
          </Tabs.Tab>
          <Tabs.Tab label="Likes" value="likes">
            <Text>Likes</Text>
          </Tabs.Tab>
          <Tabs.Tab label="Stats" value="stats">
            <Text>Stats</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts">
          <Stack>
            <ScrollArea
              offsetScrollbars
              mt="1.25rem"
              type="always"
              w="100%"
              styles={{
                scrollbar: {
                  "&, &:hover": {
                    backgroundColor: "transparent",
                    borderRadius: "0.5rem",
                  },
                  '&[data-orientation="horizontal"]': {
                    backgroundColor: "transparent !important",
                  },
                  '&[data-orientation="horizontal"]:hover': {
                    backgroundColor: "transparent !important",
                  },
                  '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb':
                    {
                      backgroundColor: "#474952",
                    },
                },
                corner: {
                  display: "none",
                },
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
                {posts?.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    activePost={activePost}
                    setActivePost={setActivePost}
                    currentlyPlaying={currentlyPlaying}
                    setCurrentlyPlaying={setCurrentlyPlaying}
                    isProfile
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
              mt="1.25rem"
              h="435px"
            >
              <Text fz="lg" color="#c0c1c4">
                No likes yet...
              </Text>
            </Flex>
          ) : (
            <Stack>
              <ScrollArea
                offsetScrollbars
                mt="1.25rem"
                w="100%"
                type="always"
                styles={{
                  scrollbar: {
                    "&, &:hover": {
                      backgroundColor: "transparent",
                      borderRadius: "0.5rem",
                    },
                    '&[data-orientation="horizontal"]': {
                      backgroundColor: "transparent !important",
                    },
                    '&[data-orientation="horizontal"]:hover': {
                      backgroundColor: "transparent !important",
                    },
                    '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb':
                      {
                        backgroundColor: "#474952",
                      },
                  },
                  corner: {
                    display: "none",
                  },
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
                    />
                  ))}
                </Flex>
              </ScrollArea>
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="stats">
          <Flex
            direction={isMobile ? "column" : "row"}
            justify="space-between"
            align="center"
            // bg="red"
            h="435px"
            mt="1.25rem"
            w="100%"
          >
            <svg viewBox="0 0 650 650">
              <VictoryPie
                standalone={false}
                width={650}
                height={650}
                data={artists}
                x="name"
                y="value"
                innerRadius={105}
                labelRadius={175}
                // colorScale="grayscale"
                // colorScale="cool"
                colorScale="qualitative"
                style={{
                  labels: { fontSize: 15, fill: "white", fontWeight: "bold" },
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 20, fill: "white", fontWeight: "bold" }}
                x={325}
                y={325}
                text="Artists"
              />
            </svg>

            <svg viewBox="0 0 650 650">
              <VictoryPie
                standalone={false}
                width={650}
                height={650}
                data={genres}
                x="name"
                y="value"
                innerRadius={105}
                labelRadius={175}
                // colorScale="grayscale"
                // colorScale="cool"
                colorScale="qualitative"
                style={{
                  labels: { fontSize: 15, fill: "white", fontWeight: "bold" },
                }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 20, fill: "white", fontWeight: "bold" }}
                x={325}
                y={325}
                text="Genres"
              />
            </svg>
          </Flex>
          {/* <ScrollArea
            h="435px"
            mt="1.25rem"
            w="100%"
            offsetScrollbars
            type="always"
            styles={{
              scrollbar: {
                "&, &:hover": {
                  backgroundColor: "transparent",
                  borderRadius: "0.5rem",
                },
                '&[data-orientation="horizontal"]': {
                  backgroundColor: "transparent !important",
                },
                '&[data-orientation="horizontal"]:hover': {
                  backgroundColor: "transparent !important",
                },
                '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
                  backgroundColor: "#474952",
                },
              },
              corner: {
                display: "none",
              },
              viewport: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              },
            }}
          >
            <svg viewBox="0 0 650 650">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={artists}
                x="name"
                y="value"
                innerRadius={68}
                labelRadius={100}
                // colorScale="grayscale"
                // colorScale="cool"
                colorScale="qualitative"
                style={{ labels: { fontSize: 12, fill: "white" } }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 20, fill: "white" }}
                x={200}
                y={200}
                text="Artists"
              />
            </svg>

            <svg viewBox="0 0 650 650">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={genres}
                x="name"
                y="value"
                innerRadius={68}
                labelRadius={100}
                // colorScale="grayscale"
                // colorScale="cool"
                colorScale="qualitative"
                style={{ labels: { fontSize: 12, fill: "white" } }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 20, fill: "white" }}
                x={200}
                y={200}
                text="Genres"
              />
            </svg>
          </ScrollArea> */}
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
