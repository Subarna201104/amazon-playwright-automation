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
   * Wait until at least one product result is visible.
   */
  async waitForResults(): Promise<void> {
    await this.resultCards.first().waitFor({
      state: 'visible',
      timeout: 30_000,
    });
  }

  /**
   * Apply the 55-inch TV filter.
   *
   * This is compulsory for the assignment.
   */
  async tryApplyDisplaySize55Inch(): Promise<boolean> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    const exact55 = this.refinements.getByRole('link', {
      name: /^55[″"”']$/,
    });

    const sizeRange = this.refinements.getByRole('link', {
      name: /Apply the filter 53\.0 to 61\.9 in/i,
    });

    const inchesLabel = this.refinements.getByRole('link', {
      name: /55\s*(inches|inch)/i,
    });

    if (
      await exact55
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await exact55.click();
    } else if (
      await sizeRange
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await sizeRange.click();
    } else if (
      await inchesLabel
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await inchesLabel.click();
    } else {
      throw new Error(
        '55-inch TV filter is not available'
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
   * Select exactly two available brands.
   *
   * Preference order:
   * 1. Sony
   * 2. Samsung
   *
   * If one is unavailable after applying 55-inch,
   * another available brand is selected instead.
   */
  async applyBrands(): Promise<string[]> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await this.expandBrandList();

    const selectedBrands: string[] = [];

    const preferredBrands = [
      'Sony',
      'Samsung',
    ];

    // Try Sony and Samsung first
    for (const brand of preferredBrands) {
      if (selectedBrands.length === 2) {
        break;
      }

      const selected =
        await this.clickBrandIfAvailable(
          brand
        );

      if (selected) {
        selectedBrands.push(brand);

        console.log(
          `${brand} brand selected`
        );
      } else {
        console.log(
          `${brand} not available after 55-inch filter`
        );
      }
    }

    // If fewer than two preferred brands were available,
    // select other available brands.
    while (selectedBrands.length < 2) {
      const fallbackBrand =
        await this.selectNextAvailableBrand(
          selectedBrands
        );

      if (!fallbackBrand) {
        throw new Error(
          'Two available TV brands could not be selected'
        );
      }

      selectedBrands.push(
        fallbackBrand
      );

      console.log(
        `${fallbackBrand} brand selected as fallback`
      );
    }

    console.log(
      `Final selected brands: ${selectedBrands.join(', ')}`
    );

    return selectedBrands;
  }

  /**
   * Expand the Brands section if Amazon
   * shows a "See more" option.
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
          .isVisible({ timeout: 1500 })
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
   * Try selecting a particular brand.
   */
  private async clickBrandIfAvailable(
    brand: string
  ): Promise<boolean> {
    await this.expandBrandList();

    const locator =
      this.getBrandLocator(brand);

    const available =
      await locator
        .isVisible({ timeout: 4000 })
        .catch(() => false);

    if (!available) {
      return false;
    }

    await locator
      .scrollIntoViewIfNeeded();

    await locator.click();

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.waitForResults();

    return true;
  }

  /**
   * Select another available brand.
   */
  private async selectNextAvailableBrand(
    alreadySelected: string[]
  ): Promise<string | null> {
    await this.expandBrandList();

    const brandsSection =
      this.refinements.locator(
        '#brandsRefinements'
      );

    const searchArea =
      await brandsSection
        .isVisible({ timeout: 1500 })
        .catch(() => false)
        ? brandsSection
        : this.refinements;

    const links =
      searchArea.locator(
        'a[aria-label*="Apply the filter"]'
      );

    const count =
      await links.count();

    for (let i = 0; i < count; i++) {
      const link =
        links.nth(i);

      const text =
        (
          await link
            .innerText()
            .catch(() => '')
        ).trim();

      const ariaLabel =
        (
          await link
            .getAttribute(
              'aria-label'
            )
        ) ?? '';

      const brand =
        this.extractBrandName(
          text,
          ariaLabel
        );

      if (!brand) {
        continue;
      }

      if (
        alreadySelected.some(
          selected =>
            selected.toLowerCase() ===
            brand.toLowerCase()
        )
      ) {
        continue;
      }

      // Avoid accidentally picking non-brand filters
      if (
        this.looksLikeNonBrandFilter(
          brand
        )
      ) {
        continue;
      }

      const visible =
        await link
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      await link
        .scrollIntoViewIfNeeded();

      await link.click();

      await this.page.waitForLoadState(
        'domcontentloaded'
      );

      await this.waitForResults();

      return brand;
    }

    return null;
  }

  /**
   * Flexible locator for Sony, Samsung, etc.
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
      .getByRole(
        'link',
        {
          name: new RegExp(
            `Apply the filter.*${escaped}`,
            'i'
          ),
        }
      )
      .or(
        brandsSection
          .locator('a')
          .filter({
            hasText: new RegExp(
              `^\\s*${escaped}\\s*$`,
              'i'
            ),
          })
      )
      .or(
        this.refinements
          .getByRole(
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
   * Extract a clean brand name.
   */
  private extractBrandName(
    visibleText: string,
    ariaLabel: string
  ): string {
    if (visibleText) {
      return visibleText
        .replace(/\(\d+[,\d]*\)/g, '')
        .trim();
    }

    if (ariaLabel) {
      return ariaLabel
        .replace(
          /^Apply the filter\s+/i,
          ''
        )
        .replace(
          /\s+to narrow results.*$/i,
          ''
        )
        .trim();
    }

    return '';
  }

  /**
   * Helps avoid picking size, price,
   * rating, delivery, etc.
   */
  private looksLikeNonBrandFilter(
    value: string
  ): boolean {
    return /inch|inches|₹|price|rating|stars|delivery|discount|resolution|screen|smart tv|customer review/i
      .test(value);
  }

  /**
   * Return first product link.
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
 * Escape special RegExp characters.
 */
function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}