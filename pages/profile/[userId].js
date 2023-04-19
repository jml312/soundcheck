import { getSession } from "next-auth/react";
import { clearAuthCookies, getDayInterval } from "@/utils";
import client from "@/lib/sanity";
import { hasPostedTodayQuery, profileQuery } from "@/lib/queries";
import Profile from "@/components/Profile";
import { NextSeo } from "next-seo";
import DefaultSEO from "seo";

function UserProfile({ profile }) {
  const displayName = profile.name.endsWith("s")
    ? `${profile.name}'`
    : `${profile.name}'s`;
  return (
    <>
      <NextSeo
        {...{
          ...DefaultSEO,
          title: `${displayName} profile | Soundcheck!`,
          canonical: `${process.env.NEXT_PUBLIC_URL}/profile/${profile.name}`,
          openGraph: {
            ...DefaultSEO.openGraph,
            title: `${displayName} Profile | Soundcheck!`,
            url: `${process.env.NEXT_PUBLIC_URL}/profile/${profile.name}`,
          },
        }}
      />

      <Profile profile={profile} />
    </>
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

  const { startDate: todayStart, endDate: todayEnd } = getDayInterval();
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

  const hasNotification = profile.notifications.some(
    (notification) =>
      notification.type === "follow" && notification.user._ref === profileUserId
  );
  if (hasNotification) {
    await client
      .patch(session.user.id)
      .unset([
        `notifications[type == \"follow\" && user._ref == \"${profileUserId}\"]`,
      ])
      .commit();
  }

  return {
    props: { profile },
  };
}

export default UserProfile;
