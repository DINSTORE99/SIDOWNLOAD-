import {
  getAllKeys,
  seedIfEmpty,
  claimKey,
  rotateForUser,
  touchKey,
  revokeKey,
  setKeyStatus,
  deleteKey,
  addKey,
  isOnline,
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

function getBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  return {};
}

function checkSecret(req, secretName) {
  const expected = process.env[secretName];

  if (!expected) {
    return false;
  }

  const received =
    req.headers[`x-${secretName.toLowerCase().replace(/_/g, "-")}`] ||
    req.query?.secret;

  return received === expected;
}

function json(res, status, data) {
  return res.status(status).json(data);
}

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, X-Bot-Secret, X-Admin-Secret"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );

      return res.status(204).end();
    }

    if (!["GET", "POST"].includes(req.method)) {
      return json(res, 405, {
        success: false,
        message: "Method not allowed",
      });
    }

    await seedIfEmpty(INITIAL_KEYS);

    const body = getBody(req);

    const action =
      body.action ||
      req.query?.action ||
      "list";

    /*
     * ==============================
     * BOT ACTION
     * ==============================
     */

    if (["claim", "rotate", "touch"].includes(action)) {
      const secret =
        req.headers["x-bot-secret"] ||
        body.botSecret ||
        req.query?.botSecret;

      if (!process.env.BOT_SECRET || secret !== process.env.BOT_SECRET) {
        return json(res, 401, {
          success: false,
          message: "BOT_SECRET tidak valid",
        });
      }

      if (action === "claim") {
        const userId =
          body.userId ||
          req.query?.userId;

        const username =
          body.username ||
          req.query?.username ||
          "";

        if (!userId) {
          return json(res, 400, {
            success: false,
            message: "userId wajib diisi",
          });
        }

        const result = await claimKey(userId, username);

        if (!result) {
          return json(res, 409, {
            success: false,
            message: "Semua API key sedang terpakai",
          });
        }

        return json(res, 200, {
          success: true,
          action: "claim",
          data: result,
        });
      }

      if (action === "rotate") {
        const userId =
          body.userId ||
          req.query?.userId;

        const username =
          body.username ||
          req.query?.username ||
          "";

        if (!userId) {
          return json(res, 400, {
            success: false,
            message: "userId wajib diisi",
          });
        }

        const result = await rotateForUser(userId, username);

        if (!result) {
          return json(res, 409, {
            success: false,
            message: "Tidak ada API key baru yang tersedia",
          });
        }

        return json(res, 200, {
          success: true,
          action: "rotate",
          data: result,
        });
      }

      if (action === "touch") {
        const key =
          body.key ||
          req.query?.key;

        const userId =
          body.userId ||
          req.query?.userId ||
          null;

        if (!key) {
          return json(res, 400, {
            success: false,
            message: "API key wajib diisi",
          });
        }

        const result = await touchKey(key, userId);

        if (!result) {
          return json(res, 401, {
            success: false,
            message: "API key tidak valid atau sudah tidak aktif",
          });
        }

        return json(res, 200, {
          success: true,
          action: "touch",
          data: result,
        });
      }
    }

    /*
     * ==============================
     * ADMIN ACTION
     * ==============================
     */

    const adminSecret =
      req.headers["x-admin-secret"] ||
      body.adminSecret ||
      req.query?.adminSecret;

    if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
      return json(res, 401, {
        success: false,
        message: "ADMIN_SECRET tidak valid",
      });
    }

    if (action === "list") {
      const keys = await getAllKeys();

      const data = Object.values(keys).map((item) => ({
        ...item,
        online: isOnline(item),
      }));

      return json(res, 200, {
        success: true,
        total: data.length,
        online: data.filter((x) => x.online).length,
        active: data.filter((x) => x.status === "active").length,
        unused: data.filter((x) => x.status === "unused").length,
        revoked: data.filter((x) => x.status === "revoked").length,
        data,
      });
    }

    if (action === "revoke") {
      const key =
        body.key ||
        req.query?.key;

      if (!key) {
        return json(res, 400, {
          success: false,
          message: "key wajib diisi",
        });
      }

      const result = await revokeKey(key);

      return json(res, 200, {
        success: result,
        message: result
          ? "API key berhasil direvoke"
          : "API key tidak ditemukan",
      });
    }

    if (action === "activate") {
      const key =
        body.key ||
        req.query?.key;

      if (!key) {
        return json(res, 400, {
          success: false,
          message: "key wajib diisi",
        });
      }

      const result = await setKeyStatus(key, "unused");

      return json(res, 200, {
        success: result,
        message: result
          ? "API key dikembalikan menjadi unused"
          : "API key tidak ditemukan",
      });
    }

    if (action === "delete") {
      const key =
        body.key ||
        req.query?.key;

      if (!key) {
        return json(res, 400, {
          success: false,
          message: "key wajib diisi",
        });
      }

      const result = await deleteKey(key);

      return json(res, 200, {
        success: result,
        message: result
          ? "API key berhasil dihapus"
          : "API key tidak ditemukan",
      });
    }

    if (action === "add") {
      const key =
        body.key ||
        req.query?.key;

      if (!key) {
        return json(res, 400, {
          success: false,
          message: "key wajib diisi",
        });
      }

      const result = await addKey(key);

      return json(res, 200, {
        success: result,
        message: result
          ? "API key berhasil ditambahkan"
          : "API key sudah ada",
      });
    }

    return json(res, 400, {
      success: false,
      message: `Action tidak dikenal: ${action}`,
    });

  } catch (error) {
    console.error("KEY API ERROR:", error);

    return json(res, 500, {
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
