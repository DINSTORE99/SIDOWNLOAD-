import {
  seedIfEmpty,
  claimKey,
  rotateForUser,
} from "../lib/keyStore.js";

const INITIAL_KEYS = [
  "DINSTORE-7KQ9X2M4P8RA",
  "DINSTORE-N6T3W8Y5H2KF",
  "DINSTORE-4ZP7L9Q2X6MC",
  "DINSTORE-R8V3K5N7T1QH",
  "DINSTORE-M2X9C4F8W6JP",
  "DINSTORE-H7Q3B9K5L2VN",
  "DINSTORE-P4Y8T6R2M9XZ",
  "DINSTORE-C9N5V2K7Q4LA",
  "DINSTORE-X3F8M6P1T9WK",
  "DINSTORE-Q7L2H5Z9C4RN",
];

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

function telegramUrl(method) {
  return `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
}

async function telegram(method, payload = {}) {
  const response = await fetch(telegramUrl(method), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(
      data.description || `Telegram API error: ${response.status}`
    );
  }

  return data;
}

function menuKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "🔑 Ambil API Key",
          callback_data: "claim",
        },
      ],
      [
        {
          text: "🔄 Ganti API Key",
          callback_data: "rotate",
        },
      ],
      [
        {
          text: "📖 Cara Pakai",
          callback_data: "help",
        },
      ],
    ],
  };
}

function helpText() {
  return `
<b>📖 CARA MENGGUNAKAN API KEY</b>

1. Tekan <b>🔑 Ambil API Key</b>
2. Bot akan memberikan API key milik kamu.
3. Gunakan API key tersebut pada request downloader.
4. Selama key masih aktif, key dapat digunakan.
5. Jika ingin mengganti key, tekan <b>🔄 Ganti API Key</b>.

<b>⚠️ PENTING</b>

Jangan bagikan API key kepada orang lain.

Jika key diganti, key lama akan otomatis <b>REVOKED</b>.
`;
}

function getUserInfo(from) {
  return {
    userId: String(from.id),
    username:
      from.username ||
      [from.first_name, from.last_name]
        .filter(Boolean)
        .join(" ") ||
      "",
  };
}

function formatKeyResult(result) {
  return `
<b>✅ API KEY BERHASIL</b>

🔑 <code>${result.key}</code>

👤 User:
<code>${result.userId}</code>

📊 Status:
<b>${result.status.toUpperCase()}</b>

📈 Pemakaian:
<b>${result.uses}</b>

⚡ Gunakan key ini untuk mengakses API SIDOWNLOAD.

<b>Jangan bagikan API key kamu.</b>
`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    if (!BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN belum diset");

      return res.status(500).json({
        success: false,
        message: "Telegram bot token belum dikonfigurasi",
      });
    }

    if (!WEBHOOK_SECRET) {
      console.error("TELEGRAM_WEBHOOK_SECRET belum diset");

      return res.status(500).json({
        success: false,
        message: "Telegram webhook secret belum dikonfigurasi",
      });
    }

    const receivedSecret =
      req.headers["x-telegram-bot-api-secret-token"];

    if (receivedSecret !== WEBHOOK_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await seedIfEmpty(INITIAL_KEYS);

    const update = req.body || {};

    /*
     * ==========================
     * MESSAGE
     * ==========================
     */

    if (update.message) {
      const message = update.message;
      const chatId = message.chat?.id;
      const text = message.text || "";
      const from = message.from;

      if (!chatId || !from) {
        return res.status(200).json({
          success: true,
        });
      }

      if (text === "/start") {
        await telegram("sendMessage", {
          chat_id: chatId,
          text: `
<b>🤖 SIDOWNLOAD API BOT</b>

Selamat datang.

Bot ini digunakan untuk mendapatkan dan mengelola API key SIDOWNLOAD.

🔑 Ambil API Key
🔄 Ganti API Key
📖 Cara Pakai

Silakan pilih menu di bawah.
`,
          parse_mode: "HTML",
          reply_markup: menuKeyboard(),
        });

        return res.status(200).json({
          success: true,
        });
      }

      if (text === "/key") {
        const user = getUserInfo(from);

        const result = await claimKey(
          user.userId,
          user.username
        );

        if (!result) {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: "❌ Semua API key sedang terpakai.",
          });
        } else {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: formatKeyResult(result),
            parse_mode: "HTML",
          });
        }

        return res.status(200).json({
          success: true,
        });
      }

      if (text === "/help") {
        await telegram("sendMessage", {
          chat_id: chatId,
          text: helpText(),
          parse_mode: "HTML",
          reply_markup: menuKeyboard(),
        });

        return res.status(200).json({
          success: true,
        });
      }

      await telegram("sendMessage", {
        chat_id: chatId,
        text: `
<b>🤖 SIDOWNLOAD API BOT</b>

Perintah yang tersedia:

/start
/key
/help

Atau gunakan tombol menu di bawah.
`,
        parse_mode: "HTML",
        reply_markup: menuKeyboard(),
      });

      return res.status(200).json({
        success: true,
      });
    }

    /*
     * ==========================
     * CALLBACK QUERY
     * ==========================
     */

    if (update.callback_query) {
      const callback = update.callback_query;
      const data = callback.data;
      const from = callback.from;
      const chatId = callback.message?.chat?.id;

      if (!from || !chatId) {
        return res.status(200).json({
          success: true,
        });
      }

      await telegram("answerCallbackQuery", {
        callback_query_id: callback.id,
      });

      const user = getUserInfo(from);

      if (data === "claim") {
        const result = await claimKey(
          user.userId,
          user.username
        );

        if (!result) {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: "❌ Semua API key sedang terpakai.",
          });
        } else {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: formatKeyResult(result),
            parse_mode: "HTML",
          });
        }

        return res.status(200).json({
          success: true,
        });
      }

      if (data === "rotate") {
        const result = await rotateForUser(
          user.userId,
          user.username
        );

        if (!result) {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: `
❌ <b>GAGAL GANTI KEY</b>

Tidak ada API key baru yang tersedia.

Key lama kamu masih tetap aktif.
`,
            parse_mode: "HTML",
          });
        } else {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: `
<b>🔄 API KEY BERHASIL DIGANTI</b>

❌ Key lama:
<code>${result.oldKey?.key || "-"}</code>

✅ Key baru:
<code>${result.newKey.key}</code>

📊 Status:
<b>ACTIVE</b>

⚠️ Key lama sudah tidak dapat digunakan.
`,
            parse_mode: "HTML",
          });
        }

        return res.status(200).json({
          success: true,
        });
      }

      if (data === "help") {
        await telegram("sendMessage", {
          chat_id: chatId,
          text: helpText(),
          parse_mode: "HTML",
          reply_markup: menuKeyboard(),
        });

        return res.status(200).json({
          success: true,
        });
      }

      return res.status(200).json({
        success: true,
      });
    }

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("TELEGRAM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Telegram webhook error",
    });
  }
}
