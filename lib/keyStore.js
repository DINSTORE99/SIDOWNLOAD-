const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const REDIS_KEY = "sidownload:api_keys";

// ======================================================
// REDIS
// ======================================================

function assertRedis() {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL atau UPSTASH_REDIS_REST_TOKEN belum diset"
    );
  }
}

async function redis(command, ...args) {
  assertRedis();

  const encodedArgs = args
    .map((arg) =>
      encodeURIComponent(String(arg))
    )
    .join("/");

  const url =
    `${REDIS_URL}/${command}` +
    (encodedArgs
      ? `/${encodedArgs}`
      : "");

  const response =
    await fetch(url, {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${REDIS_TOKEN}`,
      },
    });

  const data =
    await response.json();

  if (
    !response.ok ||
    data.error
  ) {
    throw new Error(
      data.error ||
      "Redis error"
    );
  }

  return data.result;
}

// ======================================================
// GET ALL
// ======================================================

async function getAllKeys() {
  const raw =
    await redis(
      "GET",
      REDIS_KEY
    );

  if (!raw) {
    return {};
  }

  try {
    return typeof raw === "string"
      ? JSON.parse(raw)
      : raw;
  } catch {
    throw new Error(
      "Data API key di Redis rusak atau tidak valid"
    );
  }
}

// ======================================================
// SAVE
// ======================================================

async function saveAll(keys) {
  await redis(
    "SET",
    REDIS_KEY,
    JSON.stringify(keys)
  );

  return keys;
}

// ======================================================
// SEED
// ======================================================

async function seedIfEmpty(
  initialKeys = []
) {
  const current =
    await getAllKeys();

  if (
    Object.keys(current)
      .length > 0
  ) {
    return current;
  }

  const keys = {};

  const now =
    new Date().toISOString();

  for (
    const key of initialKeys
  ) {
    if (!key) continue;

    keys[key] = {
      key,

      status:
        "unused",

      userId:
        null,

      username:
        null,

      createdAt:
        now,

      activatedAt:
        null,

      lastUsed:
        null,

      uses:
        0,
    };
  }

  if (
    Object.keys(keys)
      .length > 0
  ) {
    await saveAll(keys);
  }

  return keys;
}

// ======================================================
// CLAIM KEY
// ======================================================

async function claimKey(
  userId,
  username = ""
) {
  const keys =
    await getAllKeys();

  // User sudah punya key aktif
  const existing =
    Object.values(keys)
      .find(
        (item) =>
          item.status ===
            "active" &&
          String(
            item.userId
          ) ===
            String(userId)
      );

  if (existing) {
    existing.lastUsed =
      new Date().toISOString();

    existing.uses =
      Number(
        existing.uses || 0
      ) + 1;

    keys[existing.key] =
      existing;

    await saveAll(keys);

    return existing;
  }

  // Cari key kosong
  const available =
    Object.values(keys)
      .find(
        (item) =>
          item.status ===
          "unused"
      );

  if (!available) {
    return null;
  }

  const now =
    new Date().toISOString();

  available.status =
    "active";

  available.userId =
    String(userId);

  available.username =
    username || null;

  available.activatedAt =
    now;

  available.lastUsed =
    now;

  available.uses =
    Number(
      available.uses || 0
    ) + 1;

  keys[available.key] =
    available;

  await saveAll(keys);

  return available;
}

// ======================================================
// ROTATE KEY
// ======================================================

async function rotateForUser(
  userId,
  username = ""
) {
  const keys =
    await getAllKeys();

  const oldKey =
    Object.values(keys)
      .find(
        (item) =>
          item.status ===
            "active" &&
          String(
            item.userId
          ) ===
            String(userId)
      );

  /*
   * Cari key baru terlebih dahulu.
   *
   * Jadi kalau tidak ada key kosong,
   * key lama TIDAK akan ikut hilang.
   */
  const newKey =
    Object.values(keys)
      .find(
        (item) =>
          item.status ===
          "unused"
      );

  if (!newKey) {
    return null;
  }

  const now =
    new Date().toISOString();

  // Revoke key lama
  if (oldKey) {
    oldKey.status =
      "revoked";

    oldKey.revokedAt =
      now;

    keys[oldKey.key] =
      oldKey;
  }

  // Aktifkan key baru
  newKey.status =
    "active";

  newKey.userId =
    String(userId);

  newKey.username =
    username || null;

  newKey.activatedAt =
    now;

  newKey.lastUsed =
    now;

  newKey.uses =
    Number(
      newKey.uses || 0
    ) + 1;

  keys[newKey.key] =
    newKey;

  await saveAll(keys);

  return {
    oldKey:
      oldKey || null,

    newKey,
  };
}

// ======================================================
// TOUCH KEY
// ======================================================

async function touchKey(
  key,
  userId = null
) {
  if (!key) {
    return null;
  }

  const keys =
    await getAllKeys();

  const item =
    keys[key];

  if (!item) {
    return null;
  }

  if (
    item.status !==
    "active"
  ) {
    return null;
  }

  if (
    userId !== null &&
    userId !== undefined &&
    item.userId !== null &&
    String(
      item.userId
    ) !==
      String(userId)
  ) {
    return null;
  }

  item.lastUsed =
    new Date().toISOString();

  item.uses =
    Number(
      item.uses || 0
    ) + 1;

  keys[key] =
    item;

  await saveAll(keys);

  return item;
}

// ======================================================
// REVOKE
// ======================================================

async function revokeKey(
  key
) {
  const keys =
    await getAllKeys();

  if (!keys[key]) {
    return false;
  }

  keys[key].status =
    "revoked";

  keys[key].revokedAt =
    new Date().toISOString();

  await saveAll(keys);

  return true;
}

// ======================================================
// SET STATUS
// ======================================================

async function setKeyStatus(
  key,
  status
) {
  const allowed = [
    "unused",
    "active",
    "revoked",
  ];

  if (
    !allowed.includes(
      status
    )
  ) {
    throw new Error(
      "Status key tidak valid"
    );
  }

  const keys =
    await getAllKeys();

  if (!keys[key]) {
    return false;
  }

  keys[key].status =
    status;

  if (
    status === "unused"
  ) {
    keys[key].userId =
      null;

    keys[key].username =
      null;

    keys[key].activatedAt =
      null;

    keys[key].lastUsed =
      null;

    keys[key].uses =
      0;
  }

  await saveAll(keys);

  return true;
}

// ======================================================
// DELETE
// ======================================================

async function deleteKey(
  key
) {
  const keys =
    await getAllKeys();

  if (!keys[key]) {
    return false;
  }

  delete keys[key];

  await saveAll(keys);

  return true;
}

// ======================================================
// ADD
// ======================================================

async function addKey(
  key
) {
  if (!key) {
    throw new Error(
      "API key kosong"
    );
  }

  const keys =
    await getAllKeys();

  if (keys[key]) {
    return false;
  }

  keys[key] = {
    key,

    status:
      "unused",

    userId:
      null,

    username:
      null,

    createdAt:
      new Date().toISOString(),

    activatedAt:
      null,

    lastUsed:
      null,

    uses:
      0,
  };

  await saveAll(keys);

  return true;
}

// ======================================================
// ONLINE CHECK
// ======================================================

function isOnline(item) {
  if (
    !item ||
    item.status !==
      "active" ||
    !item.lastUsed
  ) {
    return false;
  }

  const ttl =
    Number(
      process.env
        .ONLINE_TTL_SECONDS ||
        300
    ) * 1000;

  const lastUsed =
    new Date(
      item.lastUsed
    ).getTime();

  if (
    !Number.isFinite(
      lastUsed
    )
  ) {
    return false;
  }

  return (
    Date.now() -
      lastUsed <=
    ttl
  );
}

// ======================================================
// EXPORT
// ======================================================

export {
  getAllKeys,
  saveAll,
  seedIfEmpty,
  claimKey,
  rotateForUser,
  touchKey,
  revokeKey,
  setKeyStatus,
  deleteKey,
  addKey,
  isOnline,
};

export default {
  getAllKeys,
  saveAll,
  seedIfEmpty,
  claimKey,
  rotateForUser,
  touchKey,
  revokeKey,
  setKeyStatus,
  deleteKey,
  addKey,
  isOnline,
};
