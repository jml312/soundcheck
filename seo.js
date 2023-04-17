/** Default App SEO */
export const DefaultSEO = {
  description:
    "Soundcheck is a social music app that allows you to share your favorite songs with friends and discover new music.",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: process.env.NEXT_PUBLIC_URL,
    title: "Soundcheck!",
    description:
      "Soundcheck is a social music app that allows you to share your favorite songs with friends and discover new music.",
    tags: ["music", "social", "app", "discover", "songs", "spotify"],
    site_name: "Soundcheck",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/logo/soundcheck.png`,
        width: 800,
        height: 600,
        alt: "Soundcheck!",
      },
    ],
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/logo/soundcheck.svg",
      type: "image/svg+xml",
      sizes: "any",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/logo/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/logo/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/logo/favicon-16x16.png",
    },
    {
      rel: "mask-icon",
      href: "/logo/safari-pinned-tab.svg",
      color: "#1C1D25",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      name: "msapplication-TileColor",
      content: "#ffffff",
    },
  ],
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "theme-color",
      media: "(prefers-color-scheme: dark)",
      content: "#eae9e7",
    },
    {
      name: "theme-color",
      media: "(prefers-color-scheme: light)",
      content: "#1a1b1e",
    },
  ],
};
