import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = async (to: string, code: string | null) => {
  const msg = {
    to,
    from: process.env.EMAIL_SENDER as string,
    subject: 'Twiter clone auth verification code',
    html: `<strong>${code}</strong>`
  };

  await sgMail.send(msg);
};
