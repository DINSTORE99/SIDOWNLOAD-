const APK_URL = "URL_SFILE_APK_KAMU";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const response = await fetch(APK_URL, {
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Gagal mengambil file APK.",
      });
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/vnd.android.package-archive";

    const contentLength =
      response.headers.get("content-length");

    res.setHeader(
      "Content-Type",
      contentType
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="SIDOWNLOAD.apk"'
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    if (contentLength) {
      res.setHeader(
        "Content-Length",
        contentLength
      );
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    return res.status(200).send(buffer);

  } catch (error) {
    console.error("APK DOWNLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh APK.",
    });
  }
}
