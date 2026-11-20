import { useState } from "react";
import "./Docs.css";

const API = "https://sidownload.dinn.my.id/api/download";

const EXAMPLES = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/reel/xxxxx/",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@username/video/xxxxx",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/watch?v=xxxxx",
  },
];

export default function Docs() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const testApi = async () => {
    const input = url.trim();

    if (!input) {
      setError("URL tidak boleh kosong.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(
        `${API}?url=${encodeURIComponent(input)}`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Response API bukan JSON yang valid.");
      }

      if (!response.ok || !data.success) {
        setError(
          data?.message ||
            `Request gagal dengan status ${response.status}.`
        );

        setResult(data);
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        err?.message ||
          "Tidak dapat terhubung ke API SIDOWNLOAD."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyJson = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result, null, 2)
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const useExample = (exampleUrl) => {
    setUrl(exampleUrl);
    setError("");
    setResult(null);
  };

  const clearTest = () => {
    setUrl("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  return (
    <div className="docs-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="terminal-header">

        <div className="terminal-brand">

          <div className="terminal-logo">
            S
          </div>

          <div>
            <div className="terminal-title">
              SIDOWNLOAD
            </div>

            <div className="terminal-subtitle">
              PUBLIC API / DOCUMENTATION
            </div>
          </div>

        </div>

        <button
          className="terminal-home"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          [ HOME ]
        </button>

      </header>


      <main className="terminal-container">

        {/* =========================================
            TERMINAL INFO
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              sidownload@api:~
            </span>

            <span className="terminal-online">
              ● ONLINE
            </span>

          </div>

          <div className="terminal-body">

            <div className="terminal-line">
              <span className="green">$</span>
              <span>sidownload --info</span>
            </div>

            <div className="terminal-output">
              SIDOWNLOAD Public API
              <br />
              Fast media downloader API
              <br />
              No API key required
              <br />
              Supported: TikTok / Instagram / Facebook
              / CapCut / YouTube / Spotify
            </div>


            <div className="terminal-line">
              <span className="green">$</span>
              <span>endpoint</span>
            </div>

            <div className="terminal-command">
              GET {API}?url=LINK
            </div>

          </div>

        </section>


        {/* =========================================
            API TESTER
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              api-tester
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">
              <span className="green">$</span>
              <span>
                sidownload --test
              </span>
            </div>


            <div className="terminal-input-line">

              <span className="prompt">
                &gt;
              </span>

              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    testApi();
                  }
                }}
                placeholder="paste media URL here..."
                spellCheck="false"
                autoComplete="off"
              />

            </div>


            <div className="example-section">

              <div className="example-title">
                EXAMPLES
              </div>

              <div className="example-buttons">

                {EXAMPLES.map((example) => (
                  <button
                    key={example.name}
                    type="button"
                    onClick={() => useExample(example.url)}
                  >
                    {example.name}
                  </button>
                ))}

              </div>

            </div>


            <button
              className="terminal-execute"
              onClick={testApi}
              disabled={loading}
            >
              {loading
                ? "[ PROCESSING... ]"
                : "[ EXECUTE ]"}
            </button>


            {url && !loading && (
              <button
                className="terminal-clear"
                onClick={clearTest}
              >
                [ CLEAR ]
              </button>
            )}


            {error && (
              <div className="terminal-error">

                <span className="error-icon">
                  ✕
                </span>

                <div>
                  <strong>
                    Request failed
                  </strong>

                  <span>
                    {error}
                  </span>
                </div>

              </div>
            )}

          </div>

        </section>


        {/* =========================================
            REQUEST INFO
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              request
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">
              <span className="green">$</span>
              <span>
                cat request.txt
              </span>
            </div>


            <div className="request-block">

              <div className="request-row">
                <span className="request-key">
                  METHOD
                </span>

                <span className="request-value green">
                  GET
                </span>
              </div>


              <div className="request-row">

                <span className="request-key">
                  ENDPOINT
                </span>

                <span className="request-value">
                  /api/download
                </span>

              </div>


              <div className="request-row">

                <span className="request-key">
                  PARAMETER
                </span>

                <span className="request-value">
                  url
                </span>

              </div>


              <div className="request-row">

                <span className="request-key">
                  AUTH
                </span>

                <span className="request-value green">
                  NONE
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            JSON RESULT
        ========================================= */}

        {result && (
          <section className="terminal-window">

            <div className="terminal-bar">

              <div className="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span className="terminal-bar-title">
                response.json
              </span>

              <span
                className={
                  result.success
                    ? "terminal-success"
                    : "terminal-failed"
                }
              >
                {result.success
                  ? "200 OK"
                  : "ERROR"}
              </span>

            </div>


            <div className="terminal-body">

              <div className="terminal-line result-command">

                <span className="green">
                  $
                </span>

                <span>
                  cat response.json
                </span>

                <button
                  className="copy-json"
                  onClick={copyJson}
                >
                  {copied
                    ? "[ COPIED ]"
                    : "[ COPY ]"}
                </button>

              </div>


              <pre className="terminal-json">
                {JSON.stringify(result, null, 2)}
              </pre>

            </div>

          </section>
        )}


        {/* =========================================
            DOWNLOAD RESULTS
        ========================================= */}

        {result?.success &&
          Array.isArray(result?.downloads) &&
          result.downloads.length > 0 && (

            <section className="terminal-window">

              <div className="terminal-bar">

                <div className="terminal-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span className="terminal-bar-title">
                  downloads
                </span>

              </div>


              <div className="terminal-body">

                <div className="terminal-line">

                  <span className="green">
                    $
                  </span>

                  <span>
                    ls -la downloads
                  </span>

                </div>


                <div className="terminal-downloads">

                  {result.downloads.map(
                    (item, index) => (

                      <a
                        key={`${item.url}-${index}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="terminal-download-item"
                      >

                        <span className="download-number">
                          [{index + 1}]
                        </span>

                        <div className="download-info">

                          <strong>
                            {item.text ||
                              "Download Media"}
                          </strong>

                          <span>
                            {item.type ||
                              "media"}
                          </span>

                        </div>

                        <span className="download-arrow">
                          →
                        </span>

                      </a>

                    )
                  )}

                </div>

              </div>

            </section>

          )}


        {/* =========================================
            JAVASCRIPT
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              javascript.js
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                cat javascript.js
              </span>

            </div>


            <pre className="terminal-code">
{`const url =
  "https://www.instagram.com/reel/xxxxx/";

const response = await fetch(
  "${API}?url=" +
  encodeURIComponent(url)
);

const data = await response.json();

console.log(data);`}
            </pre>

          </div>

        </section>


        {/* =========================================
            NODE JS
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              node.js
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                cat node.js
              </span>

            </div>


            <pre className="terminal-code">
{`async function download(url) {

  const api =
    "${API}?url=" +
    encodeURIComponent(url);

  const response =
    await fetch(api);

  return await response.json();
}

const result = await download(
  "https://www.instagram.com/reel/xxxxx/"
);

console.log(result);`}
            </pre>

          </div>

        </section>


        {/* =========================================
            PYTHON
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              python.py
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                cat python.py
              </span>

            </div>


            <pre className="terminal-code">
{`import requests

url = "https://www.instagram.com/reel/xxxxx/"

response = requests.get(
    "${API}",
    params={
        "url": url
    }
)

data = response.json()

print(data)`}
            </pre>

          </div>

        </section>


        {/* =========================================
            PHP
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              php.php
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                cat php.php
              </span>

            </div>


            <pre className="terminal-code">
{`<?php

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

?>`}
            </pre>

          </div>

        </section>


        {/* =========================================
            CURL
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              curl
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                curl --request
              </span>

            </div>


            <pre className="terminal-code">
{`curl "${API}?url=https%3A%2F%2Fwww.instagram.com%2Freel%2Fxxxxx%2F"`}
            </pre>

          </div>

        </section>


        {/* =========================================
            BOT
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              bot-integration
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                cat bot.js
              </span>

            </div>


            <pre className="terminal-code">
{`const api =
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

}`}
            </pre>

          </div>

        </section>


        {/* =========================================
            ERROR RESPONSE
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              errors
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                cat error.json
              </span>

            </div>


            <pre className="terminal-json">
{`{
  "success": false,
  "message": "URL tidak boleh kosong."
}`}
            </pre>


            <div className="terminal-tip">
              Always check
              <span> success </span>
              before using the API response.
            </div>

          </div>

        </section>


        {/* =========================================
            PLATFORM
        ========================================= */}

        <section className="terminal-window">

          <div className="terminal-bar">

            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-bar-title">
              supported-platforms
            </span>

          </div>


          <div className="terminal-body">

            <div className="terminal-line">

              <span className="green">
                $
              </span>

              <span>
                sidownload --platforms
              </span>

            </div>


            <div className="platform-terminal-list">

              <div>
                <span>01</span>
                TikTok
              </div>

              <div>
                <span>02</span>
                Instagram
              </div>

              <div>
                <span>03</span>
                Facebook
              </div>

              <div>
                <span>04</span>
                CapCut
              </div>

              <div>
                <span>05</span>
                YouTube
              </div>

              <div>
                <span>06</span>
                Spotify
              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            FOOTER
        ========================================= */}

        <footer className="terminal-footer">

          <div>

            <span className="green">
              SIDOWNLOAD
            </span>

            <span>
              {" "}Public API
            </span>

          </div>


          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            [ ← HOME ]
          </button>

        </footer>

      </main>

    </div>
  );
}
