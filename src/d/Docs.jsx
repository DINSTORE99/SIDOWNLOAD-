import { useState } from "react";
import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";

const EXAMPLE_URL =
  "https://www.instagram.com/reel/xxxxx/";

export default function Docs() {
  const [testUrl, setTestUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [httpStatus, setHttpStatus] = useState(null);
  const [testError, setTestError] = useState("");
  const [copied, setCopied] = useState(false);

  const runTest = async () => {
    const value = testUrl.trim();

    if (!value) {
      setTestError("Masukkan URL media terlebih dahulu.");
      setResponse(null);
      setHttpStatus(null);
      return;
    }

    setLoading(true);
    setTestError("");
    setResponse(null);
    setHttpStatus(null);

    try {
      const res = await fetch(
        `${API}?url=${encodeURIComponent(value)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      setHttpStatus(res.status);

      const raw = await res.text();

      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        data = {
          success: false,
          message: "Response bukan JSON.",
          raw,
        };
      }

      setResponse(data);
    } catch (error) {
      setTestError(
        "Tidak dapat terhubung ke API. Pastikan endpoint sedang online."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setTestUrl(EXAMPLE_URL);
    setTestError("");
    setResponse(null);
    setHttpStatus(null);
  };

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(API);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="docs-page">

      {/* =========================================
          TERMINAL / BROWSER WINDOW
      ========================================== */}
      <div className="docs-window">

        {/* WINDOW BAR */}
        <header className="docs-window-bar">

          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="window-title">
            sidownload@api ~ terminal
          </div>

          <button
            className="window-home"
            onClick={goHome}
          >
            HOME
          </button>

        </header>


        {/* =========================================
            PAGE HEADER
        ========================================== */}
        <header className="docs-header">

          <div
            className="docs-brand"
            onClick={goHome}
          >

            <div className="docs-brand-icon">
              S
            </div>

            <div className="docs-brand-text">
              <b>SIDOWNLOAD</b>
              <span>PUBLIC API</span>
            </div>

          </div>

          <button
            className="docs-back"
            onClick={goHome}
          >
            ← Home
          </button>

        </header>


        <main className="docs-container">

          {/* =========================================
              INTRO
          ========================================== */}
          <section className="docs-intro">

            <span className="docs-badge">
              <i></i>
              API ONLINE
            </span>

            <h1>
              SIDOWNLOAD
              <br />
              <span>API Documentation</span>
            </h1>

            <p>
              Dokumentasi penggunaan Public API SIDOWNLOAD
              untuk website, aplikasi, bot, dan project lainnya.
            </p>

          </section>


          {/* =========================================
              API TESTER
          ========================================== */}
          <section className="terminal-card tester-card">

            <div className="terminal-top">

              <div className="terminal-dots">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <span>
                sidownload@api:~
              </span>

              <button
                onClick={copyEndpoint}
                className="terminal-copy"
              >
                {copied ? "Copied!" : "Copy API"}
              </button>

            </div>


            <div className="terminal-body">

              <div className="terminal-command">
                <span className="terminal-prompt">
                  $
                </span>

                <span>
                  test sidownload api
                </span>
              </div>


              <label className="terminal-label">
                MEDIA URL
              </label>


              <input
                type="url"
                value={testUrl}
                onChange={(e) => {
                  setTestUrl(e.target.value);
                  setTestError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runTest();
                  }
                }}
                placeholder="https://www.instagram.com/reel/..."
                className="terminal-input"
              />


              <div className="tester-actions">

                <button
                  className="terminal-btn secondary"
                  onClick={loadExample}
                >
                  Example
                </button>

                <button
                  className="terminal-btn"
                  onClick={runTest}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : "▶ Run API"}
                </button>

              </div>


              {testError && (
                <div className="terminal-error">
                  <span>✕</span>
                  {testError}
                </div>
              )}


              {(response || httpStatus) && (
                <div className="terminal-response">

                  <div className="response-header">

                    <span>
                      response.json
                    </span>

                    {httpStatus && (
                      <span
                        className={
                          httpStatus >= 200 &&
                          httpStatus < 300
                            ? "status-ok"
                            : "status-bad"
                        }
                      >
                        HTTP {httpStatus}
                      </span>
                    )}

                  </div>


                  <pre>
                    {JSON.stringify(
                      response,
                      null,
                      2
                    )}
                  </pre>

                </div>
              )}

            </div>

          </section>


          {/* =========================================
              01 ENDPOINT
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>01</small>
              <h2>API Endpoint</h2>
            </div>

            <p>
              Gunakan endpoint berikut untuk memproses
              link media.
            </p>

            <div className="endpoint">

              <strong>
                GET
              </strong>

              <code>
                {API}?url=LINK
              </code>

            </div>

            <div className="note">

              <b>
                Tanpa API Key
              </b>

              <span>
                API dapat digunakan langsung tanpa
                authentication.
              </span>

            </div>

          </section>


          {/* =========================================
              02 PARAMETER
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>02</small>
              <h2>Parameter</h2>
            </div>

            <div className="parameter">

              <code>
                url
              </code>

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


          {/* =========================================
              03 REQUEST
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>03</small>
              <h2>Contoh Request</h2>
            </div>

            <div className="code">

              <pre>{`GET ${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F`}</pre>

            </div>

          </section>


          {/* =========================================
              04 JSON
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>04</small>
              <h2>JSON Response</h2>
            </div>

            <p>
              Jika berhasil, API akan mengembalikan
              JSON seperti berikut:
            </p>

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


          {/* =========================================
              05 DOWNLOADS
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>05</small>
              <h2>Downloads</h2>
            </div>

            <p>
              Hasil download berada di dalam array
              <code> downloads</code>.
            </p>

            <div className="code">

              <pre>{`data.downloads.forEach((item) => {
  console.log(item.url);
});`}</pre>

            </div>

          </section>


          {/* =========================================
              06 JAVASCRIPT
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>06</small>
              <h2>JavaScript</h2>
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


          {/* =========================================
              07 NODE JS
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>07</small>
              <h2>Node.js</h2>
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


          {/* =========================================
              08 PYTHON
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>08</small>
              <h2>Python</h2>
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


          {/* =========================================
              09 PHP
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>09</small>
              <h2>PHP</h2>
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


          {/* =========================================
              10 CURL
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>10</small>
              <h2>cURL</h2>
            </div>

            <div className="code">

              <pre>{`curl "${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F"`}</pre>

            </div>

          </section>


          {/* =========================================
              11 BOT
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>11</small>
              <h2>Integrasi Bot</h2>
            </div>

            <p>
              API dapat digunakan pada bot. Bot menerima
              URL dari pengguna kemudian mengambil hasil
              download.
            </p>

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


          {/* =========================================
              12 ERROR
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>12</small>
              <h2>Error Response</h2>
            </div>

            <div className="code">

              <pre>{`{
  "success": false,
  "message": "URL tidak boleh kosong."
}`}</pre>

            </div>

            <p className="error-tip">
              Selalu periksa <code>success</code> sebelum
              menggunakan hasil dari API.
            </p>

          </section>


          {/* =========================================
              13 PLATFORM
          ========================================== */}
          <section className="docs-card">

            <div className="docs-title">
              <small>13</small>
              <h2>Platform</h2>
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


          {/* =========================================
              FOOTER
          ========================================== */}
          <footer className="docs-footer">

            <div className="footer-terminal">

              <span className="footer-prompt">
                $
              </span>

              <span>
                sidownload --status
              </span>

              <span className="footer-online">
                online
              </span>

            </div>

            <div className="footer-brand">

              <div className="docs-brand-icon">
                S
              </div>

              <div>
                <b>SIDOWNLOAD</b>
                <span>
                  FAST • SIMPLE • FREE
                </span>
              </div>

            </div>

            <p>
              SIDOWNLOAD Public API
            </p>

            <button
              onClick={goHome}
            >
              ← Kembali ke SIDOWNLOAD
            </button>

          </footer>

        </main>

      </div>

    </div>
  );
}
