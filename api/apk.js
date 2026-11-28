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
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
        Accept:
          "application/vnd.android.package-archive,application/octet-stream,*/*",
        Referer: "https://sfile.co/",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal mengambil file APK dari server.",
      });
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/vnd.android.package-archive";

    const contentLength = response.headers.get("content-length");

    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="SIDOWNLOAD.apk"'
    );

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (!buffer.length) {
      return res.status(502).json({
        success: false,
        message: "File APK kosong.",
      });
    }

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("APK DOWNLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh APK.",
    });
  }
}
