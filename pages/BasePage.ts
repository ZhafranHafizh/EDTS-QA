import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Dismiss any actually open modal (.modal-open) such as the QR App promo
   * or Exit-intent modal, while keeping the Auth/Login modal untouched.
   */
  async dismissModalsIfPresent(): Promise<void> {
    try {
      // Only target modals that actually have the 'modal-open' class
      const openModalCloseBtn = this.page.locator(
        '.modal-open #modalAppsQRDesktop button[aria-label="Close"], .modal-open button[aria-label="Close"], .modal-open button:text-is("Batal")'
      );

      const count = await openModalCloseBtn.count();
      for (let i = 0; i < count; i++) {
        const btn = openModalCloseBtn.nth(i);
        if (await btn.isVisible().catch(() => false)) {
          await btn.click({ timeout: 3000 }).catch(() => {});
          await this.page.waitForTimeout(300);
        }
      }
    } catch {
      // Ignore if no open modal is present
    }
  }

  async wait(ms: number = 1000): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
