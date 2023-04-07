import { Text, Flex } from "@mantine/core";
import { VictoryPie } from "victory";

export default function StatGraph({ title, data, height }) {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        position: "relative",
        scrollSnapAlign: "center",
      }}
      h={height}
    >
      <Text
        color="white"
        fz="1.25rem"
        fw="bold"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {title}
      </Text>
      <VictoryPie
        labelPosition={"centroid"}
        labelPlacement="parallel"
        width={350}
        height={350}
        data={data}
        x="name"
        y="value"
        innerRadius={74}
        labelRadius={75}
        // colorScale="cool"
        // colorScale="grayscale"
        colorScale="qualitative"
        style={{
          labels: {
            fontSize: 15,
            fill: "white",
          },
        }}
      />
    </Flex>
  );
}
