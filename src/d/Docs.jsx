import { useState } from "react";
import "./Docs.css";

const API =
  "https://sidownload.dinn.my.id/api/download";

const EXAMPLE_URL =
  "https://vt.tiktok.com/ZSsS9roM1/";

export default function Docs() {
  const [testUrl, setTestUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [httpStatus, setHttpStatus] = useState(null);
  const [testError, setTestError] = useState("");
  const [copied, setCopied] = useState(false);

  // ==========================================
  // TEST API
  // ==========================================

  const runTest = async () => {
    const value = testUrl.trim();

    if (!value) {
      setTestError(
        "Masukkan URL TikTok terlebih dahulu."
      );

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
          creator: "DINSTORE",
          message: "Response bukan JSON.",
          raw,
        };
      }

      setResponse(data);
    } catch (error) {
      console.error(error);

      setTestError(
        "Tidak dapat terhubung ke API. Pastikan endpoint sedang online."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EXAMPLE
  // ==========================================

  const loadExample = () => {
    setTestUrl(EXAMPLE_URL);
    setTestError("");
    setResponse(null);
    setHttpStatus(null);
  };

  // ==========================================
  // COPY API
  // ==========================================

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

  // ==========================================
  // HOME
  // ==========================================

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="docs-page">

      {/* =========================================
          TERMINAL / BROWSER WINDOW
      ========================================== */}

      <div className="docs-window">

        {/* =========================================
            WINDOW BAR
        ========================================== */}

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
              Dokumentasi penggunaan Public API
              SIDOWNLOAD untuk website, aplikasi,
              bot, dan project lainnya.
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
                {copied
                  ? "Copied!"
                  : "Copy API"}
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
                TIKTOK URL
              </label>


              <input
                type="url"
                value={testUrl}
                onChange={(e) => {
                  setTestUrl(
                    e.target.value
                  );

                  setTestError("");
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    runTest();
                  }
                }}
                placeholder="https://vt.tiktok.com/..."
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


              {(response ||
                httpStatus) && (
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
              Gunakan endpoint berikut untuk
              memproses link TikTok.
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
                API dapat digunakan langsung
                tanpa authentication.
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
                  URL TikTok yang ingin
                  diproses.
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

              <pre>{`GET ${API}?url=https%3A%2F%2Fvt.tiktok.com%2FZSsS9roM1%2F`}</pre>

            </div>

          </section>


          {/* =========================================
              04 JSON RESPONSE
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>04</small>
              <h2>JSON Response</h2>
            </div>

            <p>
              Jika berhasil, API akan mengembalikan
              response JSON seperti berikut:
            </p>

            <div className="code">

              <pre>{`{
  "success": true,
  "creator": "DINSTORE",
  "platform": "tiktok",
  "title": "❤️‍🔥 #dancer #dance #foryoupage #jj #capcut",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "author": "sell_gull",
  "duration": "",
  "stats": "👁️ 514.9K   ❤️ 46.5K",
  "downloads": [
    {
      "url": "https://example.com/video.mp4",
      "text": "Download Video (No Watermark)",
      "type": "tiktok"
    },
    {
      "url": "https://example.com/audio.mp3",
      "text": "Download Audio (MP3)",
      "type": "audio"
    }
  ]
}`}</pre>

            </div>

          </section>


          {/* =========================================
              05 CREATOR
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>05</small>
              <h2>Creator</h2>
            </div>

            <p>
              Setiap response API memiliki
              identitas pembuat API.
            </p>

            <div className="code">

              <pre>{`{
  "creator": "DINSTORE"
}`}</pre>

            </div>

            <div className="note">

              <b>
                DINSTORE
              </b>

              <span>
                Identitas creator dari Public API
                SIDOWNLOAD.
              </span>

            </div>

          </section>


          {/* =========================================
              06 DOWNLOADS
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>06</small>
              <h2>Downloads</h2>
            </div>

            <p>
              Hasil download berada di dalam
              array <code>downloads</code>.
            </p>

            <div className="code">

              <pre>{`data.downloads.forEach((item) => {
  console.log(item.text);
  console.log(item.url);
});`}</pre>

            </div>

          </section>


          {/* =========================================
              07 JAVASCRIPT
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>07</small>
              <h2>JavaScript</h2>
            </div>

            <div className="code">

              <pre>{`const url =
  "https://vt.tiktok.com/ZSsS9roM1/";

const response = await fetch(
  "${API}?url=" +
  encodeURIComponent(url)
);

const data =
  await response.json();

if (data.success) {

  console.log(
    "Creator:",
    data.creator
  );

  console.log(
    "Judul:",
    data.title
  );

  console.log(
    "Author:",
    data.author
  );

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
              08 NODE JS
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>08</small>
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

const result =
  await download(
    "https://vt.tiktok.com/ZSsS9roM1/"
  );

console.log(result);`}</pre>

            </div>

          </section>


          {/* =========================================
              09 PYTHON
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>09</small>
              <h2>Python</h2>
            </div>

            <div className="code">

              <pre>{`import requests

url = "https://vt.tiktok.com/ZSsS9roM1/"

response = requests.get(
    "${API}",
    params={
        "url": url
    }
)

data = response.json()

print(data)

if data["success"]:

    print(
        "Creator:",
        data["creator"]
    )

    print(
        "Title:",
        data["title"]
    )

    for item in data["downloads"]:
        print(item["url"])

else:

    print(data["message"])`}</pre>

            </div>

          </section>


          {/* =========================================
              10 PHP
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>10</small>
              <h2>PHP</h2>
            </div>

            <div className="code">

              <pre>{`<?php

$url =
  "https://vt.tiktok.com/ZSsS9roM1/";

$api =
  "${API}?url=" .
  urlencode($url);

$response =
  file_get_contents($api);

$data =
  json_decode(
    $response,
    true
  );

print_r($data);

if ($data["success"]) {

  echo $data["title"];

  foreach (
    $data["downloads"]
    as $item
  ) {

    echo $item["url"];

  }

}

?>`}</pre>

            </div>

          </section>


          {/* =========================================
              11 CURL
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>11</small>
              <h2>cURL</h2>
            </div>

            <div className="code">

              <pre>{`curl "${API}?url=https%3A%2F%2Fvt.tiktok.com%2FZSsS9roM1%2F"`}</pre>

            </div>

          </section>


          {/* =========================================
              12 BOT
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>12</small>
              <h2>Integrasi Bot</h2>
            </div>

            <p>
              API dapat digunakan pada bot WhatsApp,
              Telegram, Discord, dan bot lainnya.
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

  return "❌ " + data.message;

}

let message =
  "✅ TikTok berhasil diproses\\\\n\\\\n";

message +=
  "Creator: " +
  data.creator +
  "\\\\n";

message +=
  "Judul: " +
  data.title +
  "\\\\n";

message +=
  "Author: " +
  data.author +
  "\\\\n\\\\n";

for (
  const item
  of data.downloads
) {

  message +=
    item.text +
    ":\\\\n" +
    item.url +
    "\\\\n\\\\n";

}

console.log(message);`}</pre>

            </div>

          </section>


          {/* =========================================
              13 ERROR
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>13</small>
              <h2>Error Response</h2>
            </div>

            <p>
              Jika terjadi kesalahan, API akan
              mengembalikan response seperti berikut:
            </p>

            <div className="code">

              <pre>{`{
  "success": false,
  "creator": "DINSTORE",
  "platform": "tiktok",
  "message": "URL tidak boleh kosong."
}`}</pre>

            </div>

            <p className="error-tip">
              Selalu periksa{" "}
              <code>success</code>{" "}
              sebelum menggunakan hasil dari API.
            </p>

          </section>


          {/* =========================================
              14 HTTP STATUS
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>14</small>
              <h2>HTTP Status</h2>
            </div>

            <div className="platforms">

              <div>
                <b>200</b>
                <span>
                  Berhasil
                </span>
              </div>

              <div>
                <b>400</b>
                <span>
                  Request tidak valid
                </span>
              </div>

              <div>
                <b>404</b>
                <span>
                  Media tidak ditemukan
                </span>
              </div>

              <div>
                <b>405</b>
                <span>
                  Method tidak diizinkan
                </span>
              </div>

              <div>
                <b>500</b>
                <span>
                  Server error
                </span>
              </div>

              <div>
                <b>502</b>
                <span>
                  Upstream error
                </span>
              </div>

            </div>

          </section>


          {/* =========================================
              15 PLATFORM
          ========================================== */}

          <section className="docs-card">

            <div className="docs-title">
              <small>15</small>
              <h2>Platform</h2>
            </div>

            <p>
              Endpoint yang sama juga mendeteksi
              platform secara otomatis.
            </p>

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
