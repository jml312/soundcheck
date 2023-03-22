import axios from "axios";
import { notifications } from "@mantine/notifications";

export default async function postSong({
  selectedSong,
  setSelectedSong,
  session,
  setPost,
  caption,
  setCaption,
  setCurrentlyPlaying,
  close,
}) {
  setSelectedSong({
    ...selectedSong,
    isLoading: true,
  });
  try {
    const {
      data: { _id, postStreak },
    } = await axios.post("/api/protected/post", {
      ...selectedSong.data,
      userId: session.user.id,
    });
    setPost({
      ...selectedSong.data,
      _id,
      userId: session.user.id,
      username: session.user.name,
      userImage: session.user.image,
      caption: selectedSong.data?.caption,
    });
    setCaption({
      ...caption,
      originalText: selectedSong.data?.caption || "",
      isEditing: caption.originalText.length === 0,
    });
    setSelectedSong({
      ...selectedSong,
      isLoading: false,
    });
    setCurrentlyPlaying(null);
    close();
    notifications.show({
      title: `🔥 Your post streak is now ${postStreak}`,
      message: `${selectedSong.data?.songName} by ${selectedSong.data?.artists
        .map((artist) => artist.name)
        .join(", ")}`,
      autoClose: 7000,
    });
  } catch {
    setSelectedSong({
      ...selectedSong,
      isLoading: false,
    });
    setPost(null);
  }
}
