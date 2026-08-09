import nodemailer from 'nodemailer';

let transporterPromise = null;

function buildTransporter() {
  if (process.env.SMTP_HOST) {
    return Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined
      })
    );
  }

  // No SMTP configured: use a disposable Ethereal inbox so OTP emails can
  // still be sent and previewed in development, mirroring how OAuth
  // providers are auto-disabled here when their env vars are missing.
  return nodemailer.createTestAccount().then((account) =>
    nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass }
    })
  );
}

function getTransporter() {
  if (!transporterPromise) transporterPromise = buildTransporter();
  return transporterPromise;
}

export async function sendMail({ to, subject, html, text }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Victor.io Solutions <no-reply@victorio.solutions>',
    to,
    subject,
    html,
    text
  });

  if (!process.env.SMTP_HOST) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[email:dev] SMTP not configured — preview "${subject}" to ${to}: ${previewUrl}`);
  }

  return info;
}

export async function sendOtpEmail(to, name, otp) {
  return sendMail({
    to,
    subject: 'Your Victor.io Solutions password reset code',
    text: `Hi ${name},\n\nYour password reset code is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;color:#0f172a">
        <p>Hi ${name},</p>
        <p>Use this code to reset your Victor.io Solutions password. It expires in <strong>10 minutes</strong>.</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;margin:24px 0;padding:16px;background:#f1f5f9;border-radius:12px">${otp}</p>
        <p style="color:#64748b;font-size:13px">If you didn't request this, you can safely ignore this email — your password will not be changed.</p>
      </div>
    `
  });
}
