import "server-only";

export interface Enquiry {
  name: string;
  email: string;
  company: string;
  link: string;
  projectTypes: string[];
  budget: string;
  timeline: string;
  message: string;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function rows(e: Enquiry): [string, string][] {
  return [
    ["Name", e.name],
    ["Email", e.email],
    ["Company", e.company],
    ["Link", e.link],
    ["Project", e.projectTypes.join(", ")],
    ["Budget", e.budget],
    ["Timeline", e.timeline],
  ].filter((r): r is [string, string] => Boolean(r[1]));
}

export function enquirySubject(e: Enquiry) {
  const what = e.projectTypes.length ? ` · ${e.projectTypes.join(", ")}` : "";
  return `New project enquiry from ${e.name}${what}`;
}

export function enquiryText(e: Enquiry) {
  return [...rows(e).map(([k, v]) => `${k}: ${v}`), "", e.message].join("\n");
}

/** Simple, inline-styled HTML that renders in every mail client. */
export function enquiryHtml(e: Enquiry) {
  const table = rows(e)
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:#8a8a7a;font-size:12px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;vertical-align:top">${k}</td>
          <td style="padding:6px 0;color:#151510;font-size:15px">${escape(v)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5efe2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:40px 28px">
      <p style="margin:0 0 6px;color:#8a8a7a;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Let’s talk · new enquiry</p>
      <h1 style="margin:0 0 28px;color:#151510;font-size:32px;font-weight:600;line-height:1.1">${escape(e.name)} wants to build something.</h1>
      <table style="border-collapse:collapse;margin-bottom:28px">${table}</table>
      <div style="padding:20px 22px;background:#fff;border-radius:14px;color:#151510;font-size:15px;line-height:1.6;white-space:pre-wrap">${escape(e.message)}</div>
      <p style="margin:28px 0 0;color:#8a8a7a;font-size:13px">Reply to this email to answer ${escape(e.name)} directly.</p>
    </div>
  </body>
</html>`;
}
