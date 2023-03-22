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
  Tooltip,
  Indicator,
  useMantineTheme,
} from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { BsChevronDown, BsHeadphones } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import Link from "next/link";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { MdOutlineNotifications } from "react-icons/md";
import { useQuery } from "react-query";
import { getNotifications } from "@/actions";
import NotificationModal from "./modals/NotificationModal";

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
  const theme = useMantineTheme();

  const { data: notifications } = useQuery({
    queryKey: "notifications",
    queryFn: () =>
      getNotifications({
        userId: session?.user?.id,
      }),
  });

  const [
    notificationOpen,
    { open: openNotification, close: closeNotification },
  ] = useDisclosure(false);

  return (
    <>
      <NotificationModal open={notificationOpen} close={closeNotification} />
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
          {router.asPath.includes("/feed") ? (
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
            <Link href={`/feed?date=${dayjs().format("YYYY-MM-DD")}`} passHref>
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
          <Group
            spacing={!notifications || notifications.length === 0 ? 10 : 14}
          >
            <Group position="center">
              <Indicator
                label={notifications?.length || 0}
                size={"1.1rem"}
                color={"lightGray"}
                // color={theme.colors.spotify[8]}
                inline
                withBorder
                disabled={!notifications || notifications.length === 0}
              >
                <ActionIcon
                  onClick={() => {}}
                  disabled={!notifications || notifications.length === 0}
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
                      size={27}
                      sx={(theme) => ({
                        border: `1px solid ${theme.colors.lightWhite[8]}`,
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
