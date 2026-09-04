const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "ISI_BOT_TOKEN_KAMU";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "ISI_CHAT_ID_KAMU";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { type, details } = req.body || {};
  let message = "";

  const timeString = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  if (type === "visit") {
    message = `👤 <b>User Mengunjungi Website</b>\n📅 <i>${timeString}</i>\n🌐 Platform: Web Client`;
  } else if (type === "process") {
    message = `🔍 <b>User Memproses Tautan</b>\n📅 <i>${timeString}</i>\n🔗 <b>URL:</b> <code>${details?.url || "-"}</code>`;
  } else if (type === "downloaded") {
    message = `✅ <b>Media Berhasil Diunduh</b>\n📅 <i>${timeString}</i>\n🏷️ <b>Judul:</b> ${details?.title || "-"}\n📱 <b>Platform:</b> ${details?.platform || "-"}\n📥 <b>Format:</b> ${details?.label || "-"}`;
  }

  if (!message || BOT_TOKEN === "ISI_BOT_TOKEN_KAMU") {
    return res.status(200).json({ success: true, warning: "Bot credentials not set" });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
