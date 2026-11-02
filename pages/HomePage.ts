import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly makananCategoryLink: Locator;

  constructor(page: any) {
    super(page);
    this.makananCategoryLink = this.page
      .locator('a[href*="/category/makanan"]')
      .first();
  }

  /**
   * Step 1: Akses https://www.klikindomaret.com/
   */
  async navigate(): Promise<void> {
    // Using commit to prevent hanging on streaming/analytics scripts
    await this.page.goto('/', { waitUntil: 'commit', timeout: 30000 });
    await this.page.locator('text="Kategori"').first().waitFor({ state: 'visible', timeout: 25000 });
    await this.wait(1500);
    await this.dismissModalsIfPresent();
  }

  /**
   * Step 2: Pilih Meta Kategori "Makanan"
   */
  async selectMetaCategoryMakanan(): Promise<void> {
    await this.dismissModalsIfPresent();
    await this.makananCategoryLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.makananCategoryLink.scrollIntoViewIfNeeded().catch(() => {});
    await this.makananCategoryLink.click({ force: true });
    
    // Wait for Next.js navigation to category/makanan
    await this.page.waitForURL(/category\/makanan/, { timeout: 20000 });
    await this.wait(2000);
    await this.dismissModalsIfPresent();
  }
}
