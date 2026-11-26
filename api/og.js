import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};
export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#08090a",
          color: "white",
          fontFamily: "Arial",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "#1ed760",
            opacity: 0.08,
            filter: "blur(100px)",
            top: "-250px",
            left: "-150px",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "35px",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "35px",
              background: "#050607",
              border: "3px solid #1ed760",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "105px",
              fontWeight: 800,
              color: "#1ed760",
              boxShadow: "0 0 45px rgba(30,215,96,.35)",
            }}
          >
            S
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "70px",
                fontWeight: 800,
                letterSpacing: "-3px",
              }}
            >
              SIDOWNLOAD
            </div>

            <div
              style={{
                fontSize: "34px",
                color: "#b7b7b7",
                marginTop: "5px",
              }}
            >
              Media Downloader
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            marginTop: "55px",
            fontSize: "31px",
            color: "#d5d5d5",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Download Video & Audio TikTok, Instagram,
          Facebook, CapCut, Spotify, YouTube
        </div>

        <div
          style={{
            marginTop: "10px",
            fontSize: "31px",
            color: "#1ed760",
            fontWeight: 700,
          }}
        >
          Tanpa Ribet
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            fontSize: "30px",
            color: "#1ed760",
          }}
        >
          🔗 sidownload.dinn.my.id
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
