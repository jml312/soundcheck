import { memo, useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import { Text } from "@mantine/core";

function WordCloud({ data, theme, isSmall }) {
  const options = useMemo(
    () => ({
      colors: [theme.colorScheme === "dark" ? theme.white : theme.black],
      deterministic: true,
      fontSizes: isSmall ? [15, 55] : [20, 60],
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 3,
      rotations: 25,
      scale: "linear",
      spiral: "archimedean",
      enableOptimizations: true,
      randomSeed: 25,
      enableTooltip: false,
      transitionDuration: 200,
    }),
    [theme.colorScheme]
  );

  const canvasAllowed =
    typeof document !== "undefined" &&
    document
      .createElement("canvas")
      .getContext("2d")
      .getImageData(0, 0, 1, 1)
      .data.every((v) => v === 0);
  if (!canvasAllowed) {
    return (
      <Text>
        Wordcloud requires access to canvas image data. Please allow access in
        your browser and reload the page.
      </Text>
    );
  }

  if (data?.length === 0) return "Nothing to show yet...";

  return <ReactWordcloud words={data} options={options} maxWords={25} />;
}

export default memo(WordCloud);
