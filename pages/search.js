import { getSession } from "next-auth/react";
import {
  Flex,
  ScrollArea,
  Title,
  Text,
  Stack,
  TextInput,
  Avatar,
  useMantineTheme,
} from "@mantine/core";
import client from "@/lib/sanity";
import { clearAuthCookies, getAvatarText, getDayInterval } from "@/utils";
import { searchQuery, hasPostedTodayQuery } from "@/lib/queries";
import Fuse from "fuse.js";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
import SEO from "seo";

export default function Search({ allUsers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const inputRef = useRef(null);
  const noSearchTerm = searchTerm === "";
  const noResults = filteredUsers.length === 0;
  const theme = useMantineTheme();

  const fuse = new Fuse(allUsers, {
    threshold: 0.35,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    shouldSort: true,
    includeScore: true,
    keys: ["username"],
  });

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  }, []);

  return (
    <>
      <NextSeo
        {...{
          ...SEO,
          title: "Search | Soundcheck!",
          canonical: `${process.env.NEXT_PUBLIC_URL}/search`,
          openGraph: {
            ...SEO.openGraph,
            title: "Search | Soundcheck!",
            url: `${process.env.NEXT_PUBLIC_URL}/search`,
          },
        }}
      />

      <Flex
        justify={"center"}
        align={"center"}
        direction={"column"}
        h={"calc(100vh - 5rem)"}
        w={"100%"}
        style={{
          transform: "translateY(5rem)",
          overflow: "hidden",
        }}
      >
        <Title order={2}>Search</Title>
        <Stack align="start" w="280px">
          <TextInput
            icon={<AiOutlineSearch />}
            ref={inputRef}
            mt={"1rem"}
            w="100%"
            placeholder="Search by username"
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              const results = fuse.search(value);
              setFilteredUsers(results.map((r) => r.item));
            }}
            styles={{
              input: {
                transition: "none",
                backgroundColor: theme.colors.contrast[theme.colorScheme],
                border: `1px solid ${theme.colors.border[theme.colorScheme]}`,
                "&::placeholder": {
                  color: theme.colors.dimmed[theme.colorScheme],
                },
                "&:focus": {
                  border: `1px solid ${theme.colors.spotify.main}`,
                },
              },
              icon: {
                color: theme.colors.pure[theme.colorScheme],
              },
            }}
          />
          <ScrollArea
            w={"100%"}
            h={"calc(100vh - 14.5rem)"}
            offsetScrollbars={false}
          >
            <Stack align={"start"} gap="1.5rem" w={"100%"}>
              {noSearchTerm ? (
                <Text
                  style={{
                    placeSelf: "center",
                  }}
                >
                  ...
                </Text>
              ) : noResults ? (
                <Text
                  style={{
                    placeSelf: "center",
                  }}
                >
                  No users found
                </Text>
              ) : (
                filteredUsers.map(({ username, userId, userImage }) => (
                  <Link href={`/profile/${userId}`} passHref key={userId}>
                    <Flex
                      w={"260px"}
                      justify="start"
                      align="center"
                      p="0.5rem 0.5rem 0.5rem .7rem"
                      gap="0.65rem"
                      sx={{
                        borderRadius: "0.5rem !important",
                        transition: "all 0.1s ease-in-out",
                        "&:hover": {
                          backgroundColor:
                            theme.colors.itemHover[theme.colorScheme],
                        },
                      }}
                    >
                      <Avatar src={userImage} alt={username} size={24}>
                        {getAvatarText(username)}
                      </Avatar>
                      <Text fz={"0.95rem"} truncate>
                        {username}
                      </Text>
                    </Flex>
                  </Link>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Stack>
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
    const { startDate: todayStart, endDate: todayEnd } = getDayInterval(
      dayjs()
    );
    const hasPostedToday = await client.fetch(hasPostedTodayQuery, {
      userId: session.user.id,
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
    });

    if (!hasPostedToday) {
      return {
        redirect: {
          destination: "/feed",
          permanent: false,
        },
      };
    }

    const allUsers = await client.fetch(searchQuery, {
      userId: session.user.id,
    });

    return {
      props: {
        allUsers,
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
