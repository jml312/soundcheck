import { UnstyledButton, Avatar, Text, Flex } from "@mantine/core";
import { getAvatarText } from "@/utils";

/**
 * @param {object} user - The user object
 * @param {object} comment - The comment object
 * @param {function} setComment - The setComment function
 * @param {object} commentInputRef - The commentInputRef object
 * @description A mention card component
 */
export default function MentionCard({
  user,
  comment,
  setComment,
  commentInputRef,
}) {
  const { userId, username, userImage } = user;
  return (
    <UnstyledButton
      key={userId}
      onClick={() => {
        const newText = `${comment.text.slice(
          0,
          comment.text.length - 1
        )}@${username} `;
        setComment({
          ...comment,
          text: newText,
          isMentioning: false,
        });
        setTimeout(() => {
          commentInputRef.current.focus();
        }, 0);
      }}
      w="94%"
      sx={(theme) => ({
        borderRadius: "0.5rem !important",
        transition: "all 0.1s ease-in-out",
        "&:hover": {
          backgroundColor: theme.colors.itemHover[theme.colorScheme],
        },
      })}
    >
      <Flex
        justify="start"
        align="center"
        p="0.5rem 0.5rem 0.5rem .7rem"
        gap="0.65rem"
      >
        <Avatar src={userImage} name={username} size={24}>
          {getAvatarText(username)}
        </Avatar>
        <Text color="white" fz={"0.95rem"} truncate>
          {username}
        </Text>
      </Flex>
    </UnstyledButton>
  );
}
