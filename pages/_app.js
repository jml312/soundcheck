import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import {
  MantineProvider,
  Flex,
  Loader,
  ColorSchemeProvider,
} from "@mantine/core";
import Navbar from "@/components/Navbar";
import { Notifications } from "@mantine/notifications";
import { useHotkeys } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import dayjs from "dayjs";
import { getCookie, setCookie } from "cookies-next";
import NextApp from "next/app";
import { getMantineTheme } from "@/mantineTheme";
import { DefaultSeo } from "next-seo";
import SEO from "seo";
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
  colorScheme: initialColorScheme,
}) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const toggleColorScheme = () => {
    const nextColorScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  };

  useHotkeys([["mod + M", toggleColorScheme]]);

  useEffect(() => {
    router.events.on("routeChangeStart", (_, { shallow }) => {
      if (!shallow) {
        setIsRouteLoading(true);
      }
    });
    router.events.on("routeChangeComplete", () => setIsRouteLoading(false));
    return () => {
      router.events.off("routeChangeStart", () => {});
      router.events.off("routeChangeComplete", () => {});
    };
  }, [router.events]);

  return (
    <>
      <DefaultSeo {...SEO} />

      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
            >
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={getMantineTheme(colorScheme)}
              >
                <Notifications />
                <Auth isRouteLoading={isRouteLoading}>
                  <Component {...pageProps} />
                </Auth>
              </MantineProvider>
            </ColorSchemeProvider>
          </Hydrate>
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

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};
