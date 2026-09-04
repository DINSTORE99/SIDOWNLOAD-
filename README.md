<div align="center">


  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vercel-Dark.svg" width="65" height="65" alt="SIDOWNLOAD Logo" />

  # ⚡ SIDOWNLOAD
  **Fast • Simple • Free Universal Media Downloader**

  Download video dan audio dari berbagai platform favorit tanpa watermark, cepat, dan responsif.

  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-1ed760?style=for-the-badge)](LICENSE)

</div>

---

### 📱 Fitur Unggulan

* **Multi-Platform Support**: Unduh media dari TikTok, Instagram, Facebook, CapCut, Spotify, dan YouTube.
* **Auto Clipboard Paste**: Tombol tempel otomatis untuk kemudahan akses di perangkat mobile dan desktop.
* **Serverless Architecture**: Ekstraksi media diproses di backend Vercel Serverless Function (`api/download.js`), menjaga privasi network browser.
* **Telegram Bot Telemetry**: Notifikasi instan via Telegram bot saat ada user berkunjung, memproses link, atau mengunduh media.
* **Local Storage History**: Menyimpan riwayat unduhan terakhir langsung di browser pengguna tanpa database eksternal.
* **Responsive Dark Neon UI**: Desain bertema gelap pekat dengan aksen hijau neon Spotify-style dan mockup interaktif.

---

### 🌐 Platform yang Didukung

| Platform | Format Unduhan | Keterangan |
| :--- | :--- | :--- |
| **TikTok** | MP4 & MP3 | HD No Watermark + Audio Original |
| **Instagram** | MP4 / JPG | Reels, Video Post, & Carousel |
| **YouTube** | MP4 & MP3 | Video resolusi tinggi & Audio extract |
| **Spotify** | MP3 | Full song audio tracks |
| **Facebook** | MP4 | Opsi kualitas HD & SD |
| **CapCut** | MP4 | Template video tanpa watermark |

---

### 📂 Struktur Direktori

```text
sidownload/
├── api/
│   ├── download.js      # Serverless core parser & API proxy
│   └── notify.js        # Telegram webhook telemetry
├── src/
│   ├── App.jsx          # Frontend client component
│   ├── main.jsx         # React DOM root render
│   └── style.css        # Pure custom dark-neon theme
├── .gitignore
├── index.html           # HTML template & font loader
├── package.json
├── README.md
└── vite.config.js

