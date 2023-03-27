export default async function captionPost({
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
  setPost({
    ...post,
    caption: caption.text,
  });
  setCaption({
    ...caption,
    originalText: caption.text,
    isEditing: !caption.text,
    isFocused: false,
  });
}
