import { createClient } from "@sanity/client";

const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: "v2021-03-25",
};

export default createClient(config);
