import { createClient } from "@sanity/client";

export default createClient({
  projectId: "5eg64i0l",
  dataset:
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? "production"
      : "development",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: "v2021-03-25",
});
