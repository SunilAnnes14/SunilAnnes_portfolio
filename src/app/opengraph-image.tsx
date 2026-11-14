import { ImageResponse } from "next/og";
import { profile } from "@/content/portfolio";

export const alt = `${profile.name} · ${profile.role} · portfolio with The Interview game`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card: name and pitch on the left, the Recruiter's CRT head on the right. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "radial-gradient(ellipse at 75% 30%, #2a2318 0%, #08090a 65%)",
          color: "#e7e5e4",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#fcd34d" }}>
            {profile.availability.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, marginTop: 18, color: "#fafaf9" }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 10, color: "#fde68a" }}>{profile.role}</div>
          <div style={{ display: "flex", fontSize: 26, marginTop: 30, color: "#a8a29e", lineHeight: 1.4 }}>
            A portfolio you have to survive. Sit across from the Recruiter, read the shotgun, unlock the dossier.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              padding: "14px 26px",
              border: "2px solid #f87171",
              borderRadius: 8,
              fontSize: 24,
              letterSpacing: 4,
              color: "#fee2e2",
              background: "#3b0f0c",
              alignSelf: "flex-start",
            }}
          >
            PLAY THE INTERVIEW →
          </div>
        </div>

        {/* CRT head */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 330,
              height: 280,
              borderRadius: 24,
              background: "#bdb59f",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 270,
                height: 200,
                borderRadius: 28,
                background: "radial-gradient(circle, #173826 0%, #030805 80%)",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 84,
                color: "#ffd166",
              }}
            >
              HIRE?
            </div>
          </div>
          <div style={{ display: "flex", width: 90, height: 40, background: "#7b7466" }} />
          <div style={{ display: "flex", width: 380, height: 90, background: "#1c1f24", borderRadius: "40px 40px 0 0", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 22, height: 90, background: "#7a1a1a" }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
