import { Flex } from "@mantine/core";
import { useSession, getSession } from "next-auth/react";
import { clearAuthCookies, getDayInterval } from "@/utils";
import client from "@/lib/sanity";
import { hasPostedTodayQuery, profileQuery } from "@/lib/queries";
import Profile from "@/components/Profile";
import dayjs from "dayjs";

function UserProfile({ profile }) {
  const { data: session } = useSession();

  return (
    <Flex
      justify={"center"}
      align={"center"}
      direction={"column"}
      h={"calc(100vh - 5rem)"}
      style={{
        transform: "translateY(5rem)",
      }}
    >
      <Profile session={session} />
    </Flex>
  );
}

export async function getServerSideProps({ req, res, params }) {
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

  const { startDate: todayStart, endDate: todayEnd } = getDayInterval(dayjs());
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

  const { userId: profileUserId } = params;

  const profile = await client.fetch(profileQuery, {
    userId: profileUserId,
  });

  if (!profile) {
    return {
      redirect: {
        destination: "/feed",
        permanent: false,
      },
    };
  }

  // remove follow notification from user
  await client
    .patch(session.user.id)
    .unset([
      `notifications[type == \"follow\" && user._ref == \"${profileUserId}\"]`,
    ])
    .commit();

  return {
    props: { profile },
  };
}

export default UserProfile;
