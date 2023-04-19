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
  useMantineTheme,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { BsChevronDown, BsHeadphones, BsMoonStars } from "react-icons/bs";
import { FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import { CgProfile, CgSun } from "react-icons/cg";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Link from "next/link";
import { MdOutlineNotifications } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import NotificationModal from "./modals/NotificationModal";
import { getAvatarText } from "@/utils";
import { useNotifications } from "@/contexts/NotificationsContext";
import Logo from "./Logo";

const useStyles = createStyles((theme) => ({
  logoText: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontSize: "1.5rem",
    },
  },
}));

/**
 * @param {object} children - The children object
 * @description A navbar component
 */
export default function Navbar({ children }) {
  const { data: session } = useSession();
  const { classes } = useStyles();
  const [menuOpened, setMenuOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 480px)");
  const theme = useMantineTheme();
  const { toggleColorScheme } = useMantineColorScheme();
  const {
    notifications,
    setNotifications,
    isNotificationLoading,
    setIsNotificationLoading,
  } = useNotifications();
  const isNotificationsDisabled =
    !notifications || notifications.length === 0 || isNotificationLoading;
  const [
    notificationOpen,
    { open: openNotification, close: closeNotification },
  ] = useDisclosure(false);

  return (
    <>
      <NotificationModal
        opened={notificationOpen}
        close={closeNotification}
        notifications={notifications}
        setNotifications={setNotifications}
        session={session}
        isLoading={isNotificationLoading}
        setIsLoading={setIsNotificationLoading}
      />
      <MantineNavbar
        width="100%"
        height={"5rem"}
        bg={theme.colors.contrast[theme.colorScheme]}
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
          <Link href={"/feed"} passHref>
            <Flex align={"center"} justify={"center"} gap={".5rem"}>
              <Logo />
              {!isMobile && (
                <Title
                  color={theme.colors.pure[theme.colorScheme]}
                  style={{
                    cursor: "pointer",
                  }}
                  className={classes.logoText}
                >
                  Soundcheck!
                </Title>
              )}
            </Flex>
          </Link>
          <Group spacing={2}>
            <Tooltip position="bottom-end" label="theme">
              <ActionIcon
                color={theme.colors.pure[theme.colorScheme]}
                variant="transparent"
                onClick={toggleColorScheme}
                style={{
                  transform: "translateX(.15rem)",
                }}
              >
                {theme.colorScheme === "dark" ? (
                  <CgSun size="1.125rem" />
                ) : (
                  <BsMoonStars size="1.125rem" />
                )}
              </ActionIcon>
            </Tooltip>

            <Group
              position="center"
              style={{
                transform: isNotificationsDisabled
                  ? "translateX(.15rem)"
                  : "translateX(.075rem)",
              }}
            >
              <Tooltip
                disabled={isNotificationsDisabled}
                position="bottom-end"
                label={"notifications"}
              >
                <Indicator
                  disabled={isNotificationsDisabled}
                  size={".475rem"}
                  color={theme.colors.spotify.main}
                  offset={3.5}
                >
                  <ActionIcon
                    onClick={openNotification}
                    disabled={isNotificationsDisabled}
                    color={theme.colors.pure[theme.colorScheme]}
                    variant="transparent"
                    sx={{
                      "&[data-disabled]": {
                        color:
                          theme.colors.notificationsDisabled[theme.colorScheme],
                        backgroundColor: "transparent",
                        border: "none",
                      },
                    }}
                  >
                    <MdOutlineNotifications size={"1.4rem"} />
                  </ActionIcon>
                </Indicator>
              </Tooltip>
            </Group>

            <Menu
              opened={menuOpened}
              onOpen={() => setMenuOpened(true)}
              onClose={() => setMenuOpened(false)}
              trigger={"hover"}
              openDelay={50}
              closeDelay={100}
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              withinPortal
              styles={{
                dropdown: {
                  backgroundColor: theme.colors.contrast[theme.colorScheme],
                  border: `1px solid ${theme.colors.border[theme.colorScheme]}`,
                },
                item: {
                  "&[data-hovered]": {
                    backgroundColor: theme.colors.itemHover[theme.colorScheme],
                  },
                },
                divider: {
                  borderTop: `0.0625rem solid ${
                    theme.colors.border[theme.colorScheme]
                  }`,
                },
              }}
            >
              <Menu.Target onClick={() => setMenuOpened(!menuOpened)}>
                <UnstyledButton
                  sx={{
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                  }}
                >
                  <Group spacing={8}>
                    <Avatar
                      src={session?.user?.image}
                      alt={session?.user?.name}
                      size={20}
                    >
                      {getAvatarText(session?.user?.name)}
                    </Avatar>
                    {!isMobile && (
                      <Text
                        weight={500}
                        size="sm"
                        sx={{ lineHeight: 1 }}
                        mr={3}
                      >
                        {session?.user?.name}
                      </Text>
                    )}
                    <BsChevronDown size={"1rem"} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Link href="/feed" passHref>
                  <Menu.Item
                    icon={<AiOutlineHome size={"0.9rem"} stroke={1.5} />}
                  >
                    Feed
                  </Menu.Item>
                </Link>

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

                <Link href="/search" passHref>
                  <Menu.Item
                    icon={<FaUserFriends size={"0.9rem"} stroke={1.5} />}
                  >
                    Search
                  </Menu.Item>
                </Link>

                <Menu.Divider />

                <Menu.Item
                  onClick={signOut}
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
