import {
  getUrl,
  setCors,
  spotify,
} from "../lib/downloader.js";

export const config = {
  maxDuration: 15,
};

export default async function handler(req, res) {
  if (setCors(res)) return;

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method not allowed",
    });
  }

  const url = getUrl(req);

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "URL Spotify wajib diisi",
    });
  }

  try {
    const data = await spotify(url);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Spotify API Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message || "Gagal memproses Spotify",
    });
  }
}
