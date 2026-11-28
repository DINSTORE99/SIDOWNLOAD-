const SFILE_DOWNLOAD_URL =
  "https://sfile.co/download/StLK5URmkeE?fid=U3RMSzVVUm1rZUUma2V5PUYxRDI1OUY0MzlBN0ZFMzc-";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan.",
      });
    }

    const response = await fetch(SFILE_DOWNLOAD_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
        Accept:
          "application/vnd.android.package-archive,application/octet-stream,*/*",
        Referer: "https://sfile.co/StLK5URmkeE",
        Connection: "keep-alive",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal mengambil file APK dari SFile.",
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (!buffer.length) {
      return res.status(502).json({
        success: false,
        message: "File APK kosong.",
      });
    }

    /*
     * APK adalah ZIP archive.
     * File ZIP biasanya dimulai dengan:
     * 50 4B 03 04
     * atau signature ZIP lainnya.
     */

    const isZip =
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (
        (
          buffer[2] === 0x03 &&
          buffer[3] === 0x04
        ) ||
        (
          buffer[2] === 0x05 &&
          buffer[3] === 0x06
        ) ||
        (
          buffer[2] === 0x07 &&
          buffer[3] === 0x08
        )
      );

    if (!isZip) {
      console.error(
        "SFILE TIDAK MENGEMBALIKAN APK. Content-Type:",
        response.headers.get("content-type")
      );

      return res.status(502).json({
        success: false,
        message:
          "Server SFile tidak mengembalikan file APK asli. Silakan coba lagi.",
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.android.package-archive"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="SIDOWNLOAD.apk"'
    );

    res.setHeader("Content-Length", buffer.length);

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("APK DOWNLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh APK.",
    });
  }
}
