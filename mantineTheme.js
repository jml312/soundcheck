/** Global App Theme and Styles */
export const getMantineTheme = (colorScheme) => {
  const themeValues = (lightValue, darkValue) =>
    colorScheme === "dark" ? darkValue : lightValue;

  return {
    globalStyles: () => ({
      "*": {
        userSelect: "none",
      },
      a: {
        textDecoration: "none",
      },
      "input::placeholder": {
        fontWeight: "normal",
      },
    }),
    white: "#e5e4e1",
    black: "#1a1b1e",
    loader: "bars",
    colorScheme,
    colors: {
      spotify: {
        main: "rgba(29, 185, 84, 1)",
        lighter: "rgba(29, 185, 84, 0.9)",
      },
      pure: {
        dark: "#fff",
        light: "#000",
      },
      contrast: {
        dark: "#25262b",
        light: "#dad9d4",
      },
      iconDisabled: {
        dark: "#c1c2c5 !important",
        light: "#3e3d3a !important",
      },
      notificationsDisabled: {
        dark: "#6d747b",
        light: "#928b84",
      },
      itemHover: {
        dark: "#2f3035",
        light: "#d0cfca",
      },
      border: {
        dark: "rgba(255, 255, 255, 0.5)",
        light: "rgba(0, 0, 0, 0.5)",
      },
      dimmed: {
        dark: "#8b8d91",
        light: "#74726e",
      },
      placeholder: {
        dark: "#7d7f8a !important",
        light: "#828075 !important",
      },
      cardDivider: {
        dark: "#c0c1c4",
        light: "#3f3e3b",
      },
      lightBtn: {
        bg: {
          abled: {
            dark: "#1f2125",
            light: "#e0deda",
          },
          hover: {
            dark: "#26282d !important",
            light: "#d9d7d2 !important",
          },
        },
        color: {
          base: {
            dark: "#919397",
            light: "#6e6c68",
          },
          multiple: {
            dark: "rgba(255, 255, 255, 0.95)",
            light: "rgba(0, 0, 0, 0.95)",
          },
        },
      },
    },
    primaryColor: "spotify",
    components: {
      Text: {
        styles: (theme) => ({
          root: {
            color: theme.colors.pure[colorScheme],
          },
        }),
      },
      Button: {
        defaultProps: (theme) => ({
          loaderProps: {
            color: theme.colors.pure[colorScheme],
          },
        }),
        styles: (theme) => ({
          root: {
            color: theme.colors.pure[colorScheme],
            backgroundColor: theme.colors.spotify.lighter,
            "&:hover": {
              backgroundColor: theme.colors.spotify.main,
            },
          },
        }),
      },
      Avatar: {
        defaultProps: {
          radius: "xl",
        },
        styles: (theme) => ({
          root: {
            outline: `1px solid ${theme.colors.cardDivider[colorScheme]}`,
          },
          placeholder: {
            color: themeValues("#161310", "#e9ecef"),
            backgroundColor: themeValues("#e0deda", "#1f2125"),
          },
        }),
      },
      Loader: {
        defaultProps: (theme) => ({
          color: theme.colors.spotify.main,
        }),
      },
      Tooltip: {
        defaultProps: (theme) => ({
          withinPortal: true,
          color: theme.colors.contrast[colorScheme],
        }),
        styles: (theme) => ({
          tooltip: {
            color: theme.colors.pure[colorScheme],
            border: "none",
            outline: `1px solid ${theme.colors.border[colorScheme]}`,
          },
        }),
      },
      ScrollArea: {
        defaultProps: {
          offsetScrollbars: true,
          type: "always",
        },
        styles: {
          scrollbar: {
            "&, &:hover": {
              background: "transparent",
              borderRadius: "0.5rem",
            },
            '&[data-orientation="vertical"]': {
              backgroundColor: "transparent !important",
            },
            '&[data-orientation="vertical"]:hover': {
              backgroundColor: "transparent !important",
            },
            '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
              backgroundColor: themeValues("#b8b6ad", "#474952"),
            },
          },
          corner: { display: "none" },
          viewport: {
            scrollSnapType: "y mandatory",
          },
        },
      },
      Modal: {
        styles: (theme) => ({
          content: {
            borderRadius: ".5rem !important",
          },
          header: {
            color: theme.colors.pure[colorScheme],
          },
          close: {
            color: theme.colors.pure[colorScheme],
            "&:hover": {
              backgroundColor: theme.colors.contrast[colorScheme],
            },
          },
        }),
      },
      SegmentedControl: {
        defaultProps: {
          radius: 8,
        },
        styles: (theme) => ({
          root: {
            backgroundColor: "transparent !important",
          },
          indicator: {
            backgroundColor: theme.colors.contrast[theme.colorScheme],
          },
          label: {
            color:
              theme.colorScheme === "dark"
                ? "rgba(255,255,255,0.8)"
                : "rgba(0,0,0,0.8)",
            transition: "color 0.1s ease",
            "&:hover": {
              color: theme.colors.pure[theme.colorScheme],
            },
            "&[data-active]": {
              color: theme.colors.pure[theme.colorScheme],
            },
          },
          control: {
            "&:not(:first-of-type)": {
              borderColor: theme.colors.cardDivider[theme.colorScheme],
            },
          },
        }),
      },
    },
  };
};
