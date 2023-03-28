import { getSession } from "next-auth/react";
import { clearAuthCookies, getDayInterval } from "@/utils";
import client from "@/lib/sanity";
import { hasPostedTodayQuery, profileQuery } from "@/lib/queries";
import Profile from "@/components/Profile";
import dayjs from "dayjs";

function UserProfile({ profile }) {
  return <Profile profile={profile} />;
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

  await client
    .patch(session.user.id)
    .unset([
      `notifications[type == \"follow\" && user._ref == \"${profileUserId}\"]`,
    ])
    .commit();

  const genres = new Set();
  const artists = new Set();
  profile.stats.forEach((stat) => {
    stat.genres.forEach((genre) => genres.add(genre));
    stat.artists.forEach((artist) => artists.add(artist.name));
  });

  return {
    props: {
      profile: {
        ...profile,
        stats: {
          genres: [...genres],
          artists: [...artists],
        },
      },
    },
  };
}

export default UserProfile;
