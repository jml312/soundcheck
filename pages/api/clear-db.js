import client from "@/lib/sanity";

export default async function handle(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { secret } = req.query;

  if (secret !== process.env.API_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const postIDs = await client.fetch(`*[_type == "post"]._id`);
    postIDs.forEach(async (postID) => {
      await client.patch(postID).unset(["user", "likes", "comments"]).commit();
    });

    const userIDs = await client.fetch(`*[_type == "user"]._id`);
    userIDs.forEach(async (userID) => {
      await client
        .patch(userID)
        .unset([
          "recentlyPlayed",
          "discoverSongs",
          "posts",
          "likes",
          "comments",
          "following",
          "followers",
        ])
        .commit();
    });

    await client.delete({
      query: `*[_type == "post" || _type == "user"]`,
    });

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
