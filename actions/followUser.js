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
      userId: session?.user?.id,
      postUserId: post?.userId,
      toFollowId: post?.userId,
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
