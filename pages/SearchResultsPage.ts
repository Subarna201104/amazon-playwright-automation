import { Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  private readonly refinements: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;

    // Left-side filter section in Amazon search results
    this.refinements = page.locator('#s-refinements');

    // All product cards shown in search results
    this.resultCards = page.locator(
      '[data-component-type="s-search-result"]'
    );
  }

  // Wait until at least one product result is visible
  async waitForResults(): Promise<void> {
    await this.resultCards.first().waitFor({
      state: 'visible',
      timeout: 30_000,
    });
  }

  /**
   * Applies the 55-inch TV filter.
   *
   * Amazon may display the 55-inch filter in different ways:
   *
   * 1. 55″
   * 2. 53.0 to 61.9 in
   * 3. 55 inches
   *
   * So we try multiple locators.
   */
  async applyDisplaySize55Inch(): Promise<void> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    const inchIdea = this.refinements.getByRole('link', {
      name: /^55[″"”']$/,
    });

    const sizeRange = this.refinements.getByRole('link', {
      name: /Apply the filter 53\.0 to 61\.9 in/i,
    });

    const inchesLabel = this.refinements.getByRole('link', {
      name: /55\s*(inches|inch)/i,
    });

    // First preference: exact 55-inch option
    if (await inchIdea.isVisible().catch(() => false)) {
      await inchIdea.click();
    }

    // Second preference: Amazon range containing 55-inch TVs
    else if (await sizeRange.isVisible().catch(() => false)) {
      await sizeRange.click();
    }

    // Third preference: text such as "55 inches"
    else if (await inchesLabel.isVisible().catch(() => false)) {
      await inchesLabel.click();
    }

    // If none of the 55-inch filters are available
    else {
      throw new Error('55-inch TV filter is not available');
    }

    await this.page.waitForLoadState('domcontentloaded');

    await this.waitForResults();

    console.log('55-inch TV filter selected');
  }

  /**
   * Select Sony and Samsung brand filters.
   *
   * This method selects exactly:
   * Sony
   * Samsung
   *
   * It will not select another brand as fallback.
   */
  async applyBrands(): Promise<string[]> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await this.expandBrandList();

    const brands = ['Sony', 'Samsung'];

    const selectedBrands: string[] = [];

    for (const brand of brands) {
      const selected = await this.clickBrandIfPresent(brand);

      if (!selected) {
        throw new Error(
          `${brand} brand filter is not available`
        );
      }

      selectedBrands.push(brand);

      console.log(`${brand} brand selected`);
    }

    return selectedBrands;
  }

  /**
   * Expand the Brands section if Amazon displays
   * a "See more" button.
   */
  private async expandBrandList(): Promise<void> {
    const brandsHeading = this.refinements.getByRole('heading', {
      name: /^Brands$/i,
    });

    if (
      await brandsHeading
        .isVisible()
        .catch(() => false)
    ) {
      await brandsHeading.scrollIntoViewIfNeeded();
    }

    const seeMore = this.refinements.getByRole('button', {
      name: /See more/i,
    });

    if (
      await seeMore
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await seeMore
        .first()
        .click()
        .catch(() => {});
    }
  }

  /**
   * Creates locator for a specific brand.
   *
   * Example:
   *
   * Apply the filter Sony
   *
   * Apply the filter Samsung
   */
  private brandFilterLink(brand: string): Locator {
    return this.refinements.getByRole('link', {
      name: new RegExp(
        `Apply the filter ${escapeRegExp(brand)}\\b`,
        'i'
      ),
    });
  }

  /**
   * Tries to select the requested brand.
   *
   * Returns:
   * true  -> brand found and selected
   * false -> brand not available
   */
  private async clickBrandIfPresent(
    brand: string
  ): Promise<boolean> {
    await this.expandBrandList();

    const link = this.brandFilterLink(brand);

    const isAvailable = await link
      .waitFor({
        state: 'visible',
        timeout: 5_000,
      })
      .then(() => true)
      .catch(() => false);

    if (!isAvailable) {
      return false;
    }

    await link.scrollIntoViewIfNeeded();

    await link.click();

    await this.page.waitForLoadState('domcontentloaded');

    await this.waitForResults();

    return true;
  }

  /**
   * Returns the first valid product link
   * from the Amazon search results.
   */
  firstProductLink(): Locator {
    return this.resultCards
      .filter({
        has: this.page.locator('h2'),
      })
      .locator('a[href*="/dp/"]')
      .first();
  }

  /**
   * Opens the first product from the search results.
   *
   * Amazon may:
   *
   * 1. Open product in same tab
   * OR
   * 2. Open product in a new tab
   *
   * This method handles both situations.
   */
  async openFirstProduct(): Promise<Page> {
    await this.waitForResults();

    const productLink = this.firstProductLink();

    await productLink.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await productLink.scrollIntoViewIfNeeded();

    const popupPromise = this.page
      .waitForEvent('popup', {
        timeout: 5_000,
      })
      .catch(() => null);

    await productLink.click();

    const popup = await popupPromise;

    // If Amazon opened new tab, use popup.
    // Otherwise continue using same page.
    const productPage = popup ?? this.page;

    await productPage.waitForLoadState(
      'domcontentloaded'
    );

    console.log('First TV product opened');

    return productPage;
  }
}

/**
 * Escapes special characters before creating
 * a dynamic regular expression.
 */
function escapeRegExp(value: string): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}