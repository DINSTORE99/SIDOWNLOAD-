const SFILE_PAGE_URL = "https://sfile.co/ZwWpRuE1trX";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan.",
      });
    }

    const page = await fetch(SFILE_PAGE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!page.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal membuka halaman APK SFile.",
      });
    }

    const html = await page.text();

    /*
     * Ambil data-wait download URL dari halaman SFile.
     */
    const match = html.match(
      /data-dw-url=["']([^"']+)["']/i
    );

    if (!match || !match[1]) {
      return res.status(502).json({
        success: false,
        message: "URL download APK SFile tidak ditemukan.",
      });
    }

    const downloadUrl = new URL(
      match[1],
      "https://sfile.co"
    ).href;

    const apkResponse = await fetch(downloadUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
        Accept:
          "application/vnd.android.package-archive,application/octet-stream,*/*",
        Referer: SFILE_PAGE_URL,
      },
      redirect: "follow",
    });

    if (!apkResponse.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal mengambil APK dari SFile.",
      });
    }

    const buffer = Buffer.from(
      await apkResponse.arrayBuffer()
    );

    /*
     * APK adalah ZIP.
     * File APK yang valid harus mempunyai ZIP signature.
     */
    const isApk =
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b;

    if (!isApk) {
      return res.status(502).json({
        success: false,
        message:
          "SFile belum mengembalikan file APK asli.",
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

    res.setHeader(
      "Content-Length",
      buffer.length
    );

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("APK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh APK.",
    });
  }
}
