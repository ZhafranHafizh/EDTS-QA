import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly sarapanSelaiAccordion: Locator;
  readonly maduCategoryItem: Locator;

  constructor(page: any) {
    super(page);
    this.sarapanSelaiAccordion = this.page.getByText('Sarapan & Selai').first();
    this.maduCategoryItem = this.page
      .locator('span:text-is("Madu"), a:text-is("Madu")')
      .first();
  }

  /**
   * Step 3: Pilih kategori "Madu"
   */
  async selectCategoryMadu(): Promise<void> {
    await this.dismissModalsIfPresent();

    const directMaduLink = this.page.locator('a[href*="/category/makanan/sarapan-selai/madu"]').first();

    try {
      if (await directMaduLink.isVisible().catch(() => false)) {
        await directMaduLink.click();
      } else {
        if (await this.sarapanSelaiAccordion.isVisible().catch(() => false)) {
          await this.sarapanSelaiAccordion.scrollIntoViewIfNeeded();
          await this.sarapanSelaiAccordion.click();
          await this.wait(1000);
        }

        if (await this.maduCategoryItem.isVisible({ timeout: 5000 }).catch(() => false)) {
          await this.maduCategoryItem.click();
        } else {
          await this.page.goto('/xpress/category/makanan/sarapan-selai/madu', { waitUntil: 'domcontentloaded' });
        }
      }
    } catch {
      await this.page.goto('/xpress/category/makanan/sarapan-selai/madu', { waitUntil: 'domcontentloaded' });
    }

    await this.page.waitForURL(/madu/, { timeout: 15000 }).catch(() => {});
    await this.wait(2000);
    await this.dismissModalsIfPresent();
  }

  /**
   * Step 4 & 5: Pilih salah satu produk Madu dan masuk ke dalam halaman produk detail
   */
  async selectFirstMaduProduct(): Promise<string> {
    await this.dismissModalsIfPresent();

    // Locate product card item that contains product title and price
    const productCard = this.page.locator('a:has(h2)').filter({ hasText: /Rp/i }).first();

    await productCard.waitFor({ state: 'visible', timeout: 15000 });
    const productText = (await productCard.innerText()).trim().replace(/\n+/g, ' ');

    await productCard.scrollIntoViewIfNeeded().catch(() => {});
    await productCard.click({ force: true });

    // Wait for product detail page to load
    await this.page.waitForURL(url => !url.pathname.includes('/category/'), { timeout: 15000 });
    await this.wait(2000);
    await this.dismissModalsIfPresent();

    return productText;
  }
}
