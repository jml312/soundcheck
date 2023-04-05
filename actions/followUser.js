import axios from "axios";

export default async function followUser({
  session,
  toFollowId,
  isFollowing,
  setIsFollowLoading,
  // feed
  post,
  setPost,
  // profile
  setIsFollowing,
  setFollowers,
}) {
  const originalPost = post;
  setIsFollowLoading(true);
  try {
    const type = isFollowing ? "unfollow" : "follow";
    if (!!setIsFollowing) {
      setIsFollowing((prev) => !prev);
      if (type === "follow") {
        setFollowers((prev) => [
          ...prev,
          {
            userId: session.user.id,
            username: session.user.name,
            userImage: session.user.image,
          },
        ]);
      } else if (type === "unfollow") {
        setFollowers((prev) =>
          prev.filter((follower) => follower.userId !== session.user.id)
        );
      }
    } else {
      setPost({
        ...post,
        isFollowing: !isFollowing,
        numFollowers: post?.numFollowers + (isFollowing ? -1 : 1),
      });
    }
    await axios.post("/api/protected/follow", {
      userId: session.user.id,
      toFollowId,
      type,
    });
    setIsFollowLoading(false);
  } catch {
    setIsFollowLoading(false);
    setPost({
      ...originalPost,
    });
  }
}
