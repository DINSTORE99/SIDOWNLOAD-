import { useState } from "react";
import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";

const EXAMPLE_URL = "https://vt.tiktok.com/xxxxxx/";

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
      setTestError("Masukkan URL TikTok terlebih dahulu.");
      setResponse(null);
      setHttpStatus(null);
      return;
    }

    setLoading(true);
    setResponse(null);
    setHttpStatus(null);
    setTestError("");

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

      const data = await res.json();

      setResponse(data);
    } catch (error) {
      setTestError(
        error?.message || "Gagal terhubung ke API."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setTestUrl(EXAMPLE_URL);
    setResponse(null);
    setHttpStatus(null);
    setTestError("");
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

  const getStatusClass = () => {
    if (!httpStatus) return "";

    return httpStatus >= 400 ? "error" : "";
  };

  return (
    <div className="docs-page">

      {/* =========================================
          MAIN WINDOW
      ========================================= */}

      <div className="docs-window">

        {/* =========================================
            WINDOW BAR
        ========================================= */}

        <div className="docs-window-bar">

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

        </div>


        {/* =========================================
            HEADER
        ========================================= */}

        <header className="docs-header">

          <div className="docs-brand">

            <div className="docs-brand-icon">
              S
            </div>

            <div className="docs-brand-text">
              <b>SIDOWNLOAD</b>
              <span>API DOCUMENTATION</span>
            </div>

          </div>

          <button
            className="docs-back"
            onClick={goHome}
          >
            ← Back
          </button>

        </header>


        {/* =========================================
            CONTENT
        ========================================= */}

        <main className="docs-container">


          {/* =========================================
              INTRO
          ========================================= */}

          <section className="docs-intro">

            <div className="docs-badge">
              <i></i>
              API V1
            </div>

            <h1>
              Media Downloader <span>API</span>
            </h1>

            <p>
              API sederhana untuk memproses link TikTok
              dan mendapatkan informasi media secara cepat.
            </p>

          </section>


          {/* =========================================
              API TESTER
          ========================================= */}

          <section className="terminal-card">

            <div className="terminal-top">

              <div className="terminal-dots">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <span>
                api-tester
              </span>

              <button
                className="terminal-copy"
                onClick={copyEndpoint}
              >
                {copied ? "COPIED" : "COPY API"}
              </button>

            </div>


            <div className="terminal-body">

              <div className="terminal-command">
                <span className="terminal-prompt">
                  $
                </span>

                <span>
                  sidownload api --test
                </span>
              </div>


              <label className="terminal-label">
                TIKTOK URL
              </label>


              <input
                className="terminal-input"
                type="text"
                value={testUrl}
                onChange={(e) =>
                  setTestUrl(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runTest();
                  }
                }}
                placeholder="https://vt.tiktok.com/..."
              />


              <div className="tester-actions">

                <button
                  className="terminal-btn"
                  onClick={runTest}
                  disabled={loading}
                >
                  {loading ? "PROCESSING..." : "TEST API"}
                </button>

                <button
                  className="terminal-btn secondary"
                  onClick={loadExample}
                  disabled={loading}
                >
                  CONTOH
                </button>

              </div>


              {/* ERROR */}

              {testError && (
                <div className="terminal-error">
                  <span>✕</span>

                  <span>
                    {testError}
                  </span>
                </div>
              )}


              {/* HTTP STATUS */}

              {httpStatus && (
                <div
                  className={`http-status ${getStatusClass()}`}
                >
                  <span className="http-status-label">
                    HTTP STATUS
                  </span>

                  <span className="http-status-code">
                    {httpStatus}
                  </span>
                </div>
              )}


              {/* RESPONSE */}

              {response && (
                <div className="terminal-response">

                  <div className="response-header">

                    <span>
                      RESPONSE
                    </span>

                    <span
                      className={
                        response.success
                          ? "status-ok"
                          : "status-bad"
                      }
                    >
                      {response.success
                        ? "SUCCESS"
                        : "FAILED"}
                    </span>

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
              01 API ENDPOINT
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>01</small>

              <h2>
                API Endpoint
              </h2>
            </div>

            <p>
              Gunakan endpoint berikut untuk mengakses
              API SIDOWNLOAD.
            </p>

            <div className="endpoint">

              <strong>
                GET
              </strong>

              <code>
                {API}
              </code>

            </div>

            <div className="note">

              <b>
                Endpoint utama
              </b>

              <span>
                Gunakan parameter url untuk memasukkan
                link TikTok.
              </span>

            </div>

          </section>


          {/* =========================================
              02 PARAMETER
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>02</small>

              <h2>
                Parameter
              </h2>
            </div>

            <div className="parameter">

              <code>
                url
              </code>

              <div>

                <b>
                  string
                </b>

                <p>
                  URL video TikTok yang ingin diproses.
                </p>

              </div>

              <span className="required">
                REQUIRED
              </span>

            </div>

          </section>


          {/* =========================================
              03 REQUEST
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>03</small>

              <h2>
                Contoh Request
              </h2>
            </div>

            <p>
              Contoh request menggunakan link TikTok.
            </p>

            <div className="code">

              <pre>{`GET ${API}?url=https%3A%2F%2Fvt.tiktok.com%2Fxxxxxx%2F`}</pre>

            </div>

          </section>


          {/* =========================================
              04 JSON RESPONSE
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>04</small>

              <h2>
                JSON Response
              </h2>
            </div>

            <div className="code">

              <pre>{`{
  "success": true,
  "creator": "DINSTORE",
  "platform": "tiktok",
  "title": "Judul video TikTok",
  "thumbnail": "",
  "author": "username",
  "duration": "",
  "stats": "👁️   ❤️ ",
  "downloads": [
    {
      "text": "Download Video (No Watermark)",
      "type": "tiktok"
    },
    {
      "text": "Download Audio (MP3)",
      "type": "audio"
    }
  ]
}`}</pre>

            </div>

          </section>


          {/* =========================================
              05 DOWNLOADS
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>05</small>

              <h2>
                Downloads
              </h2>
            </div>

            <p>
              Data download tersedia pada array{" "}
              <code>downloads</code>.
            </p>

            <div className="code">

              <pre>{`data.downloads.forEach((item) => {
  console.log(item.text);
  console.log(item.type);
});`}</pre>

            </div>

          </section>


          {/* =========================================
              06 JAVASCRIPT
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>06</small>

              <h2>
                JavaScript
              </h2>
            </div>

            <div className="code">

              <pre>{`const url =
  "https://vt.tiktok.com/xxxxxx/";

const response = await fetch(
  "${API}?url=" +
  encodeURIComponent(url)
);

const data = await response.json();

if (data.success) {
  console.log("Judul:", data.title);
  console.log("Author:", data.author);

  data.downloads.forEach((item) => {
    console.log(item.text);
    console.log(item.type);
  });
} else {
  console.log(data.message);
}`}</pre>

            </div>

          </section>


          {/* =========================================
              07 NODE.JS
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>07</small>

              <h2>
                Node.js
              </h2>
            </div>

            <div className="code">

              <pre>{`const result = await download(
  "https://vt.tiktok.com/xxxxxx/"
);`}</pre>

            </div>

          </section>


          {/* =========================================
              08 PYTHON
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>08</small>

              <h2>
                Python
              </h2>
            </div>

            <div className="code">

              <pre>{`import requests

url = "https://vt.tiktok.com/xxxxxx/"

response = requests.get(
    "${API}",
    params={
        "url": url
    }
)

data = response.json()

if data["success"]:
    print("Judul:", data["title"])
    print("Author:", data["author"])

    for item in data["downloads"]:
        print(item["text"])
        print(item["type"])
else:
    print(data["message"])`}</pre>

            </div>

          </section>


          {/* =========================================
              09 PHP
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>09</small>

              <h2>
                PHP
              </h2>
            </div>

            <div className="code">

              <pre>{`<?php

$url =
  "https://vt.tiktok.com/xxxxxx/";

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

if ($data["success"]) {
  echo $data["title"];
} else {
  echo $data["message"];
}`}</pre>

            </div>

          </section>


          {/* =========================================
              10 CURL
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>10</small>

              <h2>
                cURL
              </h2>
            </div>

            <div className="code">

              <pre>{`curl "${API}?url=https%3A%2F%2Fvt.tiktok.com%2Fxxxxxx%2F"`}</pre>

            </div>

          </section>


          {/* =========================================
              11 BOT
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>11</small>

              <h2>
                Integrasi Bot
              </h2>
            </div>

            <p>
              Contoh mengambil informasi download
              untuk digunakan pada bot.
            </p>

            <div className="code">

              <pre>{`const response = await fetch(
  "${API}?url=" +
  encodeURIComponent(url)
);

const data = await response.json();

if (data.success) {
  for (const item of data.downloads) {
    console.log(
      item.text,
      item.type
    );
  }
}`}</pre>

            </div>

          </section>


          {/* =========================================
              12 ERROR
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>12</small>

              <h2>
                Error Response
              </h2>
            </div>

            <p className="error-tip">
              Response ketika URL tidak dikirim atau
              tidak dapat diproses.
            </p>

            <div className="code">

              <pre>{`{
  "success": false,
  "creator": "DINSTORE",
  "message": "URL tidak boleh kosong."
}`}</pre>

            </div>

          </section>


          {/* =========================================
              13 PLATFORMS
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>13</small>

              <h2>
                Platform
              </h2>
            </div>

            <div className="platforms">

              <div>
                TikTok
              </div>

              <div>
                Instagram
              </div>

              <div>
                YouTube
              </div>

              <div>
                Facebook
              </div>

              <div>
                CapCut
              </div>

              <div>
                Spotify
              </div>

            </div>

          </section>


          {/* =========================================
              USAGE NOTICE
          ========================================= */}

          <section className="docs-card">

            <div className="docs-title">
              <small>!</small>

              <h2>
                Jadilah Pengguna yang Bijak
              </h2>
            </div>

            <p>
              Gunakan API SIDOWNLOAD dengan bijak dan
              sesuai kebutuhan. Jangan gunakan layanan
              secara berlebihan atau untuk mengganggu
              layanan lainnya.
            </p>

            <p>
              Hormati pembuat dan pemilik konten.
              Pastikan penggunaan konten yang diproses
              melalui API tetap sesuai dengan aturan
              yang berlaku.
            </p>

            <div className="note">

              <b>
                Gunakan API SIDOWNLOAD dengan baik.
              </b>

              <span>
                Gunakan layanan secara bertanggung jawab.
              </span>

            </div>

          </section>


          {/* =========================================
              FOOTER
          ========================================= */}

          <footer className="docs-footer">

            <div className="footer-terminal">

              <span className="footer-prompt">
                $
              </span>

              <span>
                sidownload status:
              </span>

              <span className="footer-online">
                ONLINE
              </span>

            </div>


            <div className="footer-brand">

              <div className="docs-brand-icon">
                S
              </div>

              <div>

                <b>
                  SIDOWNLOAD
                </b>

                <span>
                  MEDIA DOWNLOADER API
                </span>

              </div>

            </div>


            <p>
              Simple • Fast • Free
            </p>


            <button onClick={goHome}>
              ← Kembali ke SIDOWNLOAD
            </button>

          </footer>

        </main>

      </div>

    </div>
  );
}
