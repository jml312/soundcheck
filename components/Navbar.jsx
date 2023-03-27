import {
  Title,
  Flex,
  Avatar,
  Menu,
  Group,
  Text,
  UnstyledButton,
  Navbar as MantineNavbar,
  createStyles,
  ActionIcon,
  Indicator,
} from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { BsChevronDown, BsHeadphones } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import Link from "next/link";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { MdOutlineNotifications } from "react-icons/md";
import NotificationModal from "./modals/NotificationModal";
import { useQuery } from "react-query";
import { getNotifications } from "@/actions";

const useStyles = createStyles((theme) => ({
  logoText: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontSize: "1.5rem",
    },
  },
}));

function Navbar({ children }) {
  const { data: session } = useSession();
  const [menuHover, setMenuHover] = useState(false);
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 480px)");
  const router = useRouter();

  // const { data: notifications } = useQuery({
  //   queryKey: "notifications",
  //   queryFn: () =>
  //     getNotifications({
  //       userId: session?.user?.id,
  //     }),
  //   enabled: Boolean(session?.user?.id),
  //   onSuccess: (data) => {
  //     setCurrentNotifications(data);
  //   },
  // });

  const [currentNotifications, setCurrentNotifications] = useState([]);

  const [
    notificationOpen,
    { open: openNotification, close: closeNotification },
  ] = useDisclosure(false);

  return (
    <>
      <NotificationModal
        open={notificationOpen}
        close={closeNotification}
        currentNotifications={currentNotifications}
        setCurrentNotifications={setCurrentNotifications}
      />
      <MantineNavbar
        width="100%"
        height={"5rem"}
        bg={"lightGray"}
        style={{
          position: "fixed",
          top: "0%",
          zIndex: 100,
        }}
      >
        <Flex
          w="100%"
          h="100%"
          justify={"space-between"}
          align={"center"}
          px={16}
        >
          {router.asPath === "/feed" ? (
            <Title
              color="white"
              style={{
                userSelect: "none",
              }}
              className={classes.logoText}
            >
              Soundcheck!
            </Title>
          ) : (
            <Link href={"/feed"} passHref>
              <Title
                color="white"
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
                className={classes.logoText}
              >
                Soundcheck!
              </Title>
            </Link>
          )}
          <Group spacing={currentNotifications?.length === 0 ? 4 : 14}>
            <Group position="center">
              <Indicator
                label={currentNotifications?.length || 0}
                disabled={
                  !currentNotifications || currentNotifications.length === 0
                }
                size={"1.1rem"}
                color={"lightGray"}
                inline
                withBorder
              >
                <ActionIcon
                  onClick={() => {}}
                  disabled={
                    !currentNotifications || currentNotifications.length === 0
                  }
                  sx={{
                    "&[data-disabled]": {
                      backgroundColor: "transparent",
                      border: "none",
                    },
                  }}
                >
                  <MdOutlineNotifications size={"1.5rem"} />
                </ActionIcon>
              </Indicator>
            </Group>

            <Menu
              trigger={isMobile ? "click" : "hover"}
              openDelay={50}
              closeDelay={100}
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              withinPortal
              onOpen={() => setMenuHover(true)}
              onClose={() => setMenuHover(false)}
            >
              <Menu.Target>
                <UnstyledButton
                  sx={() => ({
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    backgroundColor: menuHover ? "#141517" : "transparent",
                    "&:hover": {
                      backgroundColor: "#141517",
                    },
                  })}
                >
                  <Group spacing={8}>
                    <Avatar
                      src={session?.user?.image}
                      alt={session?.user?.name}
                      radius="xl"
                      size={20}
                      sx={(theme) => ({
                        outline: `1px solid ${theme.colors.lightWhite[8]}`,
                      })}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {session?.user?.name}
                    </Text>
                    <BsChevronDown size={"1rem"} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Link href="/my-profile" passHref>
                  <Menu.Item icon={<CgProfile size={"0.9rem"} stroke={1.5} />}>
                    Profile
                  </Menu.Item>
                </Link>

                <Link href="/discover" passHref>
                  <Menu.Item
                    icon={<BsHeadphones size={"0.9rem"} stroke={1.5} />}
                  >
                    Discover
                  </Menu.Item>
                </Link>

                <Menu.Divider />
                <Menu.Item
                  onClick={() => signOut()}
                  icon={<FaSignOutAlt size={"0.9rem"} stroke={1.5} />}
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </MantineNavbar>
      {children}
    </>
  );
}

export default Navbar;
