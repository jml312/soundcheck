import {
  HoverCard,
  Popover,
  ActionIcon,
  Flex,
  useMantineTheme,
} from "@mantine/core";
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
  const theme = useMantineTheme();
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
      styles={{
        dropdown: {
          border: `1px solid ${theme.colors.border[theme.colorScheme]}`,
        },
      }}
    >
      <Popover.Target>
        <ActionIcon
          disabled={isDisabled}
          size={"xs"}
          variant={"transparent"}
          onMouseDown={() => setIsMobileOpen((o) => !o)}
          sx={{
            color: theme.colors.pure[theme.colorScheme],
            "&[data-disabled]": {
              color:
                theme.colorScheme === "dark"
                  ? "#868e96 !important"
                  : "#797169 !important",
            },
          }}
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
              sx={{
                "&:hover": {
                  backgroundColor: theme.colors.contrast[theme.colorScheme],
                },
                "&:active": {
                  backgroundColor: theme.colors.contrast[theme.colorScheme],
                  transform: "none",
                },
              }}
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
      styles={{
        dropdown: {
          border: `1px solid ${theme.colors.border[theme.colorScheme]}`,
        },
      }}
    >
      <HoverCard.Target>
        <ActionIcon
          disabled={isDisabled}
          size={"xs"}
          variant={"transparent"}
          sx={{
            color: theme.colors.pure[theme.colorScheme],
            "&[data-disabled]": {
              color:
                theme.colorScheme === "dark"
                  ? "#868e96 !important"
                  : "#797169 !important",
            },
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
              sx={{
                "&:hover": {
                  backgroundColor: theme.colors.itemHover[theme.colorScheme],
                },
                "&:active": {
                  backgroundColor: theme.colors.itemHover[theme.colorScheme],
                  transform: "none",
                },
              }}
            >
              {emoji}
            </ActionIcon>
          ))}
        </Flex>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
