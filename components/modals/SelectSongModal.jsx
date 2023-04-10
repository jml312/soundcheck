import {
  Modal,
  Select,
  Button,
  Group,
  Avatar,
  Text,
  useMantineTheme,
  LoadingOverlay,
} from "@mantine/core";
import { BsMusicNoteBeamed, BsSpotify } from "react-icons/bs";
import Post from "../Post/Post";
import { forwardRef, useState, useMemo } from "react";
import { postSong } from "@/actions";

const SelectItem = forwardRef(
  ({ songName, albumImage, albumName, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={albumImage} radius={0} />
        <div>
          <Text size="sm">{songName}</Text>
          <Text size="xs" opacity={0.65}>
            {albumName}
          </Text>
        </div>
      </Group>
    </div>
  )
);
SelectItem.displayName = "SelectItem";

export default function SelectSongModal({
  opened,
  close,
  spotifyData,
  currentlyPlaying,
  setCurrentlyPlaying,
  session,
  setPost,
  caption,
  setCaption,
  captionRef,
  badWordsFilter,
  activePost,
  setActivePost,
  isSmall,
}) {
  const theme = useMantineTheme();
  const [selectedSong, setSelectedSong] = useState({
    value:
      spotifyData?.length > 0
        ? `${spotifyData[0]?.songName} by ${spotifyData[0].artists
            .map((artist) => artist.name)
            .join(", ")}`
        : "",
    data: spotifyData?.length > 0 ? spotifyData[0] : {},
    isChanged: false,
    isLoading: false,
  });
  const [selectOpen, setSelectOpen] = useState(false);
  const selectOptions = useMemo(
    () =>
      spotifyData?.map((data) => {
        const currentSong = `${data?.songName} by ${data?.artists
          .map((artist) => artist.name)
          .join(", ")}`;
        return {
          ...data,
          value: currentSong,
          label: currentSong,
          group: data.group,
        };
      }) || [],
    []
  );

  return (
    <>
      <Modal
        opened={opened}
        closeOnEscape={false}
        closeOnOutsideClick={false}
        onClose={() => {}}
        withCloseButton={false}
        centered
        overlayProps={{
          blur: 3,
          opacity: 0.55,
        }}
        size="auto"
        padding={13}
        zIndex={100}
        styles={{
          content: {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.black : theme.white,
          },
        }}
      >
        <LoadingOverlay
          visible={selectedSong.isLoading}
          overlayOpacity={0.55}
          overlayBlur={3}
          zIndex={1000}
        />
        {!!selectedSong.value && (
          <Post
            post={{
              ...selectedSong.data,
              userId: session?.user?.id,
              username: session?.user?.name,
              userImage: session?.user?.image,
            }}
            setPost={(post) => {
              setSelectedSong({
                ...selectedSong,
                data: post,
              });
            }}
            isUser={true}
            isPostModal
            isSelect
            currentlyPlaying={currentlyPlaying}
            setCurrentlyPlaying={setCurrentlyPlaying}
            selectedSong={selectedSong}
            setSelectedSong={setSelectedSong}
            session={session}
            caption={caption}
            setCaption={setCaption}
            badWordsFilter={badWordsFilter}
            isPosting={selectedSong.isLoading}
            activePost={activePost}
            setActivePost={setActivePost}
            captionRef={captionRef}
            isSmall={isSmall}
          />
        )}

        <Select
          label={
            <Group noWrap spacing={4}>
              <Text size="sm">Your songs</Text>
              <BsSpotify
                size={13}
                style={{
                  color: theme.colors.spotify.main,
                }}
              />
            </Group>
          }
          clearable={false}
          w={"100%"}
          mb={15}
          radius={"0.25rem"}
          withinPortal
          dropdownPosition="top"
          placeholder="Choose a song"
          maxDropdownHeight={350}
          defaultValue={selectedSong.value}
          value={selectedSong.value}
          itemComponent={SelectItem}
          data={selectOptions}
          onChange={(value) => {
            setActivePost(null);
            setCurrentlyPlaying(null);
            setSelectedSong({
              ...selectedSong,
              value,
              data: spotifyData?.find(
                (data) => data.songName === value.split(" by ")[0]
              ),
              isChanged: true,
            });
          }}
          onDropdownOpen={() => setSelectOpen(true)}
          onDropdownClose={() => setSelectOpen(false)}
          styles={{
            separator: {
              "& .mantine-Divider-left::after": {
                borderTop: `1px solid ${
                  theme.colorScheme === "dark"
                    ? "rgba(255, 255, 255, 0.75)"
                    : "rgba(0, 0, 0, 0.75)"
                }`,
              },
            },
            separatorLabel: {
              color: `${
                theme.colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.75)"
                  : "rgba(0, 0, 0, 0.75)"
              } !important`,
            },
            rightSection: {
              stroke:
                theme.colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0, 0, 0, 0.5)",
            },
            root: { position: "relative" },
            label: {
              position: "absolute",
              pointerEvents: "none",
              fontSize: theme.fontSizes.xs,
              paddingLeft: theme.spacing.sm,
              paddingTop: `calc(${theme.spacing.sm} / 2)`,
              zIndex: 1,
            },
            input: {
              transition: "none",
              marginTop: 10,
              marginBottom: -5,
              height: 57,
              paddingTop: 21,
              backgroundColor: theme.colors.contrast[theme.colorScheme],
              border: "1px solid transparent",
              "&:focus": {
                border: `1px solid ${theme.colors.spotify.main}`,
              },
            },
            item: {
              "&[data-selected]": {
                backgroundColor: theme.colors.spotify.main,
                "&[data-hovered]": {
                  backgroundColor: theme.colors.spotify.main,
                },
              },
              "&[data-hovered]": {
                backgroundColor: theme.colors.itemHover[theme.colorScheme],
              },
            },
            dropdown: {
              "& .mantine-ScrollArea-thumb": {
                backgroundColor: `${
                  theme.colorScheme === "dark" ? "#474952" : "#b8b6ad"
                } !important`,
              },
            },
          }}
        />

        <Button
          onClick={() => {
            if (caption.text.length === 0) {
              setCaption({
                ...caption,
                isFocused: true,
                error: "Please add a caption.",
              });
              setTimeout(() => {
                captionRef.current.focus();
              }, 0);
              return;
            }
            if (badWordsFilter.isProfane(caption.text)) {
              setCaption({
                ...caption,
                isFocused: true,
                error: "Please don't use profanity.",
              });
              setTimeout(() => {
                captionRef.current.focus();
              }, 0);
              return;
            }
            postSong({
              selectedSong,
              setSelectedSong,
              session,
              setPost,
              caption,
              setCurrentlyPlaying,
              close,
            });
          }}
          fullWidth
          mt={15}
          loading={selectedSong.isLoading}
          leftIcon={<BsMusicNoteBeamed />}
          disabled={selectOpen}
          styles={{
            root: {
              backgroundColor: `${theme.colors.spotify.lighter} !important`,
              "&:hover": {
                backgroundColor: `${theme.colors.spotify.main} !important`,
              },
              "&[data-disabled]": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? "#373a40 !important"
                    : "#c8c5bf !important",
                color: `${theme.colors.contrast[theme.colorScheme]} !important`,
              },
            },
          }}
        >
          {selectedSong.isLoading ? "Posting..." : "Post this song"}
        </Button>
      </Modal>
    </>
  );
}
