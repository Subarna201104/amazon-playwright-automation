import { Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  private readonly refinements: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;

    // Amazon left-side filter section
    this.refinements = page.locator('#s-refinements');

    // Amazon product cards
    this.resultCards = page.locator(
      '[data-component-type="s-search-result"]'
    );
  }

  /**
   * Wait until Amazon search results are visible.
   */
  async waitForResults(): Promise<void> {
    await this.resultCards.first().waitFor({
      state: 'visible',
      timeout: 30_000,
    });
  }

  /**
   * Select Sony and Samsung.
   *
   * No fallback brand is allowed.
   *
   * Required brands:
   * 1. Sony
   * 2. Samsung
   */
  async applyBrands(): Promise<string[]> {
    const brands = ['Sony', 'Samsung'];

    const selectedBrands: string[] = [];

    for (const brand of brands) {
      await this.refinements.waitFor({
        state: 'visible',
        timeout: 20_000,
      });

      await this.expandBrandList();

      const selected =
        await this.clickBrandIfAvailable(brand);

      if (!selected) {
        throw new Error(
          `${brand} brand filter is not available`
        );
      }

      selectedBrands.push(brand);

      console.log(
        `${brand} brand selected`
      );
    }

    console.log(
      `Final selected brands: ${selectedBrands.join(', ')}`
    );

    return selectedBrands;
  }

  /**
   * Apply the 55-inch TV filter.
   *
   * 55-inch is compulsory.
   *
   * Amazon may represent 55-inch in
   * different forms, so we check
   * multiple possibilities.
   */
  async tryApplyDisplaySize55Inch(): Promise<boolean> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    // Example: 55″
    const exact55 =
      this.refinements.getByRole(
        'link',
        {
          name: /^55[″"”']$/,
        }
      );

    // Example: 53.0 to 61.9 in
    const sizeRange =
      this.refinements.getByRole(
        'link',
        {
          name: /Apply the filter 53\.0 to 61\.9 in/i,
        }
      );

    // Example: 55 inches
    const inchesLabel =
      this.refinements.getByRole(
        'link',
        {
          name: /55\s*(inch|inches)/i,
        }
      );

    if (
      await exact55
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await exact55.click();

      console.log(
        'Exact 55-inch filter selected'
      );
    }

    else if (
      await sizeRange
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await sizeRange.click();

      console.log(
        '55-inch size range selected'
      );
    }

    else if (
      await inchesLabel
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await inchesLabel.click();

      console.log(
        '55-inch filter selected'
      );
    }

    else {
      throw new Error(
        '55-inch TV filter is not available after selecting Sony and Samsung'
      );
    }

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.waitForResults();

    console.log(
      '55-inch TV filter applied successfully'
    );

    return true;
  }

  /**
   * Expand Amazon's Brands section.
   *
   * If Amazon displays "See more",
   * this method clicks it.
   */
  private async expandBrandList(): Promise<void> {
    const brandsSection =
      this.refinements.locator(
        '#brandsRefinements'
      );

    if (
      await brandsSection
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await brandsSection
        .scrollIntoViewIfNeeded();

      const seeMoreButton =
        brandsSection.getByRole(
          'button',
          {
            name: /See more/i,
          }
        );

      if (
        await seeMoreButton
          .first()
          .isVisible({ timeout: 1500 })
          .catch(() => false)
      ) {
        await seeMoreButton
          .first()
          .click()
          .catch(() => {});
      }

      const seeMoreText =
        brandsSection.getByText(
          /See more/i
        );

      if (
        await seeMoreText
          .first()
          .isVisible({ timeout: 1000 })
          .catch(() => false)
      ) {
        await seeMoreText
          .first()
          .click()
          .catch(() => {});
      }

      return;
    }

    // Fallback if Amazon changes its HTML structure
    const brandsHeading =
      this.refinements.getByText(
        /^Brands$/i
      );

    if (
      await brandsHeading
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await brandsHeading
        .first()
        .scrollIntoViewIfNeeded();
    }
  }

  /**
   * Try to select a specific brand.
   *
   * Returns:
   *
   * true  -> brand was found and selected
   * false -> brand was not found
   */
  private async clickBrandIfAvailable(
    brand: string
  ): Promise<boolean> {
    await this.expandBrandList();

    const brandLocator =
      this.getBrandLocator(brand);

    const available =
      await brandLocator
        .isVisible({ timeout: 5000 })
        .catch(() => false);

    if (!available) {
      console.log(
        `${brand} brand is not currently visible`
      );

      return false;
    }

    await brandLocator
      .scrollIntoViewIfNeeded();

    await brandLocator.click();

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.waitForResults();

    return true;
  }

  /**
   * Flexible locator for Sony / Samsung.
   *
   * Amazon sometimes changes the
   * HTML/accessibility text of filters.
   */
  private getBrandLocator(
    brand: string
  ): Locator {
    const escapedBrand =
      escapeRegExp(brand);

    const brandsSection =
      this.refinements.locator(
        '#brandsRefinements'
      );

    // Strategy 1:
    // aria-label="Apply the filter Sony"
    const byBrandAria =
      brandsSection.getByRole(
        'link',
        {
          name: new RegExp(
            `Apply the filter.*${escapedBrand}`,
            'i'
          ),
        }
      );

    // Strategy 2:
    // Visible text "Sony"
    const byBrandText =
      brandsSection
        .locator('a')
        .filter({
          hasText: new RegExp(
            `^\\s*${escapedBrand}\\s*$`,
            'i'
          ),
        });

    // Strategy 3:
    // Search entire refinements area
    const byRefinementAria =
      this.refinements.getByRole(
        'link',
        {
          name: new RegExp(
            `Apply the filter.*${escapedBrand}`,
            'i'
          ),
        }
      );

    // Strategy 4:
    // Generic Amazon anchor text
    const byRefinementText =
      this.refinements
        .locator('a')
        .filter({
          hasText: new RegExp(
            `^\\s*${escapedBrand}\\s*$`,
            'i'
          ),
        });

    return byBrandAria
      .or(byBrandText)
      .or(byRefinementAria)
      .or(byRefinementText)
      .first();
  }

  /**
   * Get first valid product link
   * from filtered Amazon results.
   */
  firstProductLink(): Locator {
    return this.resultCards
      .filter({
        has: this.page.locator('h2'),
      })
      .locator(
        'a[href*="/dp/"]'
      )
      .first();
  }

  /**
   * Open first filtered product.
   *
   * Amazon may open:
   * - same tab
   * - new tab
   *
   * Both cases are handled.
   */
  async openFirstProduct(): Promise<Page> {
    await this.waitForResults();

    const productLink =
      this.firstProductLink();

    await productLink.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await productLink
      .scrollIntoViewIfNeeded();

    const popupPromise =
      this.page
        .waitForEvent(
          'popup',
          {
            timeout: 5000,
          }
        )
        .catch(() => null);

    await productLink.click();

    const popup =
      await popupPromise;

    const productPage =
      popup ?? this.page;

    await productPage.waitForLoadState(
      'domcontentloaded'
    );

    console.log(
      'First filtered TV product opened'
    );

    return productPage;
  }
}

/**
 * Escape special characters before
 * using brand name inside RegExp.
 */
function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}