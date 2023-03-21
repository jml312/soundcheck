import {
  Modal,
  Select,
  Button,
  Group,
  Avatar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { BsMusicNoteBeamed } from "react-icons/bs";
import Post from "../Post";
import { forwardRef, useState, useEffect } from "react";
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
}) {
  const theme = useMantineTheme();
  const [selectedSong, setSelectedSong] = useState({
    value: spotifyData ? spotifyData[0]?.songName : "",
    data: spotifyData ? spotifyData[0] : {},
    isChanged: false,
    isLoading: false,
  });

  useEffect(() => {
    if (opened) {
      setSelectedSong({
        value: spotifyData ? spotifyData[0]?.songName : "",
        data: spotifyData ? spotifyData[0] : {},
        isChanged: false,
        isLoading: false,
      });
    }
  }, [opened]);

  return (
    <Modal
      keepMounted
      closeOnEscape={false}
      closeOnOutsideClick={false}
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      size="auto"
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Select
        clearable={false}
        w={!!selectedSong.value ? "100%" : 375}
        mb={15}
        radius={"0.25rem"}
        withinPortal
        dropdownPosition="bottom"
        placeholder="Choose a song"
        maxDropdownHeight={350}
        nothingFound="No songs found"
        searchable
        defaultValue={selectedSong.value}
        value={selectedSong.value}
        itemComponent={SelectItem}
        data={
          spotifyData?.map((data) => ({
            ...data,
            value: data.songName,
            label: data.songName,
          })) || []
        }
        filter={(value, item) =>
          item.songName.toLowerCase().includes(value?.toLowerCase()?.trim()) ||
          item.albumName.toLowerCase().includes(value?.toLowerCase()?.trim())
        }
        onChange={(value) => {
          setSelectedSong({
            ...selectedSong,
            value,
            data: spotifyData?.find((data) => data.songName === value),
            isChanged: true,
          });
        }}
        icon={<BsMusicNoteBeamed />}
        styles={{
          item: {
            "&[data-selected]": {
              backgroundColor: theme.colors.spotify[8],
              "&:hover": {
                backgroundColor: theme.colors.spotify[7],
              },
            },
          },
          input: {
            "&:focus": {
              borderColor: theme.colors.spotify[8],
            },
          },
        }}
      />

      {!!selectedSong.value && (
        <Post
          post={{
            ...selectedSong.data,
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
        />
      )}

      <Button
        w={!!selectedSong.value ? "100%" : 375}
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
        disabled={!selectedSong.value}
        mt={15}
        loading={selectedSong.isLoading}
      >
        {selectedSong.isLoading ? "Posting..." : "Post this song!"}
      </Button>
    </Modal>
  );
}
