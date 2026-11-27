import {
  getUrl,
  setCors,
} from "../lib/downloader.js";

export const config = {
  maxDuration: 15,
};

// ==========================================
// EXTRACT CAPCUT URL
// ==========================================

const extractCapCutUrl = (text) => {
  if (!text) return "";

  const value = String(text).trim();

  const match = value.match(
    /https?:\/\/(?:www\.)?(?:capcut\.com|capcut\.net|capcut\.cn)\/[^\s<>"']+/i
  );

  if (!match) {
    return "";
  }

  return match[0]
    .replace(/[.,!?;:)\]}]+$/g, "")
    .trim();
};

// ==========================================
// HANDLER
// ==========================================

export default async function handler(
  req,
  res
) {
  // ==========================================
  // CORS
  // ==========================================

  if (setCors(res)) return;

  res.setHeader(
    "Content-Type",
    "application/json"
  );

  // ==========================================
  // METHOD
  // ==========================================

  if (
    req.method !== "GET" &&
    req.method !== "POST"
  ) {
    return res.status(405).json({
      status: false,
      message:
        "Method not allowed",
    });
  }

  // ==========================================
  // GET / POST
  // ==========================================

  const rawUrl =
    getUrl(req);

  const url =
    extractCapCutUrl(rawUrl);

  if (!url) {
    return res.status(400).json({
      status: false,
      message:
        "URL CapCut wajib diisi atau URL CapCut tidak ditemukan.",
    });
  }

  // ==========================================
  // CALL CAPCUT API
  // ==========================================

  try {
    const encodedUrl =
      encodeURIComponent(url);

    const apiUrl =
      `https://api.siputzx.my.id/api/d/capcut?url=${encodedUrl}`;

    const response =
      await fetch(apiUrl, {
        method: "GET",

        headers: {
          Accept:
            "application/json",

          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        },
      });

    const text =
      await response.text();

    let data;

    try {
      data =
        JSON.parse(text);
    } catch {
      return res.status(502).json({
        status: false,
        message:
          "API CapCut mengembalikan response yang tidak valid.",
      });
    }

    // ========================================
    // API ERROR
    // ========================================

    if (
      !response.ok ||
      data?.status !== true
    ) {
      return res.status(
        response.status >= 400
          ? response.status
          : 404
      ).json({
        status: false,

        message:
          data?.message ||
          "Gagal memproses link CapCut.",
      });
    }

    // ========================================
    // AMBIL DATA
    // ========================================

    const capcutData =
      data?.data || {};

    const originalVideoUrl =
      capcutData?.originalVideoUrl ||
      "";

    // ========================================
    // DOWNLOAD URL TIDAK ADA
    // ========================================

    if (!originalVideoUrl) {
      return res.status(404).json({
        status: false,

        message:
          "Video CapCut tidak ditemukan.",
      });
    }

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      status: true,

      data: {
        code:
          capcutData?.code ||
          200,

        originalVideoUrl,
      },

      timestamp:
        data?.timestamp ||
        new Date().toISOString(),
    });

  } catch (error) {
    console.error(
      "CapCut API Error:",
      error
    );

    return res.status(500).json({
      status: false,

      message:
        error?.message ||
        "Gagal memproses CapCut.",
    });
  }
}
