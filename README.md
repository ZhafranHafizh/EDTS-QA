# Web Automation Testing - Klik Indomaret (EDTS QA Technical Test)

Repository ini berisi skrip automated testing berbasis **Playwright** dengan bahasa **TypeScript** dan arsitektur **Page Object Model (POM)**.

---

## 📌 Skenario Uji (Test Steps)

Sesuai instruksi soal:
1. **Akses** `https://www.klikindomaret.com/`
2. **Pilih Meta Kategori** *"Makanan"*
3. **Pilih kategori** *"Madu"* (berada di bawah taksonomi *Sarapan & Selai > Madu*)
4. **Pilih salah satu produk Madu**
5. **Masuk ke dalam halaman produk detail**
6. **Klik button** *"+ Keranjang"*
7. **Verifikasi/Assertion**: Memvalidasi bahwa dalam kondisi tanpa login, sistem Klik Indomaret meminta user untuk autentikasi (memunculkan modal *"Masuk Akun"*).

---

## 🏗️ Struktur Proyek (Page Object Model)

```text
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI workflow otomatis di GitHub Actions
├── pages/
│   ├── BasePage.ts                # Base class & handler pop-up/promo
│   ├── HomePage.ts                # Halaman beranda & pemilihan Meta Kategori
│   ├── CategoryPage.ts            # Halaman daftar kategori & seleksi produk Madu
│   └── ProductDetailPage.ts       # Halaman detail & aksi +Keranjang
├── tests/
│   └── klikindomaret.spec.ts      # Test spec skenario end-to-end
├── playwright.config.ts           # Konfigurasi Playwright (viewport, args, timeout)
├── tsconfig.json                  # Konfigurasi TypeScript
├── package.json                   # Dependencies & npm scripts
└── README.md                      # Dokumentasi pengujian
```

---

## 🚀 Prasyarat & Instalasi

Pastikan komputer sudah terinstall **Node.js** (v18 ke atas) dan browser Chromium/Chrome.

1. Clone repository:
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd "EDTS QA"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browser:
   ```bash
   npx playwright install chromium
   ```

---

## 🧪 Menjalankan Pengujian

Tersedia beberapa perintah pengujian melalui npm scripts:

- **Menjalankan test secara headless (standar):**
  ```bash
  npm test
  ```

- **Menjalankan test dengan browser terbuka (Headed mode):**
  ```bash
  npm run test:headed
  ```

- **Menjalankan test dengan Playwright Interactive UI:**
  ```bash
  npm run test:ui
  ```

- **Melihat laporan HTML pengujian:**
  ```bash
  npm run report
  ```

---

## 💡 Catatan Teknis & Solusi Stabilitas

1. **Penanganan Pop-up & Banner Promo**:
   - Klik Indomaret secara default memunculkan modal QR download app saat pertama kali diakses. `BasePage.ts` dilengkapi fungsi `dismissModalsIfPresent()` untuk menutup modal tersebut secara otomatis agar tidak memblokir event klik.
2. **Cloudflare & Network Policy (Private Network Access)**:
   - Situs dilindungi oleh Cloudflare dan memuat skrip dengan address space khusus. Parameter launch browser pada `playwright.config.ts` telah dikonfigurasi dengan:
     - `--disable-blink-features=AutomationControlled`
     - `--disable-web-security`
     - `--disable-features=BlockInsecurePrivateNetworkRequests...`
3. **Responsive Breakpoint**:
   - Sidebar navigasi kategori Klik Indomaret menggunakan breakpoint desktop. Viewport diatur pada resolusi `1440x900` untuk memastikan elemen kategori selalu terlihat (*visible*).

