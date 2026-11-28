export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan.",
      });
    }

    const apkUrl =
      "https://raw.githubusercontent.com/DINSTORE99/SIDOWNLOAD-/main/public/SIDOWNLOAD.apk";

    const response = await fetch(apkUrl);

    if (!response.ok) {
      return res.status(404).json({
        success: false,
        message: "APK tidak ditemukan.",
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    if (
      buffer.length < 4 ||
      buffer[0] !== 0x50 ||
      buffer[1] !== 0x4b
    ) {
      return res.status(502).json({
        success: false,
        message: "File yang diterima bukan APK yang valid.",
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
      buffer.length.toString()
    );

    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.status(200).send(buffer);

  } catch (error) {
    console.error("APK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh APK.",
    });
  }
}
