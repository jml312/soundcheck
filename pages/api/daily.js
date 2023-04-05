import client from "@/lib/sanity";
import { hasPostedYesterdayQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { getDayInterval } from "@/utils";
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

  const { secret, testMode } = req.query;

  if (secret !== process.env.API_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const sendAt = getRandom9To5().unix();
    const userIDs = await client.fetch(`*[_type == "user"] {_id, email}`);
    userIDs.forEach(async ({ _id, email }) => {
      // const { startDate: yesterdayStart, endDate: yesterdayEnd } =
      //   getDayInterval(dayjs().subtract(1, "day"));
      // const hasPostedYesterday = await client.fetch(hasPostedYesterdayQuery, {
      //   userId: _id,
      //   yesterdayStart: yesterdayStart.toISOString(),
      //   yesterdayEnd: yesterdayEnd.toISOString(),
      // });
      // const recommendations = await getDiscoverSongs({
      //   userId: _id,
      //   accessToken: session.user.accessToken,
      //   client,
      // });
      // await client
      //   .patch(_id)
      //   .set(hasPostedYesterday ? {} : { postStreak: 0 })
      //   .set({ discoverSongs: recommendations })
      //   // .unset(["notifications"])
      //   // .unset(["notifications[type != 'follow']"])
      //   .commit();

      await sgMail.send({
        to: email,
        from: "scheckad123@gmail.com",
        subject: "Your daily reminder",
        text: "Your daily reminder",
        html: `<strong>Your daily reminder</strong>`,
        sendAt: testMode === "true" ? undefined : sendAt,
      });
    });

    return res.status(200).json({ message: "Success" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
