const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || "https://gopullup.ng";

export function emailLayout(args: {
  preheader: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
}) {
  const site = SITE();
  const cta = args.cta
    ? `<tr><td style="padding:28px 0 8px;">
        <a href="${args.cta.href}" style="display:inline-block;background:#0d9488;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:16px;letter-spacing:0.02em;text-decoration:none;padding:14px 28px;border-radius:999px;">
          ${args.cta.label}
        </a>
      </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${args.title}</title>
  <!--[if mso]><style>body,table,td{font-family:Georgia,serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#e8eef1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${args.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e8eef1;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #d5dee4;">
          <tr>
            <td style="background:linear-gradient(135deg,#0b1c2c 0%,#1a3347 55%,#0e7490 100%);padding:28px 32px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9fd4d0;">PullUp</p>
              <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#ffffff;">${args.title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#0b1c2c;">
              ${args.bodyHtml}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${cta}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e8eef1;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#5a6a78;">
              Invite-only hangouts in Lagos &amp; Abuja · not dating, not networking.<br/>
              <a href="${site}" style="color:#0e7490;text-decoration:none;">gopullup.ng</a>
              · <a href="mailto:hello@gopullup.ng" style="color:#0e7490;text-decoration:none;">hello@gopullup.ng</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function p(text: string) {
  return `<p style="margin:0 0 16px;">${text}</p>`;
}

export function note(text: string) {
  return `<p style="margin:20px 0 0;padding:14px 16px;background:#f4f7f8;border-left:3px solid #0d9488;border-radius:0 10px 10px 0;font-size:14px;color:#1a3347;">${text}</p>`;
}

export function metaRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#5a6a78;width:38%;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#0b1c2c;font-weight:600;">${value}</td>
  </tr>`;
}
