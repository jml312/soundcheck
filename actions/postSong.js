import axios from "axios";
import { notifications } from "@mantine/notifications";

export default async function postSong({
  selectedSong,
  setSelectedSong,
  session,
  setPost,
  caption,
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
      accessToken: session.user.accessToken,
      caption: caption.text,
    });
    setPost({
      ...selectedSong.data,
      _id,
      userId: session.user.id,
      username: session.user.name,
      userImage: session.user.image,
      caption: caption.text,
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
      styles: (theme) => ({
        root: {
          borderColor: theme.colors.contrast[theme.colorScheme],
          backgroundColor: theme.colors.contrast[theme.colorScheme],
          "&::before": {
            backgroundColor: theme.colors.green[6],
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
  } catch {
    setSelectedSong({
      ...selectedSong,
      isLoading: false,
    });
    setPost(null);
  }
}
