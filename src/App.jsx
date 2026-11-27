import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import "./style.css";

// ==========================================
// CONFIG
// ==========================================

const APK_LINK = "https://sfile.co/PXfhrhLw6sk";

const PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#00f2fe">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.07V9.42a6.32 6.32 0 1 0 6.34 6.32V8.87a8.16 8.16 0 0 0 4.77 1.52V6.95a4.85 4.85 0 0 1-1-.26z" />
      </svg>
    ),
  },

  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#e1306c">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },

  {
    id: "facebook",
    name: "Facebook",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },

  {
    id: "capcut",
    name: "CapCut",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M4 8l8-4.5L20 8l-8 4.5L4 8zm0 8l8 4.5 8-4.5-8-4.5-8 4.5z" />
      </svg>
    ),
  },

  {
    id: "youtube",
    name: "YouTube",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },

  {
    id: "spotify",
    name: "Spotify",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1ed760">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.307a.75.75 0 0 1-1.034.25c-2.83-1.73-6.393-2.122-10.59-1.164a.75.75 0 1 1-.334-1.462c4.593-1.05 8.547-.604 11.708 1.342.348.213.46.666.25 1.034zm1.47-3.268a.938.938 0 0 1-1.29.312c-3.238-1.99-8.175-2.565-12.007-1.4a.938.938 0 0 1-.546-1.794c4.379-1.33 9.83-.695 13.53 1.59a.937.937 0 0 1 .313 1.292zm.129-3.418c-3.882-2.305-10.29-2.518-14.01-1.389a1.125 1.125 0 0 1-.652-2.153c4.275-1.297 11.346-1.045 15.815 1.61a1.125 1.125 0 1 1-1.153 1.932z" />
      </svg>
    ),
  },
];

// ==========================================
// MAIN APP
// ==========================================

