import { useState } from "react";
import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";

const EXAMPLE_URL =
  "https://vt.tiktok.com/xxxxxx/";

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

  return (
    <div className="docs-page">
      <div className="docs-window">

        {/* WINDOW BAR */}
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

        {/* HEADER */}
        <header className="docs-header">
          <div>
            <div className="docs-brand">
              SIDOWNLOAD
            </div>

            <div className="docs-subtitle">
              API DOCUMENTATION
            </div>
          </div>

          <button
            className="docs-back"
            onClick={goHome}
          >
            ← Back
          </button>
        </header>

        <main className="docs-container">

          {/* INTRO */}
          <section className="docs-intro">
            <div className="intro-badge">
              API V1
            </div>

            <h1>
              Media Downloader API
            </h1>

            <p>
              API sederhana untuk memproses link TikTok
              dan mendapatkan informasi media secara
              cepat.
            </p>
          </section>

          {/* API TESTER */}
          <section className="docs-section">
            <div className="section-number">
              00
            </div>

            <div className="section-content">
              <div className="section-title">
                API Tester
              </div>

              <p>
                Masukkan link TikTok untuk mencoba API
                secara langsung.
              </p>

              <div className="api-tester">
                <div className="tester-input-row">
                  <input
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

                  <button
                    onClick={runTest}
                    disabled={loading}
                  >
                    {loading ? "TEST..." : "TEST API"}
                  </button>
                </div>

                <button
                  className="example-button"
                  onClick={loadExample}
                >
                  Gunakan Contoh
                </button>

                {testError && (
                  <div className="test-error">
                    {testError}
                  </div>
                )}

                {httpStatus && (
                  <div className="http-status">
                    <span className="http-status-label">
                      HTTP STATUS
                    </span>

                    <span className="http-status-code">
                      {httpStatus}
                    </span>
                  </div>
                )}

                {response && (
                  <div className="tester-response">
                    <div className="response-header">
                      <span>RESPONSE</span>

                      <span
                        className={
                          response.success
                            ? "response-success"
                            : "response-failed"
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
            </div>
          </section>

          {/* 01 */}
          <section className="docs-section">
            <div className="section-number">
              01
            </div>

            <div className="section-content">
              <div className="section-title">
                API Endpoint
              </div>

              <p>
                Gunakan endpoint berikut untuk
                mengakses API SIDOWNLOAD.
              </p>

              <div className="code-box">
                <code>{API}</code>

                <button
                  className="copy-button"
                  onClick={copyEndpoint}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </section>

          {/* 02 */}
          <section className="docs-section">
            <div className="section-number">
              02
            </div>

            <div className="section-content">
              <div className="section-title">
                Parameter
              </div>

              <div className="parameter-box">
                <div className="parameter-name">
                  url
                </div>

                <div className="parameter-type">
                  string
                </div>

                <div className="parameter-desc">
                  URL video TikTok yang ingin diproses.
                </div>
              </div>
            </div>
          </section>

          {/* 03 */}
          <section className="docs-section">
            <div className="section-number">
              03
            </div>

            <div className="section-content">
              <div className="section-title">
                Contoh Request
              </div>

              <pre className="code-block">
{`GET ${API}?url=https%3A%2F%2Fvt.tiktok.com%2Fxxxxxx%2F`}
              </pre>
            </div>
          </section>

          {/* 04 */}
          <section className="docs-section">
            <div className="section-number">
              04
            </div>

            <div className="section-content">
              <div className="section-title">
                JSON Response
              </div>

              <pre className="code-block">
{`{
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
}`}
              </pre>
            </div>
          </section>

          {/* 05 */}
          <section className="docs-section">
            <div className="section-number">
              05
            </div>

            <div className="section-content">
              <div className="section-title">
                Downloads
              </div>

              <p>
                Data download tersedia pada array
                <code> downloads</code>.
              </p>

              <pre className="code-block">
{`data.downloads.forEach((item) => {
  console.log(item.text);
  console.log(item.type);
});`}
              </pre>
            </div>
          </section>

          {/* 06 */}
          <section className="docs-section">
            <div className="section-number">
              06
            </div>

            <div className="section-content">
              <div className="section-title">
                JavaScript
              </div>

              <pre className="code-block">
{`const url =
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
}`}
              </pre>
            </div>
          </section>

          {/* 07 */}
          <section className="docs-section">
            <div className="section-number">
              07
            </div>

            <div className="section-content">
              <div className="section-title">
                Node.js
              </div>

              <pre className="code-block">
{`const result = await download(
  "https://vt.tiktok.com/xxxxxx/"
);`}
              </pre>
            </div>
          </section>

          {/* 08 */}
          <section className="docs-section">
            <div className="section-number">
              08
            </div>

            <div className="section-content">
              <div className="section-title">
                Python
              </div>

              <pre className="code-block">
{`import requests

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
    print(data["message"])`}
              </pre>
            </div>
          </section>

          {/* 09 */}
          <section className="docs-section">
            <div className="section-number">
              09
            </div>

            <div className="section-content">
              <div className="section-title">
                PHP
              </div>

              <pre className="code-block">
{`<?php

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
}`}
              </pre>
            </div>
          </section>

          {/* 10 */}
          <section className="docs-section">
            <div className="section-number">
              10
            </div>

            <div className="section-content">
              <div className="section-title">
                cURL
              </div>

              <pre className="code-block">
{`curl "${API}?url=https%3A%2F%2Fvt.tiktok.com%2Fxxxxxx%2F"`}
              </pre>
            </div>
          </section>

          {/* 11 */}
          <section className="docs-section">
            <div className="section-number">
              11
            </div>

            <div className="section-content">
              <div className="section-title">
                Integrasi Bot
              </div>

              <p>
                Contoh mengambil informasi download
                untuk digunakan pada bot.
              </p>

              <pre className="code-block">
{`const response = await fetch(
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
}`}
              </pre>
            </div>
          </section>

          {/* 12 */}
          <section className="docs-section">
            <div className="section-number">
              12
            </div>

            <div className="section-content">
              <div className="section-title">
                Error Response
              </div>

              <pre className="code-block">
{`{
  "success": false,
  "creator": "DINSTORE",
  "message": "URL tidak boleh kosong."
}`}
              </pre>
            </div>
          </section>

          {/* 13 */}
          <section className="docs-section">
            <div className="section-number">
              13
            </div>

            <div className="section-content">
              <div className="section-title">
                Platform
              </div>

              <div className="platform-list">
                <span>TikTok</span>
                <span>Instagram</span>
                <span>YouTube</span>
                <span>Facebook</span>
                <span>CapCut</span>
                <span>Spotify</span>
              </div>
            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="docs-footer">
          <div>
            SIDOWNLOAD API
          </div>

          <span>
            Powered by DINSTORE
          </span>
        </footer>

      </div>
    </div>
  );
}
