import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.fullName}, front-end developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The link preview LinkedIn, Slack etc. show when the site is shared. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 75% 110%, #2a3550 0%, #0b0b09 60%)",
          color: "#f5efe2",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", opacity: 0.6 }}>
          {site.location}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1 }}>{site.fullName}</div>
          <div style={{ marginTop: 28, fontSize: 40, opacity: 0.85 }}>
            Front-end developer · fast, accessible web apps
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {site.stack.slice(0, 5).map((s) => (
            <div
              key={s}
              style={{ display: "flex", padding: "8px 22px", border: "1.5px solid rgba(245,239,226,0.3)", borderRadius: 999, fontSize: 24 }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
