import { Flex, Button, Title } from "@mantine/core";
import { signIn, getSession } from "next-auth/react";
import { BsSpotify } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";

function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (error === "AccessDenied") {
      setHasShownError(true);
      window.history.replaceState(null, "", `${process.env.NEXT_PUBLIC_URL}/`);
    }
  }, [error]);

  useEffect(() => {
    if (hasShownError) {
      notifications.show({
        title: "Sign in failed",
        message: "Please try again",
        color: "red",
      });
    }
  }, [hasShownError]);

  return (
    <Flex
      justify={"center"}
      align={"center"}
      direction={"column"}
      mih={"100vh"}
      gap={20}
      bg={"lightGray"}
    >
      <Title size="2.5rem" order={1} color={"white"}>
        Soundcheck!
      </Title>
      <Button
        onClick={() => {
          setIsLoading(true);
          signIn("spotify", {
            callbackUrl: "/home",
          });
        }}
        size="md"
        leftIcon={<BsSpotify />}
        loading={isLoading}
      >
        Continue with Spotify
      </Button>
    </Flex>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (session) {
    res.writeHead(302, { Location: "/home" });
    res.end();
  }

  return {
    props: {},
  };
}

export default Index;
