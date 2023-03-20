import {
  Modal,
  SegmentedControl,
  Stack,
  LoadingOverlay,
  Button,
  Center,
  Box,
} from "@mantine/core";
import { MdOutlineDateRange } from "react-icons/md";
import { DatePickerInput } from "@mantine/dates";
import axios from "axios";
import { getDayInterval } from "@/utils/getDayInterval";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { RiUserFollowFill, RiGroupFill } from "react-icons/ri";
import { RxReset } from "react-icons/rx";

export default function FilterModal({
  opened,
  close,
  feedFilter,
  setFeedFilter,
  posts,
  setPosts,
  formattedDate,
  session,
}) {
  const { isLoading } = useQuery({
    queryKey: [
      "search",
      {
        date: dayjs(feedFilter.date).format("YYYY-MM-DD"),
        type: feedFilter.type,
      },
    ],
    queryFn: async () => {
      const { startDate, endDate } = getDayInterval(feedFilter.date);
      const { data } = await axios.get("/api/protected/search", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          name: session?.user?.name,
          type: feedFilter.type,
        },
      });
      return {
        userPost: data.userPost || null,
        feedPosts:
          data.feedPosts.filter(({ isFollowing }) =>
            feedFilter.type === "Following" ? isFollowing : true
          ) || [],
      };
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
    retryDelay: 0,
    notifyOnChangeProps: ["data"],
    onSuccess: (data) => {
      close();
      setPosts({
        ...posts,
        userPost: data?.userPost || null,
        feedPosts: data?.feedPosts || [],
      });
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!isLoading) {
          close();
        }
      }}
      title={`${feedFilter.type} on ${formattedDate}`}
      returnFocus={false}
      centered
      size="sm"
      padding={"xl"}
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
    >
      <LoadingOverlay visible={isLoading} />
      <Stack w={"100%"} align={"center"} justify={"center"} spacing={"lg"}>
        <DatePickerInput
          w={"100%"}
          icon={<MdOutlineDateRange />}
          dropdownType="modal"
          label="Pick date"
          placeholder="Pick date"
          value={feedFilter.date}
          onChange={(date) => {
            setFeedFilter({
              ...feedFilter,
              date: dayjs(date).toDate(),
            });
          }}
          mx="auto"
          maw={400}
          minDate={dayjs("2023-03-11").toDate()} // TODO: Change to first post date
          maxDate={dayjs().toDate()}
          styles={{
            month: {
              ".mantine-DatePickerInput-day[data-weekend]": {
                color: "#c1c2c5 !important",
              },
              ".mantine-DatePickerInput-day[data-weekend][data-selected]": {
                color: "#ffffff !important",
              },
            },
            input: {
              marginTop: ".2rem",
            },
          }}
        />
        <SegmentedControl
          transitionDuration={0}
          data={[
            {
              value: "Everyone",
              label: (
                <Center>
                  <RiGroupFill size=".65rem" />
                  <Box ml={4}>Everyone</Box>
                </Center>
              ),
            },
            {
              value: "Following",
              label: (
                <Center>
                  <RiUserFollowFill size=".7rem" />
                  <Box ml={4}>Following</Box>
                </Center>
              ),
            },
          ]}
          value={feedFilter.type}
          onChange={(value) => {
            setFeedFilter({
              ...feedFilter,
              type: value,
            });
          }}
        />

        <Button
          onClick={() => {
            setFeedFilter({
              date: dayjs().toDate(),
              type: "Everyone",
            });
          }}
          color="gray"
          variant="light"
          fullWidth
          leftIcon={<RxReset size=".7rem" />}
          disabled={
            dayjs(feedFilter.date).isSame(dayjs(), "day") &&
            feedFilter.type === "Everyone"
          }
        >
          Reset
        </Button>
      </Stack>
    </Modal>
  );
}
