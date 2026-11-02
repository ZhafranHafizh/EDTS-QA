import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly addToCartButton: Locator;

  constructor(page: any) {
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
    await this.addToCartButton.click({ force: true });
    await this.wait(2000);
  }

  /**
   * Assertion: Verifikasi bahwa dalam kondisi tanpa login, sistem
   * meminta user untuk autentikasi (memunculkan modal Masuk Akun).
   */
  async assertLoginRequiredModal(): Promise<void> {
    const authTextLocator = this.page.getByText(/Masuk Akun|Nomor Handphone atau Email/i).first();
    await expect(authTextLocator).toBeVisible({ timeout: 10000 });
  }
}
