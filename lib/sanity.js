import { createClient } from "@sanity/client";

export default createClient({
  projectId: "v9rcob59",
  dataset: "production",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: "v2021-03-25",
});
