import { Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  private readonly refinements: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;

    // Amazon left-side filter section
    this.refinements = page.locator('#s-refinements');

    // Amazon search result cards
    this.resultCards = page.locator(
      '[data-component-type="s-search-result"]'
    );
  }

  /**
   * Wait until at least one search result is visible.
   */
  async waitForResults(): Promise<void> {
    await this.resultCards.first().waitFor({
      state: 'visible',
      timeout: 30_000,
    });
  }

  /**
   * Tries to apply the 55-inch TV filter.
   *
   * Returns:
   * true  -> filter was applied
   * false -> filter was not available
   *
   * The test will continue even if the filter
   * cannot be used.
   */
  async tryApplyDisplaySize55Inch(): Promise<boolean> {
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

    if (
      await inchIdea
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await inchIdea.click();
    } else if (
      await sizeRange
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await sizeRange.click();
    } else if (
      await inchesLabel
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await inchesLabel.click();
    } else {
      console.log(
        '55-inch filter not available. Continuing without size filter.'
      );

      return false;
    }

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.waitForResults();

    console.log('55-inch TV filter applied');

    return true;
  }

  /**
   * Checks whether a particular brand filter
   * is currently available.
   */
  private async isBrandAvailable(
    brand: string
  ): Promise<boolean> {
    await this.expandBrandList();

    const locator =
      this.getBrandLocator(brand);

    return await locator
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  /**
   * Check whether BOTH Sony and Samsung
   * are available in the current filter state.
   */
  async areSonyAndSamsungAvailable(): Promise<boolean> {
    const sonyAvailable =
      await this.isBrandAvailable('Sony');

    const samsungAvailable =
      await this.isBrandAvailable('Samsung');

    console.log(
      `Sony available: ${sonyAvailable}`
    );

    console.log(
      `Samsung available: ${samsungAvailable}`
    );

    return sonyAvailable && samsungAvailable;
  }

  /**
   * Removes the size filter by returning to
   * the Television search results.
   *
   * This is used when the size filter causes
   * Sony or Samsung to disappear.
   */
  async resetToTelevisionSearch(): Promise<void> {
    console.log(
      'Sony/Samsung not both available with size filter.'
    );

    console.log(
      'Returning to Television results without size filter.'
    );

    await this.page.goto(
      '/s?k=Television',
      {
        waitUntil: 'domcontentloaded',
      }
    );

    await this.waitForResults();

    console.log(
      'Returned to Television search results'
    );
  }

  /**
   * Select Sony and Samsung.
   *
   * These are the two required brands
   * for this implementation.
   */
  async applyBrands(): Promise<string[]> {
    const brands = [
      'Sony',
      'Samsung',
    ];

    const selectedBrands: string[] = [];

    for (const brand of brands) {
      await this.refinements.waitFor({
        state: 'visible',
        timeout: 20_000,
      });

      await this.expandBrandList();

      const brandLocator =
        this.getBrandLocator(brand);

      const available =
        await brandLocator
          .isVisible({ timeout: 5000 })
          .catch(() => false);

      if (!available) {
        throw new Error(
          `${brand} brand filter is not available`
        );
      }

      await brandLocator
        .scrollIntoViewIfNeeded();

      await brandLocator.click();

      console.log(
        `${brand} brand selected`
      );

      selectedBrands.push(brand);

      await this.page.waitForLoadState(
        'domcontentloaded'
      );

      await this.waitForResults();
    }

    console.log(
      `Selected brands: ${selectedBrands.join(', ')}`
    );

    return selectedBrands;
  }

  /**
   * Expand the Brands section if Amazon
   * provides a See more option.
   */
  private async expandBrandList(): Promise<void> {
    const brandsSection =
      this.refinements.locator(
        '#brandsRefinements'
      );

    if (
      await brandsSection
        .isVisible({ timeout: 1500 })
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
          .isVisible({ timeout: 1000 })
          .catch(() => false)
      ) {
        await seeMoreButton
          .first()
          .click()
          .catch(() => {});
      }

      return;
    }

    const brandsHeading =
      this.refinements.getByText(
        /^Brands$/i
      );

    if (
      await brandsHeading
        .first()
        .isVisible({ timeout: 1500 })
        .catch(() => false)
    ) {
      await brandsHeading
        .first()
        .scrollIntoViewIfNeeded();
    }
  }

  /**
   * Creates a flexible locator for a brand.
   *
   * Amazon may represent brand filters
   * differently, so multiple strategies
   * are combined.
   */
  private getBrandLocator(
    brand: string
  ): Locator {
    const escaped =
      escapeRegExp(brand);

    const brandsSection =
      this.refinements.locator(
        '#brandsRefinements'
      );

    return brandsSection
      .locator('a')
      .filter({
        hasText: new RegExp(
          `^\\s*${escaped}\\s*$`,
          'i'
        ),
      })
      .or(
        brandsSection.getByRole(
          'link',
          {
            name: new RegExp(
              `Apply the filter.*${escaped}`,
              'i'
            ),
          }
        )
      )
      .or(
        this.refinements.getByRole(
          'link',
          {
            name: new RegExp(
              `Apply the filter.*${escaped}`,
              'i'
            ),
          }
        )
      )
      .or(
        this.refinements
          .locator('a')
          .filter({
            hasText: new RegExp(
              `^\\s*${escaped}\\s*$`,
              'i'
            ),
          })
      )
      .first();
  }

  /**
   * Returns the first valid product link.
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
   * Opens the first filtered TV product.
   *
   * Handles both:
   * - same tab
   * - new tab
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
 * Escapes special RegExp characters.
 */
function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}