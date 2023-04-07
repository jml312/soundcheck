import { Modal, Flex, Avatar, Text } from "@mantine/core";
import { getAvatarText } from "@/utils";
import Link from "next/link";

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
    >
      {data?.map(({ userId, userImage, username }) => (
        <Link
          href={`/profile/${userId}`}
          passHref
          key={userId}
          w="100%"
          sx={{
            borderRadius: "0.5rem !important",
            transition: "all 0.1s ease-in-out",
            "&:hover": {
              backgroundColor: "#141517",
            },
          }}
        >
          <Flex
            justify="start"
            align="center"
            p="0.5rem 0.5rem 0.5rem .7rem"
            gap="0.65rem"
          >
            <Avatar
              src={userImage}
              alt={username}
              radius="xl"
              style={{
                outline: "1px solid #c0c1c4",
                zIndex: -1,
              }}
              size={24}
            >
              {getAvatarText(username)}
            </Avatar>
            <Text color="white" fz={"0.95rem"}>
              {username}
            </Text>
          </Flex>
        </Link>
      ))}
    </Modal>
  );
}
