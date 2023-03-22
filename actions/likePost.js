import axios from "axios";
import dayjs from "dayjs";

export default async function likePost({
  isLiked,
  setIsLikeLoading,
  post,
  setPost,
  session,
}) {
  const originalIsLiked = isLiked;
  setIsLikeLoading(true);
  try {
    setPost({
      ...post,
      isLiked: !isLiked,
    });
    await axios.post("/api/protected/like", {
      postID: post?._id,
      userId: session?.user?.id,
      type: isLiked ? "unlike" : "like",
      createdAt: dayjs().toISOString(),
      playlistID: session?.user?.playlistID,
      songID: post?.songID,
      accessToken: session?.user?.accessToken,
    });
    setIsLikeLoading(false);
  } catch {
    setIsLikeLoading(false);
    setPost({
      ...post,
      isLiked: originalIsLiked,
    });
  }
}
