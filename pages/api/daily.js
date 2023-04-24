import client from "@/lib/sanity";
import { hasPostedTodayQuery, userQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { getTZDate } from "@/utils";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getRandom9To5 = () => {
  const tomorrow = getTZDate().add(1, "d").startOf("day");
  const startHour = 9;
  const endHour = 17;
  const randomMinutes = Math.floor(Math.random() * (endHour - startHour) * 60);
  return tomorrow.add(startHour, "hour").add(randomMinutes, "minute");
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

    if (allUsers?.length === 0) {
      return res.status(200).json({ message: "No users found" });
    }

    allUsers.forEach(async ({ _id: userId, notifications }) => {
      // check if user posted yesterday
      const hasPostedToday = await client.fetch(hasPostedTodayQuery, {
        userId,
        currentDate: getTZDate().format("YYYY-MM-DD"),
      });
      // set user streak to 0 if they didn't post yesterday
      // update discover songs
      // remove notifications that are not follows
      await client
        .patch(userId)
        .set({
          ...(!hasPostedToday && { postStreak: 0 }),
          notifications: notifications.filter(({ type }) => type === "follow"),
        })
        .commit();
    });

    // send emails to all users at random time between 9am and 5pm
    const subject = "Soundcheck! What are you listening to?";
    const text = `
      Hey there,

      It's time to log in to Soundcheck! and share what you listen to with the world. You never know, you might just stumble upon your next all-time favorite tune! Login and Post a Song ( ${process.env.NEXT_PUBLIC_URL} )

      © 2023 Soundcheck!. All rights reserved.
    `;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
            <title>
              ${subject}
            </title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
              <tr>
                  <td align="center" style="padding: 40px 0 0 0;">
                    <img src="${process.env.NEXT_PUBLIC_URL}/logo/soundcheck-seo.png" alt="Soundcheck! Logo" width="300" style="display: block;">
                  </td>
              </tr>
              <tr>
                  <td style="padding: 30px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0; color: #000;">
                              Hey there,
                              <br>
                              <br>
                              It's time to log in to Soundcheck! and share what you listen to with the world. You never know, you might just stumble upon your next all-time favorite tune!
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center; padding: 30px 0 0 0;">
                              <a href="${process.env.NEXT_PUBLIC_URL}" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; background-color: #1a1b1e; padding: 12px 20px; border-radius: 4px;">
                              Login and Post a Song
                              </a>
                          </td>
                        </tr>
                    </table>
                  </td>
              </tr>
            </table>
        </body>
      </html>
    `;
    const sendAt = getRandom9To5().unix();

    await sgMail.send({
      to: allUsers.map(({ email }) => email),
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
      html,
      isMultiple: allUsers?.length > 1,
      ...(testMode !== "true" && { sendAt }),
    });

    return res.status(200).json({
      message: "Success",
      sendAt,
      sendAtFormatted: dayjs.unix(sendAt).format("YYYY-MM-DD hh:mm:ssa"),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
