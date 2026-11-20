import { useState } from "react";
import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";

const EXAMPLE_URLS = {
  Instagram: "https://www.instagram.com/reel/xxxxx/",
  TikTok: "https://www.tiktok.com/@username/video/xxxxx",
  YouTube: "https://www.youtube.com/watch?v=xxxxx",
  Facebook: "https://www.facebook.com/watch/?v=xxxxx",
  CapCut: "https://www.capcut.com/tv2/xxxxx/",
  Spotify: "https://open.spotify.com/track/xxxxx",
};

export default function Docs() {
  const [testUrl, setTestUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [copied, setCopied] = useState(false);

  const testAPI = async () => {
    if (!testUrl.trim()) {
      setApiError("Masukkan URL terlebih dahulu.");
      setApiResult(null);
      return;
    }

    setTesting(true);
    setApiError("");
    setApiResult(null);
    setCopied(false);

    try {
      const response = await fetch(
        `${API}?url=${encodeURIComponent(testUrl.trim())}`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server mengembalikan response yang bukan JSON.");
      }

      if (!response.ok || !data.success) {
        setApiResult(data);
        setApiError(data.message || "API gagal memproses URL.");
        return;
      }

      setApiResult(data);
    } catch (error) {
      setApiError(
        error.message || "Gagal menghubungi API SIDOWNLOAD."
      );
    } finally {
      setTesting(false);
    }
  };

  const copyJSON = async () => {
    if (!apiResult) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(apiResult, null, 2)
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const useExample = (url) => {
    setTestUrl(url);
    setApiResult(null);
    setApiError("");
  };

  return (
    <div className="docs-page">

      {/* HEADER */}
      <header className="docs-header">
        <div className="docs-brand">
          <div className="docs-brand-icon">S</div>

          <div>
            <b>SIDOWNLOAD</b>
            <span>API DOCUMENTATION</span>
          </div>
        </div>

        <button
          className="docs-back"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← Home
        </button>
      </header>

      <main className="docs-container">

        {/* INTRO */}
        <section className="docs-intro">
          <span className="docs-badge">
            ● PUBLIC API
          </span>

          <h1>
            SIDOWNLOAD
            <br />
            <span>API Documentation</span>
          </h1>

          <p>
            Gunakan API SIDOWNLOAD untuk website, aplikasi,
            bot, maupun project kamu sendiri.
          </p>
        </section>

        {/* API PLAYGROUND */}
        <section className="docs-card api-playground">

          <div className="docs-title">
            <small>00</small>

            <div>
              <h2>Test API</h2>
              <p>
                Coba endpoint SIDOWNLOAD langsung dari halaman ini.
              </p>
            </div>
          </div>

          <div className="api-status">
            <span className="api-status-dot"></span>
            API Endpoint Aktif
          </div>

          <div className="test-input-wrapper">

            <input
              type="text"
              value={testUrl}
              onChange={(e) => {
                setTestUrl(e.target.value);
                setApiError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  testAPI();
                }
              }}
              placeholder="Tempel URL TikTok, Instagram, YouTube, dll..."
            />

            <button
              type="button"
              onClick={testAPI}
              disabled={testing || !testUrl.trim()}
            >
              {testing ? "Memproses..." : "Test API"}
            </button>

          </div>

          {/* CONTOH URL */}
          <div className="example-label">
            Contoh URL
          </div>

          <div className="example-buttons">
            {Object.entries(EXAMPLE_URLS).map(([name, value]) => (
              <button
                key={name}
                type="button"
                onClick={() => useExample(value)}
              >
                {name}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {apiError && (
            <div className="api-error">
              <strong>Request gagal</strong>
              <span>{apiError}</span>
            </div>
          )}

          {/* JSON RESULT */}
          {apiResult && (
            <div className="test-result">

              <div className="result-top">
                <div>
                  <span className="result-label">
                    RESPONSE
                  </span>

                  <h3>
                    {apiResult.success
                      ? "API berhasil"
                      : "API gagal"}
                  </h3>
                </div>

                <button
                  type="button"
                  className="copy-json-btn"
                  onClick={copyJSON}
                >
                  {copied ? "✓ Copied" : "Copy JSON"}
                </button>
              </div>

              {/* DETAIL */}
              {apiResult.success && (
                <div className="api-result-info">

                  <div>
                    <span>Platform</span>
                    <b>
                      {apiResult.platform || "-"}
                    </b>
                  </div>

                  <div>
                    <span>Title</span>
                    <b>
                      {apiResult.title || "-"}
                    </b>
                  </div>

                  {apiResult.author && (
                    <div>
                      <span>Author</span>
                      <b>
                        {apiResult.author}
                      </b>
                    </div>
                  )}

                  {apiResult.duration && (
                    <div>
                      <span>Duration</span>
                      <b>
                        {apiResult.duration}
                      </b>
                    </div>
                  )}

                </div>
              )}

              {/* DOWNLOAD OPTIONS */}
              {apiResult.success &&
                Array.isArray(apiResult.downloads) &&
                apiResult.downloads.length > 0 && (
                  <div className="api-downloads">

                    <div className="example-label">
                      Download Options
                    </div>

                    {apiResult.downloads.map(
                      (item, index) => (
                        <a
                          key={`${item.url}-${index}`}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="api-download-item"
                        >
                          <div>
                            <strong>
                              {item.text ||
                                `Download #${index + 1}`}
                            </strong>

                            <span>
                              {item.type || "media"}
                            </span>
                          </div>

                          <span>↓</span>
                        </a>
                      )
                    )}

                  </div>
                )}

              {/* JSON */}
              <div className="json-result">

                <div className="json-header">
                  <span>JSON RESPONSE</span>

                  <span>
                    application/json
                  </span>
                </div>

                <pre>
                  {JSON.stringify(
                    apiResult,
                    null,
                    2
                  )}
                </pre>

              </div>

            </div>
          )}

        </section>

        {/* ENDPOINT */}
        <section className="docs-card">

          <div className="docs-title">
            <small>01</small>
            <div>
              <h2>API Endpoint</h2>
              <p>
                Endpoint utama untuk memproses link media.
              </p>
            </div>
          </div>

          <div className="endpoint">
            <strong>GET</strong>
            <code>{API}?url=LINK</code>
          </div>

          <div className="note">
            <b>Tanpa API Key</b>

            <span>
              API dapat digunakan langsung tanpa authentication.
            </span>
          </div>

        </section>

        {/* PARAMETER */}
        <section className="docs-card">

          <div className="docs-title">
            <small>02</small>

            <div>
              <h2>Parameter</h2>
              <p>
                Parameter yang diperlukan oleh API.
              </p>
            </div>
          </div>

          <div className="parameter">

            <code>url</code>

            <div>
              <b>String</b>

              <p>
                URL media yang ingin diproses.
              </p>
            </div>

            <span className="required">
              REQUIRED
            </span>

          </div>

        </section>

        {/* REQUEST */}
        <section className="docs-card">

          <div className="docs-title">
            <small>03</small>

            <div>
              <h2>Contoh Request</h2>
              <p>
                Contoh request menggunakan GET.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`GET ${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F`}</pre>
          </div>

        </section>

        {/* JSON */}
        <section className="docs-card">

          <div className="docs-title">
            <small>04</small>

            <div>
              <h2>JSON Response</h2>
              <p>
                Format response ketika request berhasil.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`{
  "success": true,
  "platform": "instagram",
  "title": "Judul media",
  "thumbnail": "",
  "author": "username",
  "duration": "",
  "stats": "",
  "downloads": [
    {
      "url": "https://example.com/video.mp4",
      "text": "Download Video (720p)",
      "type": "instagram"
    }
  ]
}`}</pre>
          </div>

        </section>

        {/* DOWNLOADS */}
        <section className="docs-card">

          <div className="docs-title">
            <small>05</small>

            <div>
              <h2>Downloads</h2>
              <p>
                Hasil download terdapat di dalam array downloads.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`data.downloads.forEach((item) => {
  console.log(item.url);
});`}</pre>
          </div>

        </section>

        {/* JAVASCRIPT */}
        <section className="docs-card">

          <div className="docs-title">
            <small>06</small>

            <div>
              <h2>JavaScript</h2>
              <p>
                Contoh penggunaan menggunakan fetch.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`const url =
  "https://www.instagram.com/reel/xxxxx/";

const response = await fetch(
  "${API}?url=" +
  encodeURIComponent(url)
);

const data = await response.json();

if (data.success) {

  console.log("Judul:", data.title);

  data.downloads.forEach((item) => {
    console.log(item.text);
    console.log(item.url);
  });

} else {

  console.log(data.message);

}`}</pre>
          </div>

        </section>

        {/* NODE */}
        <section className="docs-card">

          <div className="docs-title">
            <small>07</small>

            <div>
              <h2>Node.js</h2>
              <p>
                Contoh integrasi Node.js.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`async function download(url) {

  const api =
    "${API}?url=" +
    encodeURIComponent(url);

  const response =
    await fetch(api);

  const data =
    await response.json();

  return data;
}

const result = await download(
  "https://www.instagram.com/reel/xxxxx/"
);

console.log(result);`}</pre>
          </div>

        </section>

        {/* PYTHON */}
        <section className="docs-card">

          <div className="docs-title">
            <small>08</small>

            <div>
              <h2>Python</h2>
              <p>
                Contoh menggunakan requests.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`import requests

url = "https://www.instagram.com/reel/xxxxx/"

response = requests.get(
    "${API}",
    params={
        "url": url
    }
)

data = response.json()

print(data)

if data["success"]:
    for item in data["downloads"]:
        print(item["url"])`}</pre>
          </div>

        </section>

        {/* PHP */}
        <section className="docs-card">

          <div className="docs-title">
            <small>09</small>

            <div>
              <h2>PHP</h2>
              <p>
                Contoh request menggunakan PHP.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`<?php

$url =
  "https://www.instagram.com/reel/xxxxx/";

$api =
  "${API}?url=" .
  urlencode($url);

$response =
  file_get_contents($api);

$data =
  json_decode($response, true);

print_r($data);

?>`}</pre>
          </div>

        </section>

        {/* CURL */}
        <section className="docs-card">

          <div className="docs-title">
            <small>10</small>

            <div>
              <h2>cURL</h2>
              <p>
                Request langsung melalui terminal.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`curl "${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F"`}</pre>
          </div>

        </section>

        {/* BOT */}
        <section className="docs-card">

          <div className="docs-title">
            <small>11</small>

            <div>
              <h2>Integrasi Bot</h2>
              <p>
                Gunakan API untuk membuat downloader bot.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`const api =
  "${API}?url=" +
  encodeURIComponent(url);

const response =
  await fetch(api);

const data =
  await response.json();

if (!data.success) {
  return "❌ Gagal memproses link.";
}

for (const item of data.downloads) {

  console.log(
    item.text,
    item.url
  );

}`}</pre>
          </div>

        </section>

        {/* ERROR */}
        <section className="docs-card">

          <div className="docs-title">
            <small>12</small>

            <div>
              <h2>Error Response</h2>
              <p>
                Response ketika request gagal.
              </p>
            </div>
          </div>

          <div className="code">
            <pre>{`{
  "success": false,
  "message": "URL tidak boleh kosong."
}`}</pre>
          </div>

          <p className="error-tip">
            Selalu periksa <code>success</code> sebelum
            menggunakan hasil API.
          </p>

        </section>

        {/* PLATFORM */}
        <section className="docs-card">

          <div className="docs-title">
            <small>13</small>

            <div>
              <h2>Platform</h2>
              <p>
                Platform yang tersedia pada API.
              </p>
            </div>
          </div>

          <div className="platforms">
            <div>🎵 TikTok</div>
            <div>📸 Instagram</div>
            <div>▶️ YouTube</div>
            <div>📘 Facebook</div>
            <div>✂️ CapCut</div>
            <div>🎧 Spotify</div>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="docs-footer">

          <div className="docs-brand">
            <div className="docs-brand-icon">
              S
            </div>

            <div>
              <b>SIDOWNLOAD</b>
              <span>FAST • SIMPLE • FREE</span>
            </div>
          </div>

          <p>
            SIDOWNLOAD Public API
          </p>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            ← Kembali ke SIDOWNLOAD
          </button>

        </footer>

      </main>
    </div>
  );
}
