import { Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  private readonly refinements: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.refinements = page.locator('#s-refinements');
    this.resultCards = page.locator('[data-component-type="s-search-result"]');
  }

  async waitForResults(): Promise<void> {
    await this.resultCards.first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  /**
   * Amazon.in currently exposes 55-inch TVs as Popular Shopping Idea "55″"
   * and as Screen Size range "53.0 to 61.9 in".
   */
  async applyDisplaySize55Inch(): Promise<void> {
    await this.refinements.waitFor({ state: 'visible', timeout: 20_000 });

    const inchIdea = this.refinements.getByRole('link', { name: /^55[″"”']$/ });
    const sizeRange = this.refinements.getByRole('link', {
      name: /Apply the filter 53\.0 to 61\.9 in/i,
    });
    const inchesLabel = this.refinements.getByRole('link', { name: /55\s*(inches|inch)/i });

    if (await inchIdea.isVisible().catch(() => false)) {
      await inchIdea.click();
    } else if (await sizeRange.isVisible().catch(() => false)) {
      await sizeRange.click();
    } else {
      await inchesLabel.click();
    }

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForResults();
  }

  /**
   * Selects two brands. Prefers the given names (e.g. Sony, Samsung);
   * if a preferred brand is not listed after size filters, uses other available brands.
   */
  async applyBrands(preferredBrands: string[]): Promise<string[]> {
    await this.refinements.waitFor({ state: 'visible', timeout: 20_000 });
    await this.expandBrandList();

    const selected: string[] = [];
    for (const brand of preferredBrands) {
      if (selected.length >= 2) break;
      if (await this.clickBrandIfPresent(brand)) {
        selected.push(brand);
      }
    }

    while (selected.length < 2) {
      const fallback = await this.nextAvailableBrand(selected);
      if (!fallback) break;
      if (await this.clickBrandIfPresent(fallback)) {
        selected.push(fallback);
      } else {
        break;
      }
    }

    if (selected.length < 2) {
      throw new Error(`Could not select two brands. Selected: ${selected.join(', ') || '(none)'}`);
    }

    return selected;
  }

  private async expandBrandList(): Promise<void> {
    const brandsHeading = this.refinements.getByRole('heading', { name: /^Brands$/i });
    await brandsHeading.scrollIntoViewIfNeeded();
    const seeMore = this.refinements.getByRole('button', { name: /See more/i });
    if (await seeMore.first().isVisible().catch(() => false)) {
      await seeMore.first().click().catch(() => {});
    }
  }

  private brandFilterLink(brand: string): Locator {
    return this.refinements.getByRole('link', {
      name: new RegExp(`Apply the filter ${escapeRegExp(brand)}\\b`, 'i'),
    });
  }

  private async clickBrandIfPresent(brand: string): Promise<boolean> {
    await this.expandBrandList();
    const link = this.brandFilterLink(brand);
    if (!(await link.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false))) {
      return false;
    }
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForResults();
    return true;
  }

  private async nextAvailableBrand(alreadySelected: string[]): Promise<string | null> {
    await this.expandBrandList();
    const brandLinks = this.refinements
      .getByRole('list', { name: /^Brands$/i })
      .getByRole('link', { name: /Apply the filter/i });
    const count = await brandLinks.count();
    for (let i = 0; i < count; i++) {
      const accessibleName = (await brandLinks.nth(i).getAttribute('aria-label'))
        ?? (await brandLinks.nth(i).innerText());
      const match = accessibleName.match(/Apply the filter\s+(.+?)(?:\s+to narrow results)?$/i);
      const name = (match?.[1] ?? accessibleName).trim();
      if (!name) continue;
      const already = alreadySelected.some((b) => b.toLowerCase() === name.toLowerCase());
      if (!already) return name;
    }
    return null;
  }

  firstProductLink(): Locator {
    return this.resultCards.filter({ has: this.page.locator('h2') }).locator('a[href*="/dp/"]').first();
  }

  async openFirstProduct(): Promise<Page> {
    await this.waitForResults();
    const productLink = this.firstProductLink();
    await productLink.waitFor({ state: 'visible', timeout: 20_000 });

    const popupPromise = this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    await productLink.click();
    const popup = await popupPromise;
    const productPage = popup ?? this.page;
    await productPage.waitForLoadState('domcontentloaded');
    return productPage;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
