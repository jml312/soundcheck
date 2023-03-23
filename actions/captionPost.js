import axios from "axios";

export default async function captionPost({
  isSelect,
  post,
  setPost,
  caption,
  setCaption,
  badWordsFilter,
  setHasBlurredCaptionError,
}) {
  if (badWordsFilter.isProfane(caption.text)) {
    setHasBlurredCaptionError(false);
    setCaption({
      ...caption,
      error: "Please do not use profanity.",
    });
    return;
  }
  if (isSelect) {
    setPost({
      ...post,
      caption: caption.text,
    });
    setCaption({
      ...caption,
      originalText: caption.text,
      isEditing: !caption.text,
    });
  } else {
    const originalCaption = caption.originalText;
    setCaption({
      ...caption,
      isLoading: true,
    });
    try {
      await axios.post("/api/protected/caption", {
        postID: post?._id,
        caption: caption.text,
      });
      setPost({
        ...post,
        caption: caption.text,
      });
      setCaption({
        ...caption,
        originalText: caption.text,
        isEditing: !caption.text,
        isModalEditing: !caption.text,
        isLoading: false,
      });
    } catch {
      setPost({
        ...post,
        caption: originalCaption,
      });
      setCaption({
        ...caption,
        text: originalCaption,
        originalText: originalCaption,
        isEditing: !originalCaption,
        isLoading: false,
      });
    }
  }
}
