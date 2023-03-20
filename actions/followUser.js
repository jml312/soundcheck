import axios from "axios";

export default async function followUser({
  isFollowing,
  setIsFollowLoading,
  post,
  setPost,
  session,
}) {
  const originalPost = post;
  setIsFollowLoading(true);
  try {
    setPost({
      ...post,
      isFollowing: !isFollowing,
      numFollowers: post?.numFollowers + (isFollowing ? -1 : 1),
    });
    await axios.post("/api/protected/follow", {
      name: session?.user?.name,
      toFollowName: post?.username,
      type: isFollowing ? "unfollow" : "follow",
    });
    setIsFollowLoading(false);
  } catch {
    setIsFollowLoading(false);
    setPost({
      ...originalPost,
    });
  }
}
