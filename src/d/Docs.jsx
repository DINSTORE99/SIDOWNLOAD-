import { useState } from "react";
import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";
const EXAMPLE_URL = "https://vt.tiktok.com/xxxxxx/";

export default function Docs() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const testApi = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        creator: "DINSTORE",
        message: "Gagal menghubungi API.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text, name) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(name);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setCopied("");
    }
  };

  const requestExample = `POST ${API}

Content-Type: application/json

{
  "url": "${EXAMPLE_URL}"
}`;

  const responseExample = `{
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
}`;

  const javascriptExample = `const response = await fetch("${API}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "${EXAMPLE_URL}"
  })
});

const data = await response.json();

console.log(data);`;

  const nodeExample = `const fetch = require("node-fetch");

const response = await fetch("${API}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "${EXAMPLE_URL}"
  })
});

const data = await response.json();

console.log(data);`;

  const pythonExample = `import requests

url = "${API}"

data = {
    "url": "${EXAMPLE_URL}"
}

response = requests.post(url, json=data)

print(response.json())`;

  const phpExample = `<?php

$url = "${API}";

$data = [
    "url" => "${EXAMPLE_URL}"
];

$options = [
    "http" => [
        "method" => "POST",
        "header" => "Content-Type: application/json",
        "content" => json_encode($data)
    ]
];

$context = stream_context_create($options);

$response = file_get_contents($url, false, $context);

echo $response;

?>`;

  const curlExample = `curl -X POST "${API}" \\
-H "Content-Type: application/json" \\
-d '{
  "url": "${EXAMPLE_URL}"
}'`;

  const botExample = `const response = await fetch("${API}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: message.text
  })
});

const data = await response.json();

if (data.success) {
  console.log(data.title);
  console.log(data.author);
  console.log(data.downloads);
}`;

  return (
    <div className="docs-page">
      <div className="docs-container">

        {/* HEADER */}
        <header className="docs-header">
          <div className="terminal-title">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>

            <span className="terminal-name">
              SIDOWNLOAD API
            </span>
          </div>

          <div className="docs-brand">
            <span className="brand-symbol">S</span>

            <div>
              <strong>SIDOWNLOAD</strong>
              <small>API DOCUMENTATION</small>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="docs-hero">
          <div className="hero-badge">
            <span className="status-dot"></span>
            API ONLINE
          </div>

          <h1>
            SIDOWNLOAD
            <span> API</span>
          </h1>

          <p>
            API downloader sederhana untuk mengambil media
            dari berbagai platform sosial media.
          </p>

          <div className="creator-badge">
            CREATED BY <strong>DINSTORE</strong>
          </div>
        </section>

        {/* API TESTER */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">01</span>

            <div>
              <h2>API Tester</h2>
              <p>Test API langsung dari halaman ini.</p>
            </div>
          </div>

          <div className="tester-box">
            <label>URL VIDEO</label>

            <div className="tester-input">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://vt.tiktok.com/xxxxxx/"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    testApi();
                  }
                }}
              />

              <button
                onClick={testApi}
                disabled={loading}
              >
                {loading ? "PROCESS..." : "TEST API"}
              </button>
            </div>

            {result && (
              <div className="tester-result">
                <div className="result-header">
                  <span>RESPONSE</span>

                  <span
                    className={
                      result.success
                        ? "result-status success"
                        : "result-status error"
                    }
                  >
                    {result.success ? "SUCCESS" : "ERROR"}
                  </span>
                </div>

                <pre>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* ENDPOINT */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">02</span>

            <div>
              <h2>Endpoint</h2>
              <p>Endpoint utama SIDOWNLOAD.</p>
            </div>
          </div>

          <div className="endpoint-card">
            <div className="method post">
              POST
            </div>

            <code>{API}</code>

            <button
              onClick={() => copyText(API, "endpoint")}
            >
              {copied === "endpoint" ? "COPIED" : "COPY"}
            </button>
          </div>

          <div className="info-card">
            <div>
              <strong>Method</strong>
              <span>POST</span>
            </div>

            <div>
              <strong>Content-Type</strong>
              <span>application/json</span>
            </div>

            <div>
              <strong>API Key</strong>
              <span>Tidak diperlukan</span>
            </div>
          </div>
        </section>

        {/* PARAMETER */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">03</span>

            <div>
              <h2>Parameter</h2>
              <p>Parameter yang digunakan oleh API.</p>
            </div>
          </div>

          <div className="table-card">
            <div className="table-row table-head">
              <span>Parameter</span>
              <span>Type</span>
              <span>Required</span>
              <span>Description</span>
            </div>

            <div className="table-row">
              <span className="code-text">url</span>
              <span>string</span>
              <span className="required">YES</span>
              <span>
                URL media yang ingin diproses
              </span>
            </div>
          </div>
        </section>

        {/* REQUEST */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">04</span>

            <div>
              <h2>Example Request</h2>
              <p>Contoh request menggunakan JSON.</p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>REQUEST</span>

              <button
                onClick={() =>
                  copyText(requestExample, "request")
                }
              >
                {copied === "request" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{requestExample}</pre>
          </div>
        </section>

        {/* RESPONSE */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">05</span>

            <div>
              <h2>JSON Response</h2>
              <p>
                Struktur response yang dikembalikan API.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>RESPONSE</span>

              <button
                onClick={() =>
                  copyText(responseExample, "response")
                }
              >
                {copied === "response" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{responseExample}</pre>
          </div>
        </section>

        {/* DOWNLOADS */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">06</span>

            <div>
              <h2>Downloads</h2>
              <p>
                Jenis hasil download yang dapat tersedia.
              </p>
            </div>
          </div>

          <div className="download-types">
            <div className="download-type">
              <div className="download-icon">
                🎬
              </div>

              <div>
                <strong>Video</strong>

                <span>
                  Download video tanpa watermark jika
                  tersedia dari sumber.
                </span>
              </div>
            </div>

            <div className="download-type">
              <div className="download-icon">
                🎵
              </div>

              <div>
                <strong>Audio</strong>

                <span>
                  Download audio MP3 jika platform
                  menyediakan hasil audio.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* JAVASCRIPT */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">07</span>

            <div>
              <h2>JavaScript</h2>
              <p>
                Contoh penggunaan menggunakan JavaScript.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>JAVASCRIPT</span>

              <button
                onClick={() =>
                  copyText(
                    javascriptExample,
                    "javascript"
                  )
                }
              >
                {copied === "javascript"
                  ? "COPIED"
                  : "COPY"}
              </button>
            </div>

            <pre>{javascriptExample}</pre>
          </div>
        </section>

        {/* NODE */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">08</span>

            <div>
              <h2>Node.js</h2>
              <p>
                Contoh penggunaan menggunakan Node.js.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>NODE.JS</span>

              <button
                onClick={() =>
                  copyText(nodeExample, "node")
                }
              >
                {copied === "node" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{nodeExample}</pre>
          </div>
        </section>

        {/* PYTHON */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">09</span>

            <div>
              <h2>Python</h2>
              <p>
                Contoh penggunaan menggunakan Python.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>PYTHON</span>

              <button
                onClick={() =>
                  copyText(pythonExample, "python")
                }
              >
                {copied === "python" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{pythonExample}</pre>
          </div>
        </section>

        {/* PHP */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">10</span>

            <div>
              <h2>PHP</h2>
              <p>
                Contoh penggunaan menggunakan PHP.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>PHP</span>

              <button
                onClick={() =>
                  copyText(phpExample, "php")
                }
              >
                {copied === "php" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{phpExample}</pre>
          </div>
        </section>

        {/* CURL */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">11</span>

            <div>
              <h2>cURL</h2>
              <p>
                Contoh request menggunakan cURL.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>CURL</span>

              <button
                onClick={() =>
                  copyText(curlExample, "curl")
                }
              >
                {copied === "curl" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{curlExample}</pre>
          </div>
        </section>

        {/* BOT */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">12</span>

            <div>
              <h2>Bot Integration</h2>
              <p>
                Contoh sederhana integrasi dengan bot.
              </p>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <span>BOT</span>

              <button
                onClick={() =>
                  copyText(botExample, "bot")
                }
              >
                {copied === "bot" ? "COPIED" : "COPY"}
              </button>
            </div>

            <pre>{botExample}</pre>
          </div>
        </section>

        {/* ERRORS */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">13</span>

            <div>
              <h2>Errors</h2>
              <p>
                Response ketika terjadi kesalahan.
              </p>
            </div>
          </div>

          <div className="error-list">

            <div className="error-item">
              <span className="error-code">
                400
              </span>

              <div>
                <strong>Bad Request</strong>

                <p>
                  URL tidak dikirim atau URL tidak valid.
                </p>
              </div>
            </div>

            <div className="error-item">
              <span className="error-code">
                404
              </span>

              <div>
                <strong>Not Found</strong>

                <p>
                  Platform tidak didukung oleh API.
                </p>
              </div>
            </div>

            <div className="error-item">
              <span className="error-code">
                405
              </span>

              <div>
                <strong>Method Not Allowed</strong>

                <p>
                  Method HTTP yang digunakan tidak
                  didukung.
                </p>
              </div>
            </div>

            <div className="error-item">
              <span className="error-code">
                500
              </span>

              <div>
                <strong>Internal Server Error</strong>

                <p>
                  Terjadi kesalahan pada server API.
                </p>
              </div>
            </div>

            <div className="error-item">
              <span className="error-code">
                502
              </span>

              <div>
                <strong>Bad Gateway</strong>

                <p>
                  Server sumber gagal memberikan response.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* PLATFORM */}
        <section className="docs-section">
          <div className="section-heading">
            <span className="number">14</span>

            <div>
              <h2>Supported Platform</h2>
              <p>
                Platform yang tersedia pada API.
              </p>
            </div>
          </div>

          <div className="platform-grid">

            <div className="platform-card">
              <span>♪</span>
              <strong>TikTok</strong>
              <small>Video & Audio</small>
            </div>

            <div className="platform-card">
              <span>◎</span>
              <strong>Instagram</strong>
              <small>Video</small>
            </div>

            <div className="platform-card">
              <span>f</span>
              <strong>Facebook</strong>
              <small>Video</small>
            </div>

            <div className="platform-card">
              <span>▣</span>
              <strong>CapCut</strong>
              <small>Video</small>
            </div>

            <div className="platform-card">
              <span>♫</span>
              <strong>Spotify</strong>
              <small>Audio</small>
            </div>

            <div className="platform-card">
              <span>▶</span>
              <strong>YouTube</strong>
              <small>Video & Audio</small>
            </div>

          </div>
        </section>

        {/* USE RESPONSIBLY */}
        <section className="docs-section">
          <div className="usage-notice">
            <div className="usage-icon">
              ⚠️
            </div>

            <div className="usage-content">
              <h3>Jadilah Pengguna yang Bijak</h3>

              <p>
                Gunakan API SIDOWNLOAD dengan bijak dan sesuai
                kebutuhan. Jangan gunakan layanan secara berlebihan
                atau untuk mengganggu layanan lainnya.
              </p>

              <p>
                Hormati pembuat dan pemilik konten. Pastikan
                penggunaan konten yang diproses melalui API tetap
                sesuai dengan aturan yang berlaku.
              </p>

              <span className="usage-note">
                Gunakan API SIDOWNLOAD dengan baik dan
                bertanggung jawab.
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
