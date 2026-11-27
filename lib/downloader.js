const UPSTREAM = {
  tiktok: "https://api.siputzx.my.id/api/d/tiktok/v2",
  instagram: "https://api.siputzx.my.id/api/d/sssinstagram",
  facebook: "https://api.siputzx.my.id/api/d/facebook",
  capcut: "https://api.siputzx.my.id/api/d/capcut",
  spotify: "https://api.azbry.com/api/download/spotify",
  youtubeMp4: "https://api.azbry.com/api/download/ytmp4",
  youtubeMp3: "https://api.azbry.com/api/download/ytmp3",
};

export function getUrl(req) {
  const url =
    req.query?.url ||
    req.query?.link ||
    req.body?.url ||
    req.body?.link ||
    "";

  return String(url).trim();
}

export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (res.req?.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}

async function requestJson(endpoint, url) {
  const target = `${endpoint}?url=${encodeURIComponent(url)}`;

  const response = await fetch(target, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0",
    },
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      status: response.ok,
      result: text,
    };
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Upstream error ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export async function tiktok(url) {
  return requestJson(UPSTREAM.tiktok, url);
}

export async function instagram(url) {
  return requestJson(UPSTREAM.instagram, url);
}

export async function facebook(url) {
  return requestJson(UPSTREAM.facebook, url);
}

export async function capcut(url) {
  return requestJson(UPSTREAM.capcut, url);
}

export async function spotify(url) {
  return requestJson(UPSTREAM.spotify, url);
}

export async function youtube(url, type = "mp4") {
  const endpoint =
    String(type).toLowerCase() === "mp3"
      ? UPSTREAM.youtubeMp3
      : UPSTREAM.youtubeMp4;

  return requestJson(endpoint, url);
}

export function detectPlatform(url) {
  let hostname = "";

  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }

  hostname = hostname.replace(/^www\./, "");

  if (
    hostname === "tiktok.com" ||
    hostname.endsWith(".tiktok.com")
  ) {
    return "tiktok";
  }

  if (
    hostname === "instagram.com" ||
    hostname.endsWith(".instagram.com") ||
    hostname === "instagr.am" ||
    hostname.endsWith(".instagr.am")
  ) {
    return "instagram";
  }

  if (
    hostname === "facebook.com" ||
    hostname.endsWith(".facebook.com") ||
    hostname === "fb.watch"
  ) {
    return "facebook";
  }

  if (
    hostname === "capcut.com" ||
    hostname.endsWith(".capcut.com") ||
    hostname === "capcut.net" ||
    hostname.endsWith(".capcut.net")
  ) {
    return "capcut";
  }

  if (
    hostname === "spotify.com" ||
    hostname.endsWith(".spotify.com") ||
    hostname === "open.spotify.com"
  ) {
    return "spotify";
  }

  if (
    hostname === "youtube.com" ||
    hostname.endsWith(".youtube.com") ||
    hostname === "youtu.be"
  ) {
    return "youtube";
  }

  return null;
}
