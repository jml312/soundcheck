import { getSession, useSession } from "next-auth/react";
import { clearAuthCookies, getDayInterval } from "@/utils";
import client from "@/lib/sanity";
import { hasPostedTodayQuery, profileQuery } from "@/lib/queries";
import Profile from "@/components/Profile";
import { NextSeo } from "next-seo";
import DefaultSEO from "seo";
import { useEffect, useMemo, useCallback } from "react";
import { useNotifications } from "@/contexts/NotificationsContext";
import { clearNotifications } from "@/actions";

function UserProfile({ profile }) {
  const displayName = profile.name.endsWith("s")
    ? `${profile.name}'`
    : `${profile.name}'s`;

  const { data: session } = useSession();
  const { notifications, setNotifications, setIsNotificationLoading } =
    useNotifications();
  const notificationsToClear = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          notification?.user?._ref === profile._id &&
          notification?.type === "follow"
      ),
    [notifications, profile]
  );
  const clearFollowNotifications = useCallback(
    async (notificationsToClear) => {
      await clearNotifications({
        notificationIDs: notificationsToClear.map(
          (notification) => notification._key
        ),
        notifications,
        setNotifications,
        userId: session?.user?.id,
        setIsLoading: setIsNotificationLoading,
      });
    },
    [notifications, setNotifications, session, setIsNotificationLoading]
  );
  useEffect(() => {
    if (notificationsToClear.length > 0) {
      clearFollowNotifications(notificationsToClear);
    }
  }, [notificationsToClear, clearFollowNotifications]);

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

  return {
    props: { profile },
  };
}

export default UserProfile;
