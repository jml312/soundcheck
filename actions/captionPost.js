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
      isEditing: !post?.caption,
    });
  } else {
    const originalCaption = caption.originalText;
    setCaption({
      ...caption,
      isLoading: true,
    });
    try {
      setPost({
        ...post,
        caption: caption.text,
      });
      setCaption({
        ...caption,
        originalText: caption.text,
        isEditing: !post?.caption,
      });
      await axios.post("/api/protected/caption", {
        postID: post?._id,
        caption: caption.text,
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
      });
    }
  }
}
