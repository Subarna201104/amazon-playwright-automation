import { Locator, Page } from '@playwright/test';

/**
 * Shared Amazon.in overlays: continue-shopping gate, cookies, location.
 */
export class HomePage {
  readonly page: Page;
  private readonly searchBox: Locator;
  private readonly searchSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#twotabsearchtextbox');
    this.searchSubmit = page.locator('#nav-search-submit-button');
  }

  async open(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.dismissInterstitials();
  }

  async dismissInterstitials(): Promise<void> {
    const continueShopping = this.page.getByRole('button', { name: /continue shopping/i });
    if (await continueShopping.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueShopping.click();
      await this.page.waitForLoadState('domcontentloaded');
    }

    const acceptCookies = this.page.locator('#sp-cc-accept');
    if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptCookies.click();
    }

    const dismissLocation = this.page.locator('#GLUXCloseBtn, button[aria-label="Close"]');
    if (await dismissLocation.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await dismissLocation.first().click({ force: true }).catch(() => {});
    }
  }

  async search(term: string): Promise<void> {
    await this.searchBox.waitFor({ state: 'visible', timeout: 20_000 });
    await this.searchBox.fill(term);
    await this.searchSubmit.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