function MainApp() {
  const [url, setUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);

  // ========================================
  // SUPABASE
  // ========================================

  const [visitorCount, setVisitorCount] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [reviewName, setReviewName] =
    useState("");

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewComment, setReviewComment] =
    useState("");

  const [loadingReview, setLoadingReview] =
    useState(false);

  const [reviewMsg, setReviewMsg] =
    useState("");

  const [showReviewModal, setShowReviewModal] =
    useState(false);

  // ========================================
  // APK BANNER
  // ========================================

  const [showDownloadBanner, setShowDownloadBanner] =
    useState(false);

  // ========================================
  // TELEGRAM NOTIFICATION
  // ========================================

  const sendTelegramNotification = (
    type,
    details = {}
  ) => {
    fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        type,
        details,
      }),
    }).catch(() => {});
  };

  // ========================================
  // FETCH REVIEWS
  // ========================================

  const fetchReviews = async () => {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (!error && data) {
        setReviews(data);
      }
    } catch {}
  };

  // ========================================
  // INITIALIZE
  // ========================================

  useEffect(() => {
    sendTelegramNotification("visit");

    const bannerTimer =
      setTimeout(() => {
        setShowDownloadBanner(true);
      }, 500);

    // History

    try {
      const saved =
        localStorage.getItem(
          "sidownload_history"
        );

      if (saved) {
        setHistory(
          JSON.parse(saved)
        );
      }
    } catch {}

    // Visitor

    const initVisitor = async () => {
      try {
        const hasCounted =
          sessionStorage.getItem(
            "sidownload_visitor_counted"
          );

        if (!hasCounted) {
          await supabase.rpc(
            "increment_visitor",
            {
              site_id: "global",
            }
          );

          sessionStorage.setItem(
            "sidownload_visitor_counted",
            "1"
          );
        }

        const {
          data,
        } = await supabase
          .from("site_stats")
          .select("visitors_count")
          .eq("id", "global")
          .single();

        if (data) {
          setVisitorCount(
            data.visitors_count
          );
        }
      } catch {}
    };

    initVisitor();
    fetchReviews();

    return () => {
      clearTimeout(
        bannerTimer
      );
    };
  }, []);

  // ========================================
  // HISTORY
  // ========================================

  const saveToHistory = (item) => {
    const updated = [
      item,
      ...history.filter(
        (h) =>
          h.url !== item.url
      ),
    ].slice(0, 8);

    setHistory(updated);

    try {
      localStorage.setItem(
        "sidownload_history",
        JSON.stringify(updated)
      );
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);

    try {
      localStorage.removeItem(
        "sidownload_history"
      );
    } catch {}
  };

  // ========================================
  // PASTE
  // ========================================

  const handlePaste = async () => {
    try {
      const text =
        await navigator.clipboard.readText();

      if (text) {
        setUrl(text.trim());
        setError("");
      }
    } catch {
      const input =
        document.querySelector(
          ".input-box"
        );

      if (input) {
        input.focus();

        setError(
          "Silakan tahan (long-press) di kolom input lalu klik Tempel."
        );
      }
    }
  };

  // ========================================
  // DOWNLOAD
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputUrl =
      url.trim();

    if (!inputUrl) {
      setError(
        "Masukkan tautan terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    sendTelegramNotification(
      "process",
      {
        url: inputUrl,
      }
    );

    try {
      const response =
        await fetch(
          "/api/download",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              url: inputUrl,
            }),
          }
        );

      const rawText =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(rawText);
      } catch {
        throw new Error(
          "Server mengembalikan response yang tidak valid."
        );
      }

      // ====================================
      // ERROR SERVER
      // ====================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Gagal memproses media."
        );
      }

      // ====================================
      // API ERROR
      // ====================================

      if (
        data?.success !== true
      ) {
        throw new Error(
          data?.message ||
            "Media gagal diproses."
        );
      }

      // ====================================
      // VALIDATE DOWNLOADS
      // ====================================

      const downloads =
        Array.isArray(
          data?.downloads
        )
          ? data.downloads.filter(
              (item) =>
                item?.url
            )
          : [];

      if (
        downloads.length === 0
      ) {
        throw new Error(
          "Link download tidak ditemukan."
        );
      }

      // ====================================
      // NORMALIZE RESULT
      // ====================================

      const normalized = {
        success: true,

        platform:
          data?.platform ||
          selectedPlatform ||
          "media",

        title:
          data?.title ||
          "Media File",

        thumbnail:
          data?.thumbnail ||
          "",

        author:
          data?.author ||
          "",

        duration:
          data?.duration ||
          "",

        stats:
          data?.stats ||
          "",

        downloads,
      };

      setResult(
        normalized
      );

      setSelectedPlatform(
        normalized.platform
      );

      // ====================================
      // HISTORY
      // ====================================

      saveToHistory({
        title:
          normalized.title,

        platform:
          normalized.platform,

        url:
          downloads[0]?.url ||
          inputUrl,

        date:
          new Date().toLocaleDateString(
            "id-ID"
          ),
      });

    } catch (err) {
      console.error(
        "SIDOWNLOAD:",
        err
      );

      setError(
        err?.message ||
          "Terjadi kendala saat menghubungi server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // DOWNLOAD CLICK
  // ========================================

  const handleDownloadClick = (
    label
  ) => {
    sendTelegramNotification(
      "downloaded",
      {
        title:
          result?.title,

        platform:
          result?.platform,

        label,
      }
    );
  };

  // ========================================
  // CLEAR RESULT
  // ========================================

  const clearResult = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  // ========================================
  // APK
  // ========================================

  const handleDownloadAPK = () => {
    if (!APK_LINK) {
      alert(
        "Link download APK belum disetel."
      );

      return;
    }

    sendTelegramNotification(
      "apk_download",
      {
        url: APK_LINK,
      }
    );

    window.open(
      APK_LINK,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ========================================
  // REVIEW
  // ========================================

  const handleReviewSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !reviewName.trim() ||
        !reviewComment.trim()
      ) {
        return;
      }

      setLoadingReview(true);
      setReviewMsg("");

      try {
        const {
          error,
        } = await supabase
          .from("reviews")
          .insert([
            {
              name:
                reviewName.trim(),

              rating:
                Number(
                  reviewRating
                ),

              comment:
                reviewComment.trim(),
            },
          ]);

        if (!error) {
          setReviewName("");
          setReviewComment("");
          setReviewRating(5);

          setReviewMsg(
            "Ulasan berhasil dikirim!"
          );

          fetchReviews();
        } else {
          setReviewMsg(
            "Gagal mengirim ulasan: " +
              error.message
          );
        }
      } catch {
        setReviewMsg(
          "Terjadi kendala saat mengirim ulasan."
        );
      } finally {
        setLoadingReview(false);
      }
    };

  const avgRating =
    reviews.length
      ? (
          reviews.reduce(
            (acc, curr) =>
              acc +
              Number(
                curr.rating || 0
              ),
            0
          ) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="sidownload-app">

      {/* ================================== */}
      {/* APK BANNER */}
      {/* ================================== */}

      {showDownloadBanner && (
        <div className="apk-download-banner">

          <button
            type="button"
            className="apk-banner-close"
            onClick={() =>
              setShowDownloadBanner(
                false
              )
            }
          >
            ×
          </button>

          <div className="apk-banner-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="34"
              height="34"
              style={{
                borderRadius:
                  "8px",
              }}
            >
              <rect
                width="512"
                height="512"
                rx="115"
                fill="#08090a"
              />

              <g
                transform="translate(40, 40) scale(18)"
              >
                <path
                  d="M12 6c-2.5 0-4 1.2-4 3 0 3.5 8 1.5 8 5 0 2-1.7 3-4 3s-4.2-1.1-4.2-2.5h2.2c0 .5 1 1 2 1s2-.5 2-1.2c0-3.5-8-1.5-8-5 0-2.3 1.8-3.3 4-3.3 2.1 0 3.8 1 3.8 2.5h-2.1c-.2-.6-1-1-1.7-1z"
                  fill="#1ed760"
                />
              </g>
            </svg>
          </div>

          <div className="apk-banner-info">
            <span className="apk-banner-title">
              Download App SIDOWNLOAD
            </span>

            <span className="apk-banner-desc">
              Lebih cepat & bebas ribet!
            </span>
          </div>

          <a
            href={APK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="apk-banner-btn"
            onClick={() =>
              handleDownloadAPK()
            }
          >
            Download
          </a>
        </div>
      )}

      {/* ================================== */}
      {/* NAVBAR */}
      {/* ================================== */}

      <nav className="navbar">

        <div className="brand-wrapper">

          <div className="brand-icon">
            S
          </div>

          <div className="brand-text">

            <h2>
              SIDOWNLOAD
            </h2>

            <span>
              FAST • SIMPLE • FREE
            </span>

          </div>

        </div>

        <div
          className="visitor-badge-compact"
          title="Total Pengunjung"
        >
          <span className="visitor-icon">
            👁️
          </span>

          <span className="visitor-count">
            {visitorCount !== null
              ? `${visitorCount.toLocaleString()} dikunjungi`
              : "..."}
          </span>
        </div>

      </nav>

      {/* ================================== */}
      {/* MAIN */}
      {/* ================================== */}

      <main className="content-container">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <section className="hero-section">

          <div className="badge-tag">
            <span className="dot"></span>

            <span>
              MEDIA DOWNLOADER
            </span>
          </div>

          <h1 className="hero-title">
            Download Video
            <br />
            & Audio{" "}
            <span className="text-green">
              Tanpa Ribet
            </span>
          </h1>

          <p className="hero-desc">
            Download media favorit kamu
            dengan cepat, sederhana, dan
            gratis.
          </p>

        </section>

        {/* ================================= */}
        {/* MOCKUP */}
        {/* ================================= */}

        <div className="mockup-container">

          <div className="orbit-icon pos-top-left">
            {PLATFORMS[0].icon}
          </div>

          <div className="orbit-icon pos-top-right">
            {PLATFORMS[1].icon}
          </div>

          <div className="orbit-icon pos-mid-left">
            {PLATFORMS[3].icon}
          </div>

          <div className="orbit-icon pos-mid-right">
            {PLATFORMS[4].icon}
          </div>

          <div className="phone-mockup">

            <div className="mockup-inner">

              <span className="mockup-brand">
                SIDOWNLOAD
              </span>

              <div className="mockup-play-screen">

                <div className="mockup-glow"></div>

                <div className="mockup-play-btn">

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#000"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>

                </div>

              </div>

              <div className="mockup-bars">
                <div className="mockup-bar w-long"></div>
                <div className="mockup-bar w-short"></div>
              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* PLATFORM */}
        {/* ================================= */}

        <div className="section-header">

          <span className="section-label">
            SUPPORTED
          </span>

          <h3 className="section-title">
            Pilih Platform
          </h3>

        </div>

        <div className="platform-grid">

          {PLATFORMS.map(
            (item) => (
              <button
                type="button"
                key={item.id}
                className={`platform-card ${
                  selectedPlatform ===
                  item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedPlatform(
                    item.id
                  )
                }
              >
                {item.icon}

                <span>
                  {item.name}
                </span>
              </button>
            )
          )}

        </div>

        {/* ================================= */}
        {/* INPUT */}
        {/* ================================= */}

        <div className="section-header">

          <span className="section-label">
            DOWNLOAD
          </span>

          <h3 className="section-title">
            Masukkan Link
          </h3>

        </div>

        <form
          className="input-card"
          onSubmit={
            handleSubmit
          }
        >

          <div className="input-field-wrapper">

            <input
              type="text"
              className="input-box"
              placeholder="Tempel tautan video / musik di sini..."
              value={url}
              onChange={(e) => {
                setUrl(
                  e.target.value
                );

                setError("");
              }}
            />

            <button
              type="button"
              className="paste-btn"
              onClick={
                handlePaste
              }
              title="Tempel dari Clipboard"
            >

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />

                <rect
                  x="8"
                  y="2"
                  width="8"
                  height="4"
                  rx="1"
                  ry="1"
                />
              </svg>

              <span>
                Paste
              </span>

            </button>

          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading ||
              !url.trim()
            }
          >
            {loading
              ? "Memproses..."
              : "Download Sekarang"}
          </button>

          {/* ERROR */}

          {error && (
            <div className="msg-error">
              ❌ {error}
            </div>
          )}

          {/* ================================= */}
          {/* RESULT */}
          {/* ================================= */}

          {result && (
            <div className="result-card">

              <div className="result-header">

                <span className="section-label">
                  DETAIL MEDIA
                </span>

                <span className="platform-badge">
                  {result.platform}
                </span>

              </div>

              {/* THUMBNAIL */}

              {result.thumbnail && (
                <div className="media-thumbnail-wrapper">

                  <img
                    src={
                      result.thumbnail
                    }
                    alt="Thumbnail"
                    className="media-thumbnail"
                    onError={(
                      e
                    ) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  {result.duration && (
                    <span className="media-duration">
                      {
                        result.duration
                      }
                    </span>
                  )}

                </div>
              )}

              {/* TITLE */}

              <h4 className="media-title">
                {result.title}
              </h4>

              {/* AUTHOR */}

              {result.author && (
                <div className="media-author">
                  <span>
                    👤{" "}
                    {
                      result.author
                    }
                  </span>
                </div>
              )}

              {/* STATS */}

              {result.stats && (
                <div className="media-stats">
                  {result.stats}
                </div>
              )}

              {/* DOWNLOAD */}

              <div className="download-options-title">
                OPSI UNDUHAN
              </div>

              <div className="download-buttons-group">

                {result.downloads?.map(
                  (
                    item,
                    index
                  ) => {

                    if (
                      !item?.url
                    ) {
                      return null;
                    }

                    return (
                      <a
                        key={`${item.url}-${index}`}
                        href={
                          item.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className={`download-link download-${
                          item.type ||
                          result.platform
                        }`}
                        onClick={() =>
                          handleDownloadClick(
                            item.text ||
                              "Download"
                          )
                        }
                      >

                        <span>
                          {item.text ||
                            "Download"}
                        </span>

                        <span>
                          ↓
                        </span>

                      </a>
                    );
                  }
                )}

              </div>

              {/* NEW SEARCH */}

              <button
                type="button"
                className="clear-btn"
                onClick={
                  clearResult
                }
              >
                ← Cari Link Lain
              </button>

            </div>
          )}

        </form>

        {/* ================================= */}
        {/* HISTORY */}
        {/* ================================= */}

        {history.length > 0 && (
          <div className="history-section">

            <div className="history-header">

              <span className="section-label">
                RIWAYAT
              </span>

              <button
                className="clear-history-btn"
                onClick={
                  clearHistory
                }
              >
                Hapus
              </button>

            </div>

            <div className="history-list">

              {history.map(
                (
                  item,
                  i
                ) => (
                  <div
                    key={i}
                    className="history-item"
                  >

                    <div className="history-meta">

                      <span className="history-title">
                        {
                          item.title
                        }
                      </span>

                      <span className="history-date">
                        {item.platform?.toUpperCase()}{" "}
                        •{" "}
                        {
                          item.date
                        }
                      </span>

                    </div>

                    <a
                      href={
                        item.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="history-dl-btn"
                    >
                      ↓
                    </a>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* ================================= */}
        {/* INSTRUCTIONS */}
        {/* ================================= */}

        <section className="instructions-section">

          <div className="section-header">

            <span className="section-label">
              PANDUAN
            </span>

            <h3 className="section-title">
              Cara Penggunaan
            </h3>

          </div>

          <div className="steps-container">

            <div className="step-card">

              <div className="step-number">
                1
              </div>

              <div className="step-content">

                <h4>
                  Salin Link Media
                </h4>

                <p>
                  Buka aplikasi TikTok,
                  Instagram, YouTube,
                  Spotify, CapCut, dll.,
                  lalu salin tautannya.
                </p>

              </div>

            </div>

            <div className="step-card">

              <div className="step-number">
                2
              </div>

              <div className="step-content">

                <h4>
                  Tekan Tombol Paste
                </h4>

                <p>
                  Tempel link ke dalam
                  kotak input atau tekan
                  tombol Paste.
                </p>

              </div>

            </div>

            <div className="step-card">

              <div className="step-number">
                3
              </div>

              <div className="step-content">

                <h4>
                  Download Sekarang
                </h4>

                <p>
                  Pilih opsi download yang
                  tersedia untuk menyimpan
                  media.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* REVIEWS */}
        {/* ================================= */}

        <section className="reviews-section">

          <div className="section-header">

            <span className="section-label">
              REVIEW
            </span>

            <h3 className="section-title">
              Ulasan Pengguna
            </h3>

          </div>

          <div className="review-summary">

            <strong>
              ⭐ {avgRating}
            </strong>

            <span>
              {reviews.length} ulasan
            </span>

          </div>

          {reviews.length > 0 && (
            <div className="reviews-list">

              {reviews
                .slice(0, 5)
                .map(
                  (
                    review,
                    index
                  ) => (
                    <div
                      className="review-item"
                      key={
                        review.id ||
                        index
                      }
                    >

                      <div className="review-top">

                        <strong>
                          {
                            review.name
                          }
                        </strong>

                        <span>
                          {"⭐".repeat(
                            Number(
                              review.rating ||
                                0
                            )
                          )}
                        </span>

                      </div>

                      <p>
                        {
                          review.comment
                        }
                      </p>

                    </div>
                  )
                )}

            </div>
          )}

          <button
            type="button"
            className="review-open-btn"
            onClick={() =>
              setShowReviewModal(
                true
              )
            }
          >
            Beri Ulasan
          </button>

        </section>

      </main>

      {/* ================================== */}
      {/* REVIEW MODAL */}
      {/* ================================== */}

      {showReviewModal && (
        <div className="review-modal-overlay">

          <div className="review-modal">

            <button
              type="button"
              className="review-modal-close"
              onClick={() =>
                setShowReviewModal(
                  false
                )
              }
            >
              ×
            </button>

            <span className="section-label">
              REVIEW
            </span>

            <h3>
              Berikan Ulasan
            </h3>

            <form
              onSubmit={
                handleReviewSubmit
              }
            >

              <input
                type="text"
                placeholder="Nama kamu"
                value={
                  reviewName
                }
                onChange={(e) =>
                  setReviewName(
                    e.target.value
                  )
                }
              />

              <select
                value={
                  reviewRating
                }
                onChange={(e) =>
                  setReviewRating(
                    Number(
                      e.target.value
                    )
                  )
                }
              >
                <option value="5">
                  ⭐⭐⭐⭐⭐
                </option>

                <option value="4">
                  ⭐⭐⭐⭐
                </option>

                <option value="3">
                  ⭐⭐⭐
                </option>

                <option value="2">
                  ⭐⭐
                </option>

                <option value="1">
                  ⭐
                </option>
              </select>

              <textarea
                placeholder="Tulis ulasan kamu..."
                value={
                  reviewComment
                }
                onChange={(e) =>
                  setReviewComment(
                    e.target.value
                  )
                }
                rows="4"
              />

              {reviewMsg && (
                <div className="review-message">
                  {reviewMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loadingReview
                }
              >
                {loadingReview
                  ? "Mengirim..."
                  : "Kirim Ulasan"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* ================================== */}
      {/* FOOTER */}
      {/* ================================== */}

      <footer className="footer">

        <strong>
          SIDOWNLOAD
        </strong>

        <span>
          FAST • SIMPLE • FREE
        </span>

      </footer>

    </div>
  );
}

// ==========================================
// EXPORT
// ==========================================

export default MainApp;
