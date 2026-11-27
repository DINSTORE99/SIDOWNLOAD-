import {
  getUrl,
  setCors,
  tiktok,
} from "../lib/downloader.js";

export const config = {
  maxDuration: 15,
};

export default async function handler(req, res) {
  if (setCors(res)) return;

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      creator: "DINSTORE",
      platform: "tiktok",
      message: "Method not allowed",
    });
  }

  const url = getUrl(req);

  if (!url) {
    return res.status(400).json({
      success: false,
      creator: "DINSTORE",
      platform: "tiktok",
      message: "URL TikTok wajib diisi",
    });
  }

  try {
    const data = await tiktok(url);

    return res.status(200).json({
      success: true,
      creator: "DINSTORE",
      platform: "tiktok",
      ...data,
    });
  } catch (error) {
    console.error("TikTok API Error:", error);

    return res.status(500).json({
      success: false,
      creator: "DINSTORE",
      platform: "tiktok",
      message: error.message || "Gagal memproses TikTok",
    });
  }
}
