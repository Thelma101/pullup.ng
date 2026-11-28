const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || "https://gopullup.ng";

export function emailLayout(args: {
  preheader: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
}) {
  const site = SITE();
  const cta = args.cta
    ? `<tr>
        <td style="padding:32px 0 8px;">
          <a href="${args.cta.href}"
            style="display:inline-block;background:#0d9488;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:10px;">
            ${args.cta.label}
          </a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${args.title}</title>
</head>
<body style="margin:0;padding:0;background:#eef3f6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${args.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef3f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 4px 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.04em;color:#0b1c2c;">
              PullUp<span style="color:#0d9488;">.ng</span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #d9e3ea;border-radius:16px;overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="height:4px;background:#0d9488;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:36px 36px 8px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.25;color:#0b1c2c;font-weight:700;">
                    ${args.title}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 36px 36px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#1a3347;">
                    ${args.bodyHtml}
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${cta}</table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:#5a6a78;">
              Lagos &amp; Abuja · invite-only tables<br/>
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
  return `<p style="margin:0 0 14px;">${text}</p>`;
}

export function note(text: string) {
  return `<p style="margin:18px 0 0;padding:14px 16px;background:#f4f7f8;border-radius:10px;font-size:14px;line-height:1.5;color:#1a3347;">${text}</p>`;
}

export function metaRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-top:1px solid #e8eef1;font-size:13px;color:#5a6a78;width:36%;">${label}</td>
    <td style="padding:10px 0;border-top:1px solid #e8eef1;font-size:14px;color:#0b1c2c;font-weight:600;">${value}</td>
  </tr>`;
}
