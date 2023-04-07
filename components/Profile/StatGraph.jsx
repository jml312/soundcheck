import { Box, Text, Flex } from "@mantine/core";
import { VictoryPie } from "victory";

// horizontal
export default function StatGraph({ isMobile, title, data }) {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        position: "relative",
      }}
    >
      <Box
        style={{
          transform: "translateY(5rem) scale(1.1)",
        }}
      >
        <Text
          color="white"
          fz="1.25rem"
          mb="1.25rem"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -150%)",
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
              fontSize: 14,
              fill: "white",
              fontWeight: "bold",
            },
            parent: {
              transform: "translateY(-2rem)",
            },
          }}
        />
      </Box>
    </Flex>
  );
}

// vertical
// export default function StatGraph({ isMobile, title, data }) {
//   return (
//     <Box
//       style={{
//         position: "relative",
//         scrollSnapAlign: "start",
//       }}
//       w={isMobile ? "100%" : "50%"}
//     >
//       <Text
//         color="white"
//         fz="1.25rem"
//         mb="1.25rem"
//         fw="bold"
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//         }}
//       >
//         {title}
//       </Text>
//       <VictoryPie
//         labelPosition={"centroid"}
//         labelPlacement="parallel"
//         width={350}
//         height={350}
//         data={data}
//         x="name"
//         y="value"
//         innerRadius={75}
//         labelRadius={110}
//         // colorScale="cool"
//         // colorScale="grayscale"
//         colorScale="qualitative"
//         style={{
//           labels: {
//             fontSize: 13,
//             fill: "white",
//             // fontWeight: "bold",
//           },
//         }}
//       />
//     </Box>
//   );
// }
