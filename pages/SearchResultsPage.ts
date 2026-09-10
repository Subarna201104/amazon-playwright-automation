import { Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  private readonly refinements: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.refinements =
      page.locator('#s-refinements');

    this.resultCards =
      page.locator(
        '[data-component-type="s-search-result"]'
      );
  }

  async waitForResults(): Promise<void> {
    await this.resultCards
      .first()
      .waitFor({
        state: 'visible',
        timeout: 30_000,
      });
  }

  async applyDisplaySize55Inch(): Promise<void> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    const exact55 =
      this.refinements.getByRole(
        'link',
        {
          name: /^55[″"”']$/,
        }
      );

    const sizeRangeCheckbox =
      this.refinements.getByRole(
        'checkbox',
        {
          name: /53\.0\s*to\s*61\.9\s*in/i,
        }
      );

    const sizeRangeLink =
      this.refinements.getByRole(
        'link',
        {
          name: /53\.0\s*to\s*61\.9\s*in/i,
        }
      );

    const inchesLabel =
      this.refinements.getByRole(
        'link',
        {
          name: /55\s*(inch|inches)/i,
        }
      );

    if (
      await exact55
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await exact55.click();

      console.log(
        'Exact 55-inch filter selected'
      );
    }

    else if (
      await sizeRangeCheckbox
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await sizeRangeCheckbox.check();

      console.log(
        '53.0 to 61.9 inch size filter selected'
      );
    }

    else if (
      await sizeRangeLink
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await sizeRangeLink.click();

      console.log(
        '53.0 to 61.9 inch size filter selected'
      );
    }

    else if (
      await inchesLabel
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await inchesLabel
        .first()
        .click();

      console.log(
        '55-inch filter selected'
      );
    }

    else {
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
  }

  async applyBrands(): Promise<string[]> {
    const requiredBrands = [
      'Sony',
      'Samsung',
    ];

    const selectedBrands: string[] = [];

    for (const brand of requiredBrands) {
      const selected =
        await this.selectBrandCheckbox(
          brand
        );

      if (!selected) {
        throw new Error(
          `${brand} brand filter is not available`
        );
      }

      selectedBrands.push(brand);
    }

    console.log(
      `Final selected brands: ${selectedBrands.join(', ')}`
    );

    return selectedBrands;
  }

  private async selectBrandCheckbox(
    brand: string
  ): Promise<boolean> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await this.expandBrandList();

    const escaped =
      escapeRegExp(brand);

    console.log(
      `Looking for ${brand} brand filter...`
    );

    // METHOD 1:
    // Find visible brand text, then click its parent link.
    const brandText =
      this.refinements.getByText(
        new RegExp(
          `^\\s*${escaped}\\s*$`,
          'i'
        )
      );

    if (
      await brandText
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {
      const text =
        brandText.first();

      await text.scrollIntoViewIfNeeded();

      console.log(
        `${brand} text found`
      );

      const parentLink =
        text.locator(
          'xpath=ancestor::a[1]'
        );

      if (
        await parentLink
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      ) {
        await parentLink.click();

        await this.page.waitForLoadState(
          'domcontentloaded'
        );

        await this.waitForResults();

        console.log(
          `${brand} brand selected`
        );

        return true;
      }

      const parentLabel =
        text.locator(
          'xpath=ancestor::label[1]'
        );

      if (
        await parentLabel
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      ) {
        await parentLabel.click();

        await this.page.waitForLoadState(
          'domcontentloaded'
        );

        await this.waitForResults();

        console.log(
          `${brand} brand selected`
        );

        return true;
      }

      await text.click();

      await this.page.waitForLoadState(
        'domcontentloaded'
      );

      await this.waitForResults();

      console.log(
        `${brand} brand selected`
      );

      return true;
    }

    // METHOD 2:
    // Accessible checkbox
    const checkbox =
      this.refinements.getByRole(
        'checkbox',
        {
          name: new RegExp(
            escaped,
            'i'
          ),
        }
      );

    if (
      await checkbox
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      const box =
        checkbox.first();

      await box.scrollIntoViewIfNeeded();

      if (
        !(await box
          .isChecked()
          .catch(() => false))
      ) {
        await box.check();
      }

      await this.page.waitForLoadState(
        'domcontentloaded'
      );

      await this.waitForResults();

      console.log(
        `${brand} brand selected using checkbox`
      );

      return true;
    }

    // METHOD 3:
    // Amazon filter link fallback
    const brandLink =
      this.refinements.getByRole(
        'link',
        {
          name: new RegExp(
            `Apply the filter.*${escaped}`,
            'i'
          ),
        }
      );

    if (
      await brandLink
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await brandLink
        .first()
        .scrollIntoViewIfNeeded();

      await brandLink
        .first()
        .click();

      await this.page.waitForLoadState(
        'domcontentloaded'
      );

      await this.waitForResults();

      console.log(
        `${brand} brand selected using filter link`
      );

      return true;
    }

    console.log(
      `${brand} brand filter could not be located`
    );

    return false;
  }

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
      await brandsSection.scrollIntoViewIfNeeded();

      const seeMore =
        brandsSection.getByText(
          /see more/i
        );

      if (
        await seeMore
          .first()
          .isVisible({ timeout: 1500 })
          .catch(() => false)
      ) {
        await seeMore
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
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await brandsHeading
        .first()
        .scrollIntoViewIfNeeded();
    }

    const seeMore =
      this.refinements.getByText(
        /see more/i
      );

    if (
      await seeMore
        .first()
        .isVisible({ timeout: 1500 })
        .catch(() => false)
    ) {
      await seeMore
        .first()
        .click()
        .catch(() => {});
    }
  }

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

function escapeRegExp(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}