import { HoverCard, ActionIcon, Flex } from "@mantine/core";
import { VscReactions } from "react-icons/vsc";
import { useDisclosure } from "@mantine/hooks";

export default function EmojiPicker({ text, setText, inputRef, styles }) {
  const emojis = ["🔥", "❤️", "👍", "😂", "😍", "🤩", "😭", "🤔"];
  const [
    emojiPickerOpened,
    { open: openEmojiPicker, close: closeEmojiPicker },
  ] = useDisclosure(false);

  return (
    <HoverCard
      zIndex={1000}
      width={150}
      shadow="md"
      position="bottom-end"
      onOpen={openEmojiPicker}
      onClose={closeEmojiPicker}
    >
      <HoverCard.Target>
        <ActionIcon
          size={"xs"}
          variant={"subtle"}
          sx={(theme) => ({
            ...styles,
            backgroundColor: emojiPickerOpened ? theme.colors.dark[7] : "none",
            "&:hover": {
              backgroundColor: theme.colors.dark[7],
            },
            "&:active": {
              backgroundColor: theme.colors.dark[7],
              transform: "none",
            },
          })}
          onMouseDown={() => {
            setText({
              ...text,
              addedEmoji: true,
            });
          }}
          onClick={() => {
            setText({
              ...text,
              addedEmoji: false,
            });
            inputRef.current.focus();
          }}
        >
          <VscReactions />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Flex wrap={"wrap"} justify={"space-between"} align={"center"}>
          {emojis.map((emoji, idx) => (
            <ActionIcon
              key={idx}
              onMouseDown={() => {
                setText({
                  ...text,
                  text: text.text + emoji,
                  addedEmoji: true,
                });
              }}
              onClick={() => {
                setText({
                  ...text,
                  addedEmoji: false,
                });
                inputRef.current.focus();
              }}
              sx={(theme) => ({
                "&:hover": {
                  backgroundColor: theme.colors.dark[7],
                },
                "&:active": {
                  backgroundColor: theme.colors.dark[7],
                  transform: "none",
                },
              })}
            >
              {emoji}
            </ActionIcon>
          ))}
        </Flex>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
