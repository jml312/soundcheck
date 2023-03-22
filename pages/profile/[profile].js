import { Flex } from "@mantine/core";
import { useSession, getSession } from "next-auth/react";
import { clearAuthCookies, getDayInterval } from "@/utils";
import client from "@/lib/sanity";
import { hasPostedTodayQuery } from "@/lib/queries";
import Profile from "@/components/Profile";
import dayjs from "dayjs";

function UserProfile() {
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

  const { startDate: todayStart, endDate: todayEnd } = getDayInterval(dayjs());
  const hasPostedToday = await client.fetch(hasPostedTodayQuery, {
    userId: session.user.id,
    todayStart: todayStart.toISOString(),
    todayEnd: todayEnd.toISOString(),
  });
  if (!hasPostedToday) {
    return {
      redirect: {
        destination: `/feed?date=${dayjs().format("YYYY-MM-DD")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default UserProfile;
