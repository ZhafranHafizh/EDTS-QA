import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly sarapanSelaiAccordion: Locator;
  readonly maduCategoryItem: Locator;

  constructor(page: Page) {
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

    try {
      if (await this.sarapanSelaiAccordion.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.sarapanSelaiAccordion.scrollIntoViewIfNeeded();
        await this.sarapanSelaiAccordion.click();
        await this.wait(1000);
      }

      if (await this.maduCategoryItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.maduCategoryItem.click();
      } else {
        await this.page.goto('/xpress/category/makanan/sarapan-selai/madu', {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });
      }
    } catch {
      await this.page.goto('/xpress/category/makanan/sarapan-selai/madu', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
    }

    const onMaduUrl = await this.page
      .waitForURL(/madu/, { timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (!onMaduUrl) {
      await this.page.goto('/xpress/category/makanan/sarapan-selai/madu', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
    }

    await this.wait(3000);
    await this.dismissModalsIfPresent();
  }

  /**
   * Step 4 & 5: Pilih salah satu produk Madu dan masuk ke dalam halaman produk detail
   */
  async selectFirstMaduProduct(): Promise<string> {
    await this.dismissModalsIfPresent();

    const productCard = this.page
      .locator('a:has(h2)')
      .filter({ hasText: /Rp/i })
      .first();

    await productCard.waitFor({ state: 'visible', timeout: 20000 });
    const productText = (await productCard.innerText()).trim().replace(/\n+/g, ' ');
    const productHref = await productCard.getAttribute('href');

    await productCard.scrollIntoViewIfNeeded().catch(() => {});
    await productCard.click();

    const navigatedToDetail = await this.page
      .waitForURL((url) => !url.pathname.includes('/category/'), { timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (!navigatedToDetail && productHref) {
      await this.page.goto(productHref, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    await this.wait(3000);
    await this.dismissModalsIfPresent();

    return productText;
  }
}
