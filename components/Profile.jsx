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
} from "@mantine/core";
import { followUser } from "@/actions";
import dayjs from "dayjs";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { useState } from "react";

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
    // playlistID,
  } = profile;
  const numFollowers = followers.length;
  const numFollowing = following.length;
  const numPosts = posts.length;
  const numLikes = likes.length;
  const [activePost, setActivePost] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const { data: session } = useSession();

  return (
    <Flex
      // justify={"center"}
      align={"center"}
      direction={"column"}
      h={"calc(100vh - 5rem)"}
      style={{
        transform: "translateY(5rem)",
      }}
    >
      <Flex justify={"space-between"} align={"end"} w="90%" gap={10} mt={20}>
        <Group>
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
            <Text fz="lg">{name}</Text>
            <Text fz="sm" color="#C0C0C0">
              Joined {dayjs(createdAt).format("MMM YYYY")}
            </Text>
          </Stack>
        </Group>
        <Group>
          <Text fz="lg">🔥 {postStreak} days</Text>

          {!isUser && (
            <Button
              leftIcon={
                followers.includes(session?.user?.id) ? (
                  <FaUserCheck />
                ) : (
                  <FaUserPlus />
                )
              }
            >
              Follow
            </Button>
          )}
        </Group>
      </Flex>

      <Tabs
        mt={20}
        w="90%"
        style={{
          transform: "translateY(1rem)",
        }}
        defaultValue="posts"
        // variant="pills"
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
          <Flex
            // direction="column"
            w="100%"
            style={{
              transform: "translateY(1rem)",
            }}
            wrap="wrap"
            justify="center"
            // justify="space-between"
            gap={"1rem"}
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
        </Tabs.Panel>

        <Tabs.Panel value="likes" mb="4rem">
          <Flex
            // direction="column"
            w="100%"
            style={{
              transform: "translateY(1rem)",
            }}
            wrap="wrap"
            justify="center"
            // justify="space-between"
            gap={"1rem"}
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
        </Tabs.Panel>

        <Tabs.Panel value="stats" mb="4rem">
          <Text>
            Genres: {stats.genres.join(", ")}
          </Text>
          <Text>Artists: {stats.artists.join(", ")}</Text>
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
