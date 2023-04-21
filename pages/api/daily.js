import client from "@/lib/sanity";
import { hasPostedYesterdayQuery, userQuery } from "@/lib/queries";
import dayjs from "dayjs";
import {  getTZDate } from "@/utils";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getRandom9To5 = () => {
  const today = getTZDate();
  const start = today.hour(9).minute(0).second(0);
  const end = today.hour(17).minute(0).second(0);
  const random = getTZDate(start + Math.random() * (end - start));
  return random;
};

export default async function handle(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { secret, testMode } = req.body;

  if (secret !== process.env.API_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // get all users
    const allUsers = await client.fetch(userQuery);
    allUsers.forEach(async ({ _id, notifications }) => {
      // check if user posted yesterday
      const hasPostedYesterday = await client.fetch(hasPostedYesterdayQuery, {
        userId: _id,
        currentDate: getTZDate().subtract(1, "day").format("YYYY-MM-DD"),
      });

      // set user streak to 0 if they didn't post yesterday
      // update discover songs
      // remove notifications that are not follows
      await client
        .patch(_id)
        .set({
          ...(!hasPostedYesterday && { postStreak: 0 }),
          notifications: notifications.filter(({ type }) => type === "follow"),
        })
        .commit();
    });

    // send emails to all users at random time between 9am and 5pm
    const sendAt = getRandom9To5().unix();
    await sgMail.sendMultiple({
      to: allUsers.map(({ email }) => email),
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Soundcheck! What are you listening to?",
      text: "Your daily reminder",
      html: `<strong>Make a post...</strong>
      <form action=${process.env.NEXT_PUBLIC_URL}>
          <input type="submit" value="Soundcheck!" style="background-color: #1a1b1e; border-radius: 0.5rem; color: #dad9d4; padding: .5rem;" />
      </form>
      `,
      ...(testMode !== "true" && {
        sendAt,
      }),
    });

    return res.status(200).json({
      message: "Success",
      sendAt: dayjs.unix(sendAt).format("YYYY-MM-DD HH:mm:ss"),
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}
