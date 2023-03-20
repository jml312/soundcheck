import axios from "axios";

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
      data: { _id },
    } = await axios.post("/api/protected/post", {
      ...selectedSong.data,
      name: session.user.name,
    });
    setPost({
      ...selectedSong.data,
      _id,
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
  } catch {
    setSelectedSong({
      ...selectedSong,
      isLoading: false,
    });
    setPost(null);
  }
}
