import client from "@/lib/sanity";
import { hasPostedYesterdayQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { getDayInterval } from "@/utils/getDayInterval";
import { getDiscoverSongs } from "@/actions";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getRandom9To5 = () => {
  const today = dayjs();
  const start = today.hour(9).minute(0).second(0);
  const end = today.hour(17).minute(0).second(0);
  const random = dayjs(start + Math.random() * (end - start));
  return random;
};

export default async function handle(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { secret } = req.query;

  if (secret !== process.env.API_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userIDs = await client.fetch(`*[_type == "user"] {_id, email}`);
    userIDs.forEach(async ({ _id, email }) => {
      const { startDate: yesterdayStart, endDate: yesterdayEnd } =
        getDayInterval(dayjs().subtract(1, "day"));
      const hasPostedYesterday = await client.fetch(hasPostedYesterdayQuery, {
        name: _id,
        yesterdayStart: yesterdayStart.toISOString(),
        yesterdayEnd: yesterdayEnd.toISOString(),
      });

      const recommendations = await getDiscoverSongs({
        name: session.user.name,
        accessToken: session.user.accessToken,
        client,
      });

      await client
        .patch(_id)
        .set({
          discoverSongs: recommendations,
        })
        .set(hasPostedYesterday ? {} : { postStreak: 0 })
        .unset(["recentlyPlayed"])
        .commit();

      const msg = {
        to: email,
        from: "",
        subject: "Your daily reminder",
        text: "Your daily reminder",
        html: `<strong>Your daily reminder</strong>`,
        sendAt: getRandom9To5().unix(),
      };
      await sgMail.send(msg);
    });

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
