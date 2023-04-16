import {
  HoverCard,
  Popover,
  ActionIcon,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { VscReactions } from "react-icons/vsc";
import { useEffect, useCallback, useMemo } from "react";

/**
 * @param {boolean} isDisabled - The isDisabled boolean
 * @param {boolean} isMobileOpen - The isMobileOpen boolean
 * @param {function} setIsMobileOpen - The setIsMobileOpen function
 * @param {function} setText - The setText function
 * @param {object} inputRef - The inputRef object
 * @param {boolean} isSmall - The isSmall boolean
 * @param {string} position - The position string
 * @description A component that renders an emoji picker
 */
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
  const emojis = useMemo(
    () => [
      { value: "🔥", code: 56613 },
      { value: "❤️", code: 65039 },
      { value: "😍", code: 56845 },
      { value: "😭", code: 56877 },
      { value: "😂", code: 56834 },
      { value: "🤦", code: 56614 },
      { value: "🤔", code: 56596 },
      { value: "🤷", code: 56631 },
    ],
    []
  );
  const getNewText = useCallback(
    (prevText, emoji) => {
      if (!prevText) return emoji;
      if (
        emojis
          .map(({ code }) => code)
          .includes(prevText.slice(-1).charCodeAt(0))
      )
        return prevText + emoji;
      return prevText + " " + emoji;
    },
    [emojis]
  );

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
          {emojis.map(({ value: emoji }, idx) => (
            <ActionIcon
              key={idx}
              onMouseDown={() => {
                setText((prev) => ({
                  ...prev,
                  text: getNewText(prev.text, emoji),
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
          {emojis.map(({ value: emoji }, idx) => (
            <ActionIcon
              key={idx}
              onMouseDown={() => {
                setText((prev) => ({
                  ...prev,
                  text: getNewText(prev.text, emoji),
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
