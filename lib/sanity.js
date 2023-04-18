import { createClient } from "@sanity/client";
import dayjs from "dayjs";

export default createClient({
  projectId: "5eg64i0l",
  dataset:
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? "production"
      : "development",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_TOKEN,
  apiVersion: dayjs().format("YYYY-MM-DD"),
});
