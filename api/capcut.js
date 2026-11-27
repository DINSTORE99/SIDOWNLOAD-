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
// DINSTORE RESPONSE
// ==========================================

const successResponse = (
  res,
  downloadUrl
) => {
  return res.status(200).json({
    success: true,

    creator: "DINSTORE",

    platform: "capcut",

    message:
      "Berhasil mendapatkan video CapCut.",

    data: {
      download:
        downloadUrl,
    },
  });
};

const errorResponse = (
  res,
  statusCode,
  message
) => {
  return res.status(statusCode).json({
    success: false,

    creator: "DINSTORE",

    platform: "capcut",

    message,
  });
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
    return errorResponse(
      res,
      405,
      "Metode tidak diizinkan."
    );
  }

  // ==========================================
  // AMBIL URL
  // ==========================================

  const rawUrl =
    getUrl(req);

  const url =
    extractCapCutUrl(rawUrl);

  if (!url) {
    return errorResponse(
      res,
      400,
      "URL CapCut tidak ditemukan."
    );
  }

  // ==========================================
  // REQUEST API CAPCUT
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
      return errorResponse(
        res,
        502,
        "Response dari server CapCut tidak valid."
      );
    }

    // ========================================
    // API CAPCUT GAGAL
    // ========================================

    if (
      !response.ok ||
      data?.status !== true
    ) {
      return errorResponse(
        res,
        404,
        "Gagal mendapatkan video CapCut."
      );
    }

    // ========================================
    // DATA CAPCUT
    // ========================================

    const capcutData =
      data?.data || {};

    const originalVideoUrl =
      capcutData?.originalVideoUrl ||
      "";

    // ========================================
    // LINK DOWNLOAD TIDAK ADA
    // ========================================

    if (!originalVideoUrl) {
      return errorResponse(
        res,
        404,
        "Video CapCut tidak ditemukan."
      );
    }

    // ========================================
    // BERHASIL
    // ========================================

    return successResponse(
      res,
      originalVideoUrl
    );

  } catch (error) {
    console.error(
      "DINSTORE CAPCUT ERROR:",
      error
    );

    return errorResponse(
      res,
      500,
      "Terjadi kesalahan saat memproses CapCut."
    );
  }
}
