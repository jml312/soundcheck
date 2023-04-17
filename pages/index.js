import { Flex, Button, Title } from "@mantine/core";
import { signIn, getSession } from "next-auth/react";
import { BsSpotify } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { NextSeo } from "next-seo";
import SEO from "seo";
import Logo from "@/components/Logo";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (error) {
      setHasShownError(true);
      window.history.replaceState(null, "", `${process.env.NEXT_PUBLIC_URL}`);
    }
  }, [error]);

  useEffect(() => {
    if (hasShownError) {
      notifications.show({
        title: "Sign in failed",
        message: "Please try again",
        styles: (theme) => ({
          root: {
            borderColor: theme.colors.contrast[theme.colorScheme],
            backgroundColor: theme.colors.contrast[theme.colorScheme],
            "&::before": {
              backgroundColor: theme.colors.red[6],
            },
          },
          title: { color: theme.colors.pure[theme.colorScheme] },
          description: {
            color: theme.colorScheme === "dark" ? "#8a8c90" : "#75736f",
          },
          closeButton: {
            color: theme.colors.pure[theme.colorScheme],
            "&:hover": {
              backgroundColor: theme.colors.itemHover[theme.colorScheme],
            },
          },
        }),
      });
    }
  }, [hasShownError]);

  return (
    <>
      <NextSeo
        {...{
          ...SEO,
          title: "Soundcheck!",
        }}
      />
      <Flex
        justify={"center"}
        align={"center"}
        direction={"column"}
        mih={"100vh"}
        gap={20}
      >
        <Flex align={"center"} justify={"center"} gap={".5rem"}>
          <Logo />
          <Title order={1}>Soundcheck!</Title>
        </Flex>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            signIn("spotify", {
              callbackUrl: "/feed",
            });
          }}
          size="md"
          leftIcon={<BsSpotify />}
          loading={isLoading}
        >
          {isLoading ? "Logging in..." : "Continue with Spotify"}
        </Button>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/feed",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
