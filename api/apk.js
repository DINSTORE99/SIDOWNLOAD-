const SFILE_URL = "https://sfile.co/ZwWpRuE1trX";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan.",
      });
    }

    // Buka halaman SFile
    const pageResponse = await fetch(SFILE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!pageResponse.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal membuka halaman APK.",
      });
    }

    const html = await pageResponse.text();

    // Cari URL download asli dari halaman SFile
    const match = html.match(
      /data-dw-url=["']([^"']+)["']/i
    );

    if (!match) {
      return res.status(502).json({
        success: false,
        message: "Link download APK tidak ditemukan.",
      });
    }

    const downloadUrl = new URL(
      match[1],
      "https://sfile.co"
    ).href;

    // Ambil file APK
    const apkResponse = await fetch(downloadUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
        Accept:
          "application/vnd.android.package-archive,application/octet-stream,*/*",
        Referer: SFILE_URL,
      },
      redirect: "follow",
    });

    if (!apkResponse.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal mengambil file APK.",
      });
    }

    const buffer = Buffer.from(
      await apkResponse.arrayBuffer()
    );

    // Pastikan bukan HTML
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x50 ||
      buffer[1] !== 0x4b
    ) {
      return res.status(502).json({
        success: false,
        message: "File yang diterima bukan APK asli.",
      });
    }

    // Kirim APK ke browser
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
      buffer.length.toString()
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
