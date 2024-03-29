import {
  Image,
  RingProgress,
  Center,
  Title,
  Text,
  Stack,
  ActionIcon,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { BsSpotify, BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useHover } from "@mantine/hooks";

/**
 * @param {object} post - The post object
 * @param {boolean} isPostModal - The isPostModal boolean
 * @param {boolean} isSelect - The isSelect boolean
 * @param {boolean} isDiscover - The isDiscover boolean
 * @param {boolean} isSmall - The isSmall boolean
 * @param {boolean} postModalOpen - The postModalOpen boolean
 * @param {string} activePost - The activePost string
 * @param {function} setActivePost - The setActivePost function
 * @param {string} currentlyPlaying - The currentlyPlaying string
 * @param {function} setCurrentlyPlaying - The setCurrentlyPlaying function
 * @param {string} selectedSong - The selectedSong string
 * @param {function} setSelectedSong - The setSelectedSong function
 * @param {function} setCaption - The setCaption function
 * @param {object} captionRef - The captionRef object
 * @description A middle section component
 */
export default function MiddleSection({
  isPostModal,
  isSelect,
  isDiscover,
  isSmall,
  postModalOpen,
  post,
  activePost,
  setActivePost,
  currentlyPlaying,
  setCurrentlyPlaying,
  selectedSong,
  setSelectedSong,
  setCaption,
  captionRef,
}) {
  const theme = useMantineTheme();
  const artists = post?.artists?.map((artist) => artist.name)?.join(", ");
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const { hovered: imageHovered, ref: imageRef } = useHover();
  const isActivePost = postModalOpen
    ? isPostModal && activePost === post?._id
    : activePost === post?._id;
  const imageFocused = isSmall
    ? isActivePost || isAudioPlaying
    : isActivePost || imageHovered || isAudioPlaying;

  useEffect(() => {
    audioRef.current.addEventListener("timeupdate", () => {
      if (!audioRef.current) return;
      const percent =
        (audioRef?.current?.currentTime / audioRef?.current?.duration) * 100;
      setAudioProgress(percent);
    });
    audioRef.current.addEventListener("ended", () => {
      setAudioProgress(0);
      setActivePost(post?._id);
      setCurrentlyPlaying(null);
      setIsAudioPlaying(false);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        if (audioRef?.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.pause();
        }
        setIsAudioPlaying(false);
        setActivePost(null);
        setCurrentlyPlaying(null);
      }
    });
  }, [currentlyPlaying, activePost, post?._id]);

  useEffect(() => {
    if (!audioRef?.current?.paused && currentlyPlaying !== post?._id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  }, [currentlyPlaying]);

  useEffect(() => {
    if (selectedSong?.isChanged) {
      setActivePost(null);
      setCurrentlyPlaying(null);
      setSelectedSong({
        ...selectedSong,
        isChanged: false,
      });
      setCaption({
        text: "",
        error: "",
        isFocused: true,
      });
      setTimeout(() => {
        captionRef?.current?.focus();
        setIsAudioPlaying(false);
        setAudioProgress(0);
      }, 0);
    }
  }, [selectedSong?.isChanged]);

  return (
    <>
      <div
        style={{
          position: "relative",
          backgroundColor: theme.colors.pure.light,
          borderRadius: "0.25rem",
        }}
        ref={imageRef}
      >
        <Image
          onClick={() => {
            if (currentlyPlaying !== null && !isSmall) return;
            if (isSelect) {
              setActivePost(activePost === post?._id ? null : post?._id);
            } else if (!activePost) {
              setActivePost(post?._id);
            } else if (activePost === post?._id) {
              setActivePost(null);
            } else {
              setActivePost(post?._id);
            }
          }}
          src={post?.albumImage}
          alt={post?.albumName}
          radius={"0.25rem"}
          width={!isPostModal ? 275 : isSmall ? "70vw" : 375}
          height={!isPostModal ? 275 : isSmall ? "70vw" : 375}
          withPlaceholder
          style={{
            opacity: imageFocused ? 0.3 : 1,
            transition: "opacity 0.2s ease-in-out",
            zIndex: 1,
            cursor: "pointer",
          }}
        />

        {imageFocused &&
          (!!post?.previewUrl ? (
            <>
              <RingProgress
                rootColor={"transparent"}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                title={isAudioPlaying ? "Pause" : "Play"}
                sections={[
                  {
                    value: audioProgress,
                    color: theme.colors.spotify.main,
                  },
                ]}
                size={isPostModal ? 105 : 90}
                thickness={isPostModal ? 7.5 : 7.5}
                label={
                  <Center>
                    <ActionIcon
                      onClick={() => {
                        audioRef.current.currentTime = 0;
                        if (
                          currentlyPlaying === null ||
                          currentlyPlaying !== post?._id
                        ) {
                          audioRef.current.play();
                          setIsAudioPlaying(true);
                          setActivePost(post?._id);
                          setCurrentlyPlaying(post?._id);
                        } else if (currentlyPlaying === post?._id) {
                          audioRef.current.pause();
                          setIsAudioPlaying(false);
                          setActivePost(post?._id);
                          setCurrentlyPlaying(null);
                        }
                      }}
                      title={isAudioPlaying ? "Pause" : "Play"}
                      size={isPostModal ? "4.5rem" : "3.75rem"}
                      sx={{
                        color: theme.colors.pure.dark,
                        "&:hover": {
                          backgroundColor: "transparent !important",
                        },
                      }}
                    >
                      {!isAudioPlaying ? (
                        <BsPlayCircleFill
                          style={{
                            cursor: "pointer",
                          }}
                          fontSize={isPostModal ? "4.5rem" : "3.75rem"}
                        />
                      ) : (
                        <BsPauseCircleFill
                          style={{
                            cursor: "pointer",
                          }}
                          fontSize={isPostModal ? "4.5rem" : "3.75rem"}
                        />
                      )}
                    </ActionIcon>
                  </Center>
                }
              />
              <ActionIcon
                title="Listen on Spotify"
                component="a"
                href={post?.songUrl}
                target="_blank"
                radius={"xl"}
                size={isPostModal ? "2rem" : "1.6rem"}
                variant={"transparent"}
                sx={{
                  cursor: "pointer !important",
                  position: "absolute",
                  top: "0.6rem",
                  right: "0.6rem",
                }}
                onClick={() => {
                  audioRef.current.pause();
                  setIsAudioPlaying(false);
                }}
              >
                <BsSpotify
                  fontSize={isPostModal ? "2rem" : "1.6rem"}
                  style={{
                    cursor: "pointer !important",
                    color: theme.colors.spotify.main,
                  }}
                />
              </ActionIcon>
            </>
          ) : (
            <Center
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <ActionIcon
                title="Listen on Spotify"
                component="a"
                href={post?.songUrl}
                target="_blank"
                radius={"xl"}
                size={"3.75rem"}
                variant={"transparent"}
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent !important",
                  },
                }}
                onClick={() => {
                  audioRef.current.pause();
                  setIsAudioPlaying(false);
                }}
              >
                <BsSpotify
                  fontSize={"3.75rem"}
                  style={{
                    cursor: "pointer !important",
                    color: theme.colors.spotify.main,
                  }}
                />
              </ActionIcon>
            </Center>
          ))}
      </div>

      <audio src={post?.previewUrl} type="audio/mpeg" ref={audioRef} />

      {/* song info */}
      <Flex
        direction={"column"}
        mt={8}
        mb={(isDiscover || isSelect) && "0.5rem"}
        w={!isPostModal ? 275 : isSmall ? "70vw" : 375}
        style={{
          textAlign: "center",
        }}
      >
        <Title
          order={3}
          color="white"
          sx={{
            cursor: "default",
          }}
          truncate
        >
          {post?.songName}
        </Title>
        <Text
          sx={{
            cursor: "default",
            opacity: 0.8,
          }}
          truncate
        >
          {artists}
        </Text>
      </Flex>
    </>
  );
}
