import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = this.page
      .locator('button')
      .filter({ hasText: /keranjang/i })
      .first();
  }

  /**
   * Step 6: Klik button "+ Keranjang"
   */
  async clickAddToCart(): Promise<void> {
    await this.dismissModalsIfPresent();
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addToCartButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.addToCartButton.click();
    await this.wait(2500);
  }

  /**
   * Assertion: Verifikasi bahwa dalam kondisi tanpa login, sistem
   * meminta user untuk autentikasi (memunculkan modal Masuk Akun).
   */
  async assertLoginRequiredModal(): Promise<void> {
    const authModalText = this.page.getByText(/Masuk Akun|Nomor Handphone atau Email/i).first();
    await expect(authModalText).toBeVisible({ timeout: 10000 });
  }
}
