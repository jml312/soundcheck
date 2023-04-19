import { getSession } from "next-auth/react";
import { clearAuthCookies, getDayInterval } from "@/utils";
import client from "@/lib/sanity";
import { hasPostedTodayQuery, profileQuery } from "@/lib/queries";
import Profile from "@/components/Profile";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
import SEO from "seo";

function MyProfile({ profile }) {
  return (
    <>
      <NextSeo
        {...{
          ...SEO,
          title: "My profile | Soundcheck!",
          canonical: `${process.env.NEXT_PUBLIC_URL}/my-profile`,
          openGraph: {
            ...SEO.openGraph,
            title: "My profile | Soundcheck!",
            url: `${process.env.NEXT_PUBLIC_URL}/my-profile`,
          },
        }}
      />

      <Profile isUser profile={profile} />
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

  const profile = await client.fetch(profileQuery, {
    userId: session.user.id,
  });

  return {
    props: { profile },
  };
}

export default MyProfile;
