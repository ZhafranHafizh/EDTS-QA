import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Klik Indomaret - Web Automation Test (Tanpa Login)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Playwright native Locator Handler for Exit-intent modal
    await page.addLocatorHandler(
      page.getByText('Keluar dari Klik Indomaret', { exact: true }),
      async () => {
        const batalBtn = page.locator('button').filter({ hasText: /^Batal$/i }).first();
        if (await batalBtn.isVisible().catch(() => false)) {
          await batalBtn.click({ force: true }).catch(() => {});
        }
        await page.evaluate(() => {
          document.querySelectorAll('.modal-open').forEach(m => {
            if (m.textContent?.includes('Keluar dari Klik Indomaret')) {
              m.classList.remove('modal-open');
              m.remove();
            }
          });
        }).catch(() => {});
      }
    );

    // 2. Playwright native Locator Handler for App QR promo popup
    await page.addLocatorHandler(
      page.locator('#modalAppsQRDesktop button[aria-label="Close"], #modalAppsQRDesktop'),
      async () => {
        const closeBtn = page.locator('#modalAppsQRDesktop button[aria-label="Close"]').first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click({ force: true }).catch(() => {});
        }
        await page.evaluate(() => {
          const qr = document.querySelector('#modalAppsQRDesktop');
          if (qr) {
            qr.closest('.modal-open')?.remove();
            qr.remove();
          }
        }).catch(() => {});
      }
    );
  });

  test('User dapat memilih produk Madu di Meta Kategori Makanan dan klik +Keranjang', async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productDetailPage = new ProductDetailPage(page);

    // Step 1: Akses https://www.klikindomaret.com/
    await test.step('1. Akses https://www.klikindomaret.com/', async () => {
      await homePage.navigate();
      expect(page.url()).toContain('klikindomaret.com');
    });

    // Step 2: Pilih Meta Kategori "Makanan"
    await test.step('2. Pilih Meta Kategori "Makanan"', async () => {
      await homePage.selectMetaCategoryMakanan();
      expect(page.url()).toContain('/category/makanan');
    });

    // Step 3: Pilih kategori "Madu"
    await test.step('3. Pilih kategori "Madu"', async () => {
      await categoryPage.selectCategoryMadu();
      expect(page.url()).toContain('/madu');
    });

    // Step 4 & 5: Pilih salah satu produk Madu dan masuk ke dalam halaman produk detail
    await test.step('4 & 5. Pilih salah satu produk Madu & Masuk ke halaman produk detail', async () => {
      const selectedProduct = await categoryPage.selectFirstMaduProduct();
      console.log(`[TEST LOG] Produk yang dipilih: ${selectedProduct}`);
      expect(page.url()).not.toContain('/category/');
    });

    // Step 6: Klik button "+ Keranjang"
    await test.step('6. Klik button "+ Keranjang"', async () => {
      await productDetailPage.clickAddToCart();
    });

    // Assertion: Kondisi tanpa login memunculkan modal login / autentikasi
    await test.step('Verifikasi modal login muncul (kondisi tanpa login)', async () => {
      await productDetailPage.assertLoginRequiredModal();
    });
  });
});
