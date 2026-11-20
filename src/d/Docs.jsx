import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";

export default function Docs() {
  return (
    <div className="docs-page">

      {/* HEADER */}
      <header className="docs-header">
        <div
          className="docs-brand"
          onClick={() => window.location.href = "/"}
        >
          <div className="docs-brand-icon">S</div>

          <div>
            <b>SIDOWNLOAD</b>
            <span>API DOCUMENTATION</span>
          </div>
        </div>

        <button
          className="docs-back"
          onClick={() => window.location.href = "/"}
        >
          ← Home
        </button>
      </header>

      <main className="docs-container">

        {/* INTRO */}
        <section className="docs-intro">
          <span className="docs-badge">
            PUBLIC API
          </span>

          <h1>
            SIDOWNLOAD
            <br />
            <span>API Documentation</span>
          </h1>

          <p>
            Dokumentasi penggunaan API SIDOWNLOAD untuk
            website, aplikasi, bot, dan project lainnya.
          </p>
        </section>

        {/* ENDPOINT */}
        <section className="docs-card">
          <div className="docs-title">
            <small>01</small>
            <h2>API Endpoint</h2>
          </div>

          <p>
            Gunakan endpoint berikut untuk memproses link media.
          </p>

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
            <h2>Parameter</h2>
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
            <h2>Contoh Request</h2>
          </div>

          <div className="code">
            <pre>{`GET ${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F`}</pre>
          </div>
        </section>

        {/* JSON */}
        <section className="docs-card">
          <div className="docs-title">
            <small>04</small>
            <h2>JSON Response</h2>
          </div>

          <p>
            Jika berhasil, API akan mengembalikan JSON seperti berikut:
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

        {/* DOWNLOADS */}
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

        {/* JAVASCRIPT */}
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

        {/* NODE JS */}
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

        {/* PYTHON */}
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

        {/* PHP */}
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

        {/* CURL */}
        <section className="docs-card">
          <div className="docs-title">
            <small>10</small>
            <h2>cURL</h2>
          </div>

          <div className="code">
            <pre>{`curl "${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F"`}</pre>
          </div>
        </section>

        {/* BOT */}
        <section className="docs-card">
          <div className="docs-title">
            <small>11</small>
            <h2>Integrasi Bot</h2>
          </div>

          <p>
            API dapat digunakan pada bot. Bot menerima URL
            dari pengguna kemudian mengambil hasil download.
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

        {/* ERROR */}
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

        {/* PLATFORM */}
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
            onClick={() => window.location.href = "/"}
          >
            ← Kembali ke SIDOWNLOAD
          </button>

        </footer>

      </main>
    </div>
  );
}
