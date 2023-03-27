import NotificationCard from "../cards/NotificationCard";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import dayjs from "dayjs";
import { Drawer, Modal, ScrollArea, Button, Stack } from "@mantine/core";

export default function NotificationModal({ opened, close }) {
  const NUM = 12;
  return (
    <Drawer
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      // opened
      position="left"
      // position="bottom"
      // position="right"
      centered
      // opened={opened}
      onClose={close}
      trapFocus={false}
      // size="25%"
      size="21.75rem"
      withCloseButton={false}
      title={`${NUM} Notification${NUM > 1 ? "s" : ""}`}
      styles={
        {
          // body: {
          //   display: "flex",
          //   flexDirection: "column",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   height: "50%",
          //   width: "100%",
          //   position: "fixed",
          //   top: "50%",
          //   left: "50%",
          //   transform: "translate(-50%, -50%)",
          // },
        }
      }
    >
      <Stack w="100%" align={"center"} h="100%">
        <ScrollArea
          w={"100%"}
          type={"always"}
          // h={NUM === 1 ? "10.1rem" : "20.5rem"}
          // h="25%"
          // h="10%"
          // h={1}

          offsetScrollbars
          styles={{
            scrollbar: {
              "&, &:hover": {
                background: "transparent",
                borderRadius: "0.5rem",
              },
              '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                backgroundColor: "#474952",
              },
            },
            viewport: {
              display: "flex",
              flexDirection: "column",
              // rowGap: "10rem",
              // height: "1rem",
            },
          }}
        >
          <Stack
            spacing={"md"}
            align={"center"}
            justify="center"
            w="100%"
            // h={1}
          >
            {[...Array(NUM)].map((_, i) => (
              <NotificationCard
                key={i}
                type={
                  i % 3 === 0
                    ? "like"
                    : i % 3 === 1
                    ? "comment"
                    : i % 3 === 2
                    ? "follow"
                    : ""
                }
                postId={1}
                commentId={1}
                userId={1}
                username="username"
                userImage="https://images.unsplash.com/photo-1616161616161-1c1c1c1c1c1c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                createdAt={"1/2/3"}
                formattedCreatedAt={dayjs("2021-03-21T20:00:00.000Z").fromNow()}
              />
            ))}
          </Stack>
        </ScrollArea>

        <Button
          fullWidth
          color="red"
          variant={"light"}
          leftIcon={<IoMdRemoveCircleOutline />}
        >
          Clear all notifications
        </Button>
      </Stack>
    </Drawer>
  );
}
