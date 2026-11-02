import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Helper to dismiss any promotional, exit intent, or blocking popups.
   * Keeps the 'Masuk Akun' modal untouched for assertions.
   */
  async dismissModalsIfPresent(): Promise<void> {
    try {
      // 1. Dismiss "Keluar dari Klik Indomaret" if present
      const batalBtn = this.page.locator('button:text-is("Batal")').first();
      if (await batalBtn.isVisible().catch(() => false)) {
        await batalBtn.click().catch(() => {});
        await this.page.waitForTimeout(300);
      }

      // 2. Dismiss Promo QR modal / close buttons
      const closeButtons = this.page.locator(
        '#modalAppsQRDesktop button, button[aria-label="Close"], button:text-is("close")'
      );
      const count = await closeButtons.count();
      for (let i = 0; i < count; i++) {
        if (await closeButtons.nth(i).isVisible().catch(() => false)) {
          await closeButtons.nth(i).click().catch(() => {});
          await this.page.waitForTimeout(300);
        }
      }

      // 3. Remove non-auth modal backdrops if any are still intercepting clicks
      await this.page.evaluate(() => {
        const modals = document.querySelectorAll('.modal-open, #modalAppsQRDesktop');
        modals.forEach((m) => {
          if (!m.textContent?.includes('Masuk Akun') && !m.textContent?.includes('Nomor Handphone')) {
            m.remove();
          }
        });
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }

  /**
   * Helper wait for client-side rendering.
   */
  async wait(ms: number = 1000): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
