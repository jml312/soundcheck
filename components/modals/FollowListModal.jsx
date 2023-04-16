import { Modal, Flex, Avatar, Text } from "@mantine/core";
import { getAvatarText } from "@/utils";
import Link from "next/link";

/**
 * @param {boolean} opened - The opened boolean
 * @param {function} close - The close function
 * @param {string} title - The title string
 * @param {array} data - The data array
 * @description A follow list modal component
 */
export default function FollowListModal({ opened, close, title, data }) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={title}
      centered
      className="profile-modal"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      styles={{
        root: {
          "& .mantine-ScrollArea-thumb": {
            zIndex: 2,
          },
        },
        header: {
          zIndex: 1,
        },
      }}
    >
      {data?.map(({ userId, userImage, username }) => (
        <Link href={`/profile/${userId}`} passHref key={userId}>
          <Flex
            w={"100%"}
            justify="start"
            align="center"
            p="0.5rem 0.5rem 0.5rem .7rem"
            gap="0.65rem"
            sx={(theme) => ({
              borderRadius: "0.5rem !important",
              transition: "all 0.1s ease-in-out",
              "&:hover": {
                backgroundColor: theme.colors.itemHover[theme.colorScheme],
              },
            })}
          >
            <Avatar src={userImage} alt={username} size={24}>
              {getAvatarText(username)}
            </Avatar>
            <Text fz={"0.95rem"}>{username}</Text>
          </Flex>
        </Link>
      ))}
    </Modal>
  );
}
