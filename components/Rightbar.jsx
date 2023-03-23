import { Flex, Text } from "@mantine/core";
import Post from "./Post";

export default function Rightbar({
  post,
  setPost,
  isLoading,
  currentlyPlaying,
  setCurrentlyPlaying,
  session,
  caption,
  setCaption,
  badWordsFilter,
  isMobile,
}) {
  return (
    <Flex
      sx={{
        borderBottom: isMobile && "1px solid rgba(230, 236, 240, 0.5)",
        borderLeft: !isMobile && "1px solid rgba(230, 236, 240, 0.5)",
        height: "100%",
      }}
      align="center"
      justify="center"
      w={!isMobile ? "375px" : "100%"}
      pb={isMobile && "3rem"}
      mb={isMobile && "3rem"}
    >
      {!!post ? (
        <Post
          key={post?._id}
          isLoading={isLoading}
          isUser
          post={post}
          setPost={setPost}
          currentlyPlaying={currentlyPlaying}
          setCurrentlyPlaying={setCurrentlyPlaying}
          session={session}
          caption={caption}
          setCaption={setCaption}
          badWordsFilter={badWordsFilter}
        />
      ) : (
        <Text>You never posted on this day</Text>
      )}
    </Flex>
  );
}
