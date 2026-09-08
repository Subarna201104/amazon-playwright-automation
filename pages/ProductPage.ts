import { Locator, Page } from '@playwright/test';

export interface ProductInfo {
  title: string;
  price: string;
  productDetails: string;
  extras: Record<string, string>;
  url: string;
  capturedAt: string;
}

export class ProductPage {
  readonly page: Page;
  private readonly title: Locator;
  private readonly featureBullets: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('span#productTitle');
    this.featureBullets = page.locator('#feature-bullets');
  }

  async waitForLoaded(): Promise<void> {
    await this.title.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async captureProductInfo(): Promise<ProductInfo> {
    await this.waitForLoaded();

    const title = (await this.title.innerText()).trim();
    const price = await this.capturePrice();
    const aboutThisItem = (await this.featureBullets.innerText().catch(() => '')).trim();
    const productDetails = await this.captureProductDetails();

    const extras: Record<string, string> = {};
    extras['About this item'] = aboutThisItem;
    extras['Brand'] = await this.readOptional('#bylineInfo');
    extras['Availability'] = await this.readOptional('#availability');
    extras['Rating'] = await this.readOptional('#acrPopover, #averageCustomerReviews');
    extras['ASIN'] = await this.readAsin();

    return {
      title,
      price,
      productDetails,
      extras,
      url: this.page.url(),
      capturedAt: new Date().toISOString(),
    };
  }

  private async capturePrice(): Promise<string> {
    const candidates = [
      '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
      '#corePrice_feature_div .a-price .a-offscreen',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price .a-offscreen',
    ];

    for (const selector of candidates) {
      const loc = this.page.locator(selector).first();
      if (await loc.isVisible({ timeout: 1500 }).catch(() => false)) {
        const text = (await loc.innerText()).trim();
        if (text) return text;
      }
    }

    return '(price not found)';
  }

  private async captureProductDetails(): Promise<string> {
    const prodDetails = this.page.locator('#prodDetails');
    if (await prodDetails.isVisible().catch(() => false)) {
      await prodDetails.scrollIntoViewIfNeeded();
      const expanded = await this.captureExpandedDetailSections(prodDetails);
      if (expanded) return expanded;
    }

    const sections = [
      '#productDetails_techSpec_section_1',
      '#productDetails_detailBullets_sections1',
      '#detailBullets_feature_div',
      '#productDetails_db_sections',
    ];

    const chunks: string[] = [];
    for (const selector of sections) {
      const loc = this.page.locator(selector).first();
      if (await loc.isVisible({ timeout: 1500 }).catch(() => false)) {
        const text = this.stripExcludedDetailText((await loc.innerText()).trim());
        if (text) chunks.push(text);
      }
    }

    if (chunks.length > 0) {
      return chunks.join('\n\n');
    }

    const about = (await this.featureBullets.innerText().catch(() => '')).trim();
    return about || '(product details not found)';
  }

  private async captureExpandedDetailSections(prodDetails: Locator): Promise<string> {
    const headers = prodDetails.locator('a.a-expander-section-header');
    const count = await headers.count();
    if (count === 0) return '';

    const sections: string[] = [];
    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const heading = (await header.innerText()).trim();
      if (this.isExcludedDetailSection(heading)) continue;

      await header.scrollIntoViewIfNeeded();
      const expanded = await header.getAttribute('aria-expanded');
      if (expanded !== 'true') {
        await header.click();
      }

      const container = prodDetails.locator('.a-expander-section-container').nth(i);
      const table = container.locator('table.prodDetTable');
      await table.waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {});

      const rows = table.locator('tr');
      const rowCount = await rows.count();
      const lines: string[] = [`[${heading}]`];
      for (let r = 0; r < rowCount; r++) {
        const row = rows.nth(r);
        const label = (await row.locator('th').innerText().catch(() => '')).trim();
        const value = (await row.locator('td').innerText().catch(() => '')).trim();
        if (!label && !value) continue;
        if (this.isExcludedDetailSection(label) || this.isExcludedDetailSection(value)) continue;
        lines.push(value ? `${label}: ${value}` : label);
      }

      if (lines.length === 1) {
        const raw = this.stripExcludedDetailText(
          (await container.locator('.a-expander-content').innerText().catch(() => '')).trim()
        );
        if (raw) lines.push(raw);
      }

      if (lines.length > 1) sections.push(lines.join('\n'));
    }

    return sections.join('\n\n');
  }

  private isExcludedDetailSection(text: string): boolean {
    return /feedback/i.test(text) || /tell us about a lower price/i.test(text);
  }

  private stripExcludedDetailText(text: string): string {
    return text
      .split('\n')
      .filter((line) => !this.isExcludedDetailSection(line.trim()))
      .join('\n')
      .trim();
  }

  private async readOptional(selector: string): Promise<string> {
    const loc = this.page.locator(selector).first();
    if (await loc.isVisible({ timeout: 1000 }).catch(() => false)) {
      return (await loc.innerText()).trim();
    }
    return '';
  }

  private async readAsin(): Promise<string> {
    const asinCell = this.page.locator('#detailBullets_feature_div li, #productDetails_detailBullets_sections1 tr')
      .filter({ hasText: /ASIN/i })
      .first();
    if (await asinCell.isVisible({ timeout: 1000 }).catch(() => false)) {
      return (await asinCell.innerText()).trim();
    }
    const match = this.page.url().match(/\/dp\/([A-Z0-9]{10})/i);
    return match?.[1] ?? '';
  }
}
