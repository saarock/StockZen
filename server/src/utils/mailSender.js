import nodemailer from "nodemailer";

class NodeMailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL || "saarock200@gmail.com",
        pass: process.env.MAIL_PASSWORD || "vnrb fipf zwhu byqs",
      },
    });
  }

  // Simple reusable HTML template
  buildTemplate({ title, message, buttonText, buttonUrl, footer }) {
    const safeButton = buttonText && buttonUrl;

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title || "Notification"}</title>
</head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 22px rgba(16,24,40,0.08);">
          
          <tr>
            <td style="padding:22px 26px;background:#101540;color:#fff;">
              <div style="font-size:18px;font-weight:700;">${title || "Message"}</div>
              <div style="font-size:13px;opacity:0.9;margin-top:4px;">Please read the details below</div>
            </td>
          </tr>

          <tr>
            <td style="padding:26px;">
              <div style="font-size:15px;line-height:1.6;color:#111;">
                ${message || ""}
              </div>

              ${
                safeButton
                  ? `<div style="margin:22px 0 10px;">
                       <a href="${buttonUrl}"
                          style="display:inline-block;background:#101540;color:#fff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700;font-size:14px;">
                          ${buttonText}
                       </a>
                     </div>
                     <div style="font-size:12px;color:#667085;line-height:1.5;">
                       If the button doesn't work, copy and paste this link:<br/>
                       <span style="word-break:break-all;">${buttonUrl}</span>
                     </div>`
                  : ``
              }

              <hr style="border:none;border-top:1px solid #eef0f4;margin:22px 0;" />

              <div style="font-size:12px;color:#667085;line-height:1.6;">
                ${footer || "If you didn’t request this, you can safely ignore this email."}
              </div>
            </td>
          </tr>

        </table>

        <div style="max-width:600px;margin-top:14px;font-size:11px;color:#98a2b3;">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  async send({ from, to, subject, text, html }) {
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text: text || "Open this email in an HTML-compatible client.",
        html,
      });

      return {
        type: true,
        message: "Sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      console.log("Failed to send mail:", error.message);
      return {
        type: false,
        message: error.message || "Failed to send the mail",
      };
    }
  }

  // Example: Password reset email helper
  async sendPasswordResetEmail({ to, resetUrl, name = "User" }) {
    const subject = "Reset your password";
    const html = this.buildTemplate({
      title: "Password Reset",
      message: `
        <p style="margin:0 0 10px;">Hi <b>${name}</b>,</p>
        <p style="margin:0 0 10px;">
          We received a request to reset your password. Click the button below to continue.
        </p>
        <p style="margin:0;">This link will expire soon for security reasons.</p>
      `,
      buttonText: "Reset Password",
      buttonUrl: resetUrl,
      footer: "If you didn’t request a password reset, ignore this email.",
    });

    const text = `Hi ${name},\n\nReset your password using this link:\n${resetUrl}\n\nIf you didn’t request this, ignore this email.`;

    return this.send({
      from: process.env.MAIL,
      to,
      subject,
      text,
      html,
    });
  }
}

const nodeMailer = new NodeMailSender();
export default nodeMailer;
