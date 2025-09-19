import nodemailer from 'nodemailer';

export async function sendGmail({
  to,
  subject,
  html,
  text
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  // Les identifiants doivent être définis dans les variables d'environnement
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) {
    throw new Error('GMAIL_USER et GMAIL_PASS doivent être définis dans .env.local');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
}
