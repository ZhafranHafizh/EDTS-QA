import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly makananCategoryLink: Locator;

  constructor(page: Page) {
    super(page);
    this.makananCategoryLink = this.page
      .locator('a[href*="/category/makanan"]')
      .filter({ hasText: /^Makanan$/ })
      .first();
  }

  /**
   * Step 1: Akses https://www.klikindomaret.com/
   */
  async navigate(): Promise<void> {
    // Retry once if transient network error occurs
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await this.page.goto('https://www.klikindomaret.com/', {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });
        break;
      } catch (err) {
        if (attempt === 2) throw err;
        await this.wait(2000);
      }
    }

    await this.wait(3000);
    await this.dismissModalsIfPresent();
  }

  /**
   * Step 2: Pilih Meta Kategori "Makanan"
   */
  async selectMetaCategoryMakanan(): Promise<void> {
    await this.dismissModalsIfPresent();

    await this.makananCategoryLink.waitFor({ state: 'visible', timeout: 15000 });
    const href = (await this.makananCategoryLink.getAttribute('href')) || '/xpress/category/makanan';

    await this.makananCategoryLink.click();

    // Wait for URL to change to category/makanan, or navigate if intercepted
    const navigated = await this.page
      .waitForURL(/category\/makanan/, { timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (!navigated) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    await this.wait(3000);
    await this.dismissModalsIfPresent();
  }
}
