import { SessionProvider, useSession } from "next-auth/react";
import "@/styles/globals.css";
import Head from "next/head";
import { MantineProvider, Flex, Loader } from "@mantine/core";
import Navbar from "@/components/Navbar";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(relativeTime, {
  thresholds: [
    { l: "ms", r: 999, d: "millisecond" },
    { l: "s", r: 1 },
    { l: "ss", r: 59, d: "second" },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 6, d: "day" },
    { l: "w", r: 1 },
    { l: "ww", r: 3, d: "week" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y", r: 1 },
    { l: "yy", d: "year" },
  ],
});

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    past: (number) => (number === "just now" ? number : `${number} ago`),
    ms: "just now",
    s: "1 second",
    ss: "%d seconds",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    w: "1 week",
    ww: "%d weeks",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years",
  },
});

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const emptyColors = (num) => Array(num).fill("");
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", (url, { shallow }) => {
      if (!shallow) {
        setIsRouteLoading(true);
      }
    });
    router.events.on("routeChangeComplete", (url, { shallow }) => {
      if (!shallow) {
        setIsRouteLoading(false);
      }
    });
    return () => {
      router.events.off("routeChangeStart", () => {});
      router.events.off("routeChangeComplete", () => {});
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Soundcheck!</title>
        <meta
          name="description"
          content="a social media platform that allows users to post daily updates of what they are listening to"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              loader: "bars",
              colorScheme: "dark",
              colors: {
                spotify: [
                  ...emptyColors(7),
                  "rgba(29, 185, 84, 0.9)",
                  "rgba(29, 185, 84, 1)",
                ],
                lightWhite: [
                  ...emptyColors(6),
                  "#a8a9ad",
                  "rgba(192, 193, 196, 0.75)",
                  "#c0c1c4",
                ],
                lightGray: ["#3C3F42", ...emptyColors(7), "#25262b"],
              },
              primaryColor: "spotify",
              components: {
                Button: {
                  styles: (theme) => ({
                    root: {
                      color: "white",
                      backgroundColor: theme.colors.spotify[6],
                      "&:hover": {
                        backgroundColor: theme.colors.spotify[7],
                      },
                    },
                  }),
                },
              },
            }}
          >
            <Notifications />
            <Auth isRouteLoading={isRouteLoading}>
              <Component {...pageProps} />
            </Auth>
          </MantineProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ children, isRouteLoading }) {
  const { status } = useSession();
  if (status === "loading")
    return (
      <Flex mih={"100vh"} align="center" justify="center" direction="column">
        <Loader size="xl" />
      </Flex>
    );
  return status === "authenticated" ? (
    <Navbar>
      {isRouteLoading ? (
        <Flex
          style={{
            height: "calc(100vh - 5rem)",
          }}
          justify={"space-between"}
          align={"stretch"}
          direction={"column"}
        >
          <Flex
            w={"100%"}
            h="100%"
            justify={"center"}
            align={"center"}
            style={{
              transform: "translateY(5rem)",
            }}
            direction={"column"}
            mt={"2.25rem"}
          >
            <Loader size="xl" />
          </Flex>
        </Flex>
      ) : (
        children
      )}
    </Navbar>
  ) : (
    children
  );
}
