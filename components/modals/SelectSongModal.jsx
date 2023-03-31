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
import Post from "../Post";
import { forwardRef, useState } from "react";
import { postSong } from "@/actions";

const SelectItem = forwardRef(
  ({ songName, albumImage, albumName, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={albumImage} />
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
  badWordsFilter,
  activePost,
  setActivePost,
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
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  return (
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
      padding={6}
    >
      <LoadingOverlay
        visible={selectedSong.isLoading}
        overlayOpacity={0.55}
        overlayBlur={3}
        zIndex={1000}
      />
      <Select
        onFocus={() => setIsSelectFocused(true)}
        onBlur={() => setIsSelectFocused(false)}
        label={
          <Group noWrap spacing={4}>
            <Text size="sm">Your songs</Text>
            <BsSpotify
              size={13}
              style={{
                color: theme.colors.spotify[8],
              }}
            />
          </Group>
        }
        clearable={false}
        w={"100%"}
        mb={15}
        radius={"0.25rem"}
        withinPortal
        dropdownPosition="bottom"
        placeholder="Choose a song"
        maxDropdownHeight={350}
        defaultValue={selectedSong.value}
        value={selectedSong.value}
        itemComponent={SelectItem}
        data={
          spotifyData?.map((data, idx) => {
            const currentSong = `${data?.songName} by ${data?.artists
              .map((artist) => artist.name)
              .join(", ")}`;
            return {
              ...data,
              value: currentSong,
              label: currentSong,
              group: data.isCurrentlyPlaying
                ? "Currently playing"
                : "Recently played",
              // group: idx === 0 ? "Most Recent" : "Recently played",
            };
          }) || []
        }
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
        styles={{
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
            height: 57,
            paddingTop: 21,
            "&:focus": {
              borderColor: theme.colors.spotify[8],
            },
          },
          item: {
            "&[data-selected]": {
              backgroundColor: theme.colors.spotify[8],
              "&:hover": {
                backgroundColor: theme.colors.spotify[7],
              },
            },
          },
        }}
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
        />
      )}

      <Button
        w={"100%"}
        onClick={() =>
          postSong({
            selectedSong,
            setSelectedSong,
            session,
            setPost,
            caption,
            setCaption,
            setCurrentlyPlaying,
            close,
          })
        }
        fullWidth
        disabled={!selectedSong.value || caption.isFocused || isSelectFocused}
        mt={15}
        loading={selectedSong.isLoading}
        leftIcon={<BsMusicNoteBeamed />}
      >
        {selectedSong.isLoading ? "Posting..." : "Post this song"}
      </Button>
    </Modal>
  );
}
