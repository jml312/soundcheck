import { HoverCard, Popover, ActionIcon, Flex } from "@mantine/core";
import { VscReactions } from "react-icons/vsc";
import { useEffect } from "react";

export default function EmojiPicker({
  isDisabled,
  isMobileOpen,
  setIsMobileOpen,
  setText,
  inputRef,
  isSmall,
  position,
}) {
  const emojis = ["🔥", "❤️", "👍", "😂", "😍", "🤩", "😭", "🤔"];

  useEffect(() => {
    if (isDisabled) {
      setText((prev) => ({
        ...prev,
        isFocused: true,
        addedEmoji: false,
        error: "",
      }));
      setIsMobileOpen(false);
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [isDisabled]);

  return isSmall ? (
    <Popover
      zIndex={1000}
      width={150}
      shadow="md"
      position={position}
      disabled={isDisabled}
      opened={isMobileOpen}
      onChange={setIsMobileOpen}
    >
      <Popover.Target>
        <ActionIcon
          disabled={isDisabled}
          size={"xs"}
          variant={"transparent"}
          onMouseDown={() => setIsMobileOpen((o) => !o)}
        >
          <VscReactions />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Flex wrap={"wrap"} justify={"space-between"} align={"center"}>
          {emojis.map((emoji, idx) => (
            <ActionIcon
              key={idx}
              onMouseDown={() => {
                setText((prev) => ({
                  ...prev,
                  text: prev.text + emoji,
                  addedEmoji: true,
                  error: "",
                }));
              }}
              onClick={() => {
                setText((prev) => ({
                  ...prev,
                  addedEmoji: false,
                  error: "",
                }));
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
      </Popover.Dropdown>
    </Popover>
  ) : (
    <HoverCard
      zIndex={1000}
      width={150}
      shadow="md"
      position={position}
      disabled={isDisabled}
      returnFocus
    >
      <HoverCard.Target>
        <ActionIcon disabled={isDisabled} size={"xs"} variant={"transparent"}>
          <VscReactions />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Flex wrap={"wrap"} justify={"space-between"} align={"center"}>
          {emojis.map((emoji, idx) => (
            <ActionIcon
              key={idx}
              onMouseDown={() => {
                setText((prev) => ({
                  ...prev,
                  text: prev.text + emoji,
                  addedEmoji: true,
                  error: "",
                }));
              }}
              onClick={() => {
                setText((prev) => ({
                  ...prev,
                  addedEmoji: false,
                  error: "",
                }));
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
