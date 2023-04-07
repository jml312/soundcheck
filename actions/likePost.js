import axios from "axios";
import dayjs from "dayjs";

export default async function likePost({
  isLiked,
  setIsLikeLoading,
  post,
  setPost,
  session,
  isDiscover = false,
  idx,
}) {
  const originalIsLiked = isLiked;
  setIsLikeLoading(true);
  try {
    setPost({
      ...post,
      isLiked: !isLiked,
    });

    if (isDiscover) {
      await axios.post("/api/protected/like-song", {
        userId: session?.user?.id,
        type: isLiked ? "unlike" : "like",
        idx,
        post: {
          ...post,
          isLiked: !isLiked,
        },
        playlistID: session?.user?.playlistID,
        songID: post?.songID,
        accessToken: session?.user?.accessToken,
      });
    } else {
      await axios.post("/api/protected/like", {
        postID: post?._id,
        userId: session?.user?.id,
        postUserId: post?.userId,
        type: isLiked ? "unlike" : "like",
        createdAt: dayjs().toISOString(),
        playlistID: session?.user?.playlistID,
        songID: post?.songID,
        accessToken: session?.user?.accessToken,
      });
    }

    setIsLikeLoading(false);
  } catch {
    setIsLikeLoading(false);
    setPost({
      ...post,
      isLiked: originalIsLiked,
    });
  }
}
