import { Flex } from "@mantine/core";
import { useSession, getSession } from "next-auth/react";

function MyProfile() {
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
      {JSON.stringify(session, null, 2)}
    </Flex>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return { props: {} };
  }

  return {
    props: {},
  };
}

export default MyProfile;
