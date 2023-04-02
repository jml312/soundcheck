import {
  Flex,
  Avatar,
  Tabs,
  Text,
  Title,
  Group,
  Button,
  ActionIcon,
  Stack,
  Space,
  Tooltip,
  ScrollArea,
  Anchor,
  Modal,
  UnstyledButton,
} from "@mantine/core";
import { followUser } from "@/actions";
import dayjs from "dayjs";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { BsSpotify, BsHeadphones } from "react-icons/bs";
import Post from "../Post/Post";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

import { Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Profile({ isUser, profile }) {
  const {
    _id,
    name,
    image,
    createdAt,
    postStreak,
    likes,
    posts,
    followers,
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
              acc.artists.push({ name: artist, count: 1 });
            } else {
              acc.artists[artistIndex].count++;
            }
          });
          genres.forEach((genre) => {
            const genreIndex = acc.genres.findIndex(
              (item) => item.name === genre
            );
            if (genreIndex === -1) {
              acc.genres.push({ name: genre, count: 1 });
            } else {
              acc.genres[genreIndex].count++;
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

  const numFollowers = followers?.length;
  const numFollowing = following?.length;
  const numPosts = posts.length;
  const numLikes = likes.length;
  const [activePost, setActivePost] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { data: session } = useSession();

  const [isFollowing, setIsFollowing] = useState(
    followers?.includes(session?.user?.id)
  );

  const [followersOpened, { open: openFollowers, close: closeFollowers }] =
    useDisclosure(false);
  const [followingOpened, { open: openFollowing, close: closeFollowing }] =
    useDisclosure(false);

  const BODY_WIDTH = "87.5%";
  const BODY_MAX_WIDTH = "925px";
  // const BODY_MAX_WIDTH = "1000px";
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
        pb={12}
        style={{
          borderBottom: "1px solid #c0c1c4",
          flexGrow: 0,
          // flexBasis: "25%",
        }}
      >
        <Group spacing={10}>
          <Avatar
            size={40}
            src={image}
            alt={`${name}'s profile`}
            radius={"50%"}
            style={{
              outline: "1px solid #c0c1c4",
              transform: "translateY(.225rem)",
            }}
          />
          <Stack spacing={0}>
            <Group spacing={8} align={"end"}>
              <Text fz="sm">{name}</Text>
              <Tooltip
                offset={isUser ? 6 : -2}
                withinPortal
                position="right"
                label={
                  isUser
                    ? "your soundcheck playlist"
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"
                }
                color="dark.7"
                styles={{
                  tooltip: {
                    border: "none",
                    outline: "1px solid rgba(192, 193, 196, 0.75)",
                  },
                }}
              >
                {isUser ? (
                  <Anchor
                    href={`https://open.spotify.com/playlist/${playlistID}`}
                    target="_blank"
                    fontSize={"1.6rem"}
                    sx={(theme) => ({
                      cursor: "pointer !important",
                      // color: theme.colors.spotify[8],
                      transform: "translateX(-.15rem) translateY(.12rem)",
                    })}
                  >
                    <BsHeadphones />
                    {/* <BsSpotify /> */}
                  </Anchor>
                ) : (
                  <ActionIcon
                    sx={(theme) => ({
                      // transform: "translateX(.1rem)",
                      transform: "translateX(-.3rem) translateY(.12rem)",
                      color: isFollowing ? theme.colors.green[6] : "#c1c2c5",
                      "&[data-disabled]": {
                        color: isFollowing ? theme.colors.green[6] : "#c1c2c5",
                      },
                    })}
                    variant={"transparent"}
                    radius="xl"
                    // onClick={() =>
                    //   followUser({
                    //     isFollowing: post?.isFollowing,
                    //     setIsFollowLoading,
                    //     post,
                    //     setPost,
                    //     session,
                    //   })
                    // }
                  >
                    {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                  </ActionIcon>
                )}
              </Tooltip>
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
        my={20}
        justify="space-evenly"
        // justify="center"
        // gap={"2.5rem"}
        // style={{ flexGrow: 0 }}
        style={{
          // flexBasis: "25%",
          flexGrow: 0,
        }}
      >
        <Modal
          opened={followersOpened}
          onClose={closeFollowers}
          title={"Followers"}
          centered
        >
          {followers?.map((user) => (
            <Text key={user._id} fz="sm">
              {user._ref}
            </Text>
          ))}
        </Modal>
        <Group>
          <UnstyledButton
            title="View Followers"
            disabled={numFollowers === 0}
            onClick={openFollowers}
            p={10}
            style={{
              // borderBottom: `.5px solid ${
              //   numFollowers === 0 ? "#919397" : "rgba(255, 255, 255, 0.95)"
              // }`,
              // border: "1px solid #c0c1c4",
              // borderRadius: ".5rem",
              color:
                numFollowers === 0 ? "#919397" : "rgba(255, 255, 255, 0.95)",
              cursor: numFollowers === 0 ? "default" : "pointer",
              fontSize: "1.05rem",
              fontWeight: numFollowers === 0 ? 300 : 500,
            }}
          >
            {numFollowers} Follower{numFollowers === 1 ? "" : "s"}
          </UnstyledButton>
        </Group>
        <Modal
          opened={followingOpened}
          onClose={closeFollowing}
          title={"Following"}
          centered
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
                  // backgroundColor: theme.colors.dark[5],
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
                  }}
                  size={24}
                />
                <Text color="white" fz={"0.95rem"}>
                  {user.username}
                </Text>
              </Flex>
            </Link>
          ))}
        </Modal>
        <Group>
          <UnstyledButton
            title="View Following"
            disabled={numFollowing === 0}
            onClick={openFollowing}
            p={10}
            style={{
              // borderBottom: `.5px solid ${
              //   numFollowing === 0 ? "#919397" : "rgba(255, 255, 255, 0.95)"
              // }`,
              // border: "1px solid #c0c1c4",
              // borderRadius: ".5rem",
              color:
                numFollowing === 0 ? "#919397" : "rgba(255, 255, 255, 0.95)",
              cursor: numFollowing === 0 ? "default" : "pointer",
              fontSize: "1.05rem",
              fontWeight: numFollowing === 0 ? 300 : 500,
            }}
          >
            {numFollowing} Following
          </UnstyledButton>
        </Group>
      </Flex>

      <Tabs
        w={BODY_WIDTH}
        maw={BODY_MAX_WIDTH}
        style={{
          // transform: "translateY(1rem)",
          // flexGrow: 2,
          // flexBasis: "50%",
          flexGrow: 2,
        }}
        defaultValue="posts"
        // variant="pills"
        // bg="red"
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

        <Tabs.Panel value="posts" mb="4rem">
          {posts.length === 0 ? (
            <Flex
              justify="center"
              align="center"
              w="100%"
              // h="100%"
              h="58vh"
            >
              <Text fz="lg" color="#c0c1c4">
                No posts yet...
              </Text>
            </Flex>
          ) : (
            <Stack>
              <ScrollArea
                offsetScrollbars
                mt="1.5rem"
                type="always"
                // w={getScrollAreaWidth()}
                // h={"565px"}
                h="58vh"
                // mt={isMobile && "1.5rem"}
                // mb={isMobile && "1rem"}
                style={
                  {
                    // transform: !isMobile && "translateY(2.8rem)",
                  }
                }
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
                  // mt={"2rem"}
                >
                  {posts.map((post) => (
                    <Post
                      key={post._id}
                      post={post}
                      activePost={activePost}
                      setActivePost={setActivePost}
                      currentlyPlaying={currentlyPlaying}
                      setCurrentlyPlaying={setCurrentlyPlaying}
                      isDiscover
                    />
                  ))}
                </Flex>
              </ScrollArea>
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="likes" mb="4rem">
          {likes.length === 0 ? (
            <Flex
              justify="center"
              align="center"
              w="100%"
              h="58vh"
              // h="100%"
              // style={{ flexGrow: 1 }}
              // bg="green"
            >
              <Text fz="lg" color="#c0c1c4">
                No likes yet...
              </Text>
            </Flex>
          ) : (
            <Stack>
              <ScrollArea
                offsetScrollbars
                mt="1.5rem"
                type="always"
                // w={getScrollAreaWidth()}
                // h={"565px"}
                h="58vh"
                // mt={isMobile && "1.5rem"}
                // mb={isMobile && "1rem"}
                style={
                  {
                    // transform: !isMobile && "translateY(2.8rem)",
                  }
                }
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
                  {likes.map((post) => (
                    <Post
                      key={post._id}
                      post={post}
                      activePost={activePost}
                      setActivePost={setActivePost}
                      currentlyPlaying={currentlyPlaying}
                      setCurrentlyPlaying={setCurrentlyPlaying}
                      isDiscover
                    />
                  ))}
                </Flex>
              </ScrollArea>
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="stats" mb="4rem">
          {/* stats:
          {artists.map((artist) => (
            <Text key={artist.name}>
              {artist.name} - {artist.count}
            </Text>
          ))}
          <hr />
          genres:
          {genres.map((genre) => (
            <Text key={genre.name}>
              {genre.name} - {genre.count}
            </Text>
          ))} */}
          {/* stats graphs go here */}
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
