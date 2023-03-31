import { Flex, Text, Title, Stack } from "@mantine/core";
import { BsSpotify, BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";

export default function SongCard({ post }) {
  //   {
  //   "_id": "picILw1rFXHa1yS7xsWqXk",
  //   "_type": "post",
  //   "_updatedAt": "2023-03-30T15:38:21Z",
  //   "albumImage": "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699",
  //   "albumName": "DAMN.",
  //   "albumUrl": "https://open.spotify.com/album/4eLPsYPBmXABThSJ821sqY",
  //   "artists": [
  //     {
  //       "_key": "2YZyLoL8N0Wb9xBt1NhZWg",
  //       "id": "2YZyLoL8N0Wb9xBt1NhZWg",
  //       "name": "Kendrick Lamar"
  //     },
  //     {
  //       "_key": "3qBKjEOanahMxlRojwCzhI",
  //       "id": "3qBKjEOanahMxlRojwCzhI",
  //       "name": "Zacari"
  //     }
  //   ],
  //   "caption": "Good song",
  //   "comments": [],
  //   "createdAt": "2023-03-30T15:38:21.684Z",
  //   "genres": [
  //     "conscious hip hop",
  //     "hip hop",
  //     "rap",
  //     "west coast rap"
  //   ],
  //   "likes": [],
  //   "previewUrl": "https://p.scdn.co/mp3-preview/70e57d78cc283866f5d5f2a42deeaffad474309b?cid=ab5e8a6c81824170b857816d88e19bc2",
  //   "songID": "6PGoSes0D9eUDeeAafB2As",
  //   "songName": "LOVE. FEAT. ZACARI.",
  //   "songUrl": "https://open.spotify.com/track/6PGoSes0D9eUDeeAafB2As",
  //   "user": {
  //     "_ref": "jlev111",
  //     "_type": "reference"
  //   }
  // }
  const { songName, songUrl, albumName, albumUrl, albumImage, artists } = post;

  return (
    <Flex
      w={375}
      style={{
        borderRadius: "0.5rem",
        // boxShadow: "0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.1)",
        border: "1px solid #c0c1c4",
      }}
    >
      <Stack>
        <Title>{songName}</Title>
        <Text>{albumName}</Text>
      </Stack>
    </Flex>
  );
}
