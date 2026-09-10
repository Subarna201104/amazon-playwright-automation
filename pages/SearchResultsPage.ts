import { Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  private readonly refinements: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.refinements = page.locator('#s-refinements');

    this.resultCards = page.locator(
      '[data-component-type="s-search-result"]'
    );
  }

  async waitForResults(): Promise<void> {
    await this.resultCards.first().waitFor({
      state: 'visible',
      timeout: 30_000,
    });
  }

  async applyDisplaySize55Inch(): Promise<void> {
    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    const exact55 = this.refinements.getByRole('link', {
      name: /^55[″"”']$/,
    });

    const sizeRangeCheckbox = this.refinements.getByRole(
      'checkbox',
      {
        name: /53\.0\s*to\s*61\.9\s*in/i,
      }
    );

    const sizeRangeLink = this.refinements.getByRole('link', {
      name: /53\.0\s*to\s*61\.9\s*in/i,
    });

    const inchesLabel = this.refinements.getByRole('link', {
      name: /55\s*(inch|inches)/i,
    });

    if (
      await exact55
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await exact55.click();

      console.log('Exact 55-inch filter selected');
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
      await inchesLabel.first().click();

      console.log('55-inch filter selected');
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
    const requiredBrands = ['Sony', 'Samsung'];

    const selectedBrands: string[] = [];

    for (const brand of requiredBrands) {
      const selected = await this.selectBrand(brand);

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

  private async selectBrand(
    brand: string
  ): Promise<boolean> {

    console.log(
      `Looking for ${brand} brand filter...`
    );

    // Open Amazon's complete brand list
    await this.expandBrandList();

    await this.page.waitForTimeout(1000);

    /*
      IMPORTANT:
      Search the WHOLE PAGE here.

      Amazon's "See more" brand list may be rendered
      outside #s-refinements.
    */

    // METHOD 1 - exact visible brand text
    const exactBrandText = this.page.getByText(
      new RegExp(
        `^\\s*${escapeRegExp(brand)}\\s*$`,
        'i'
      )
    );

    const textCount = await exactBrandText.count();

    console.log(
      `${brand} exact text matches found: ${textCount}`
    );

    for (let i = 0; i < textCount; i++) {
      const text = exactBrandText.nth(i);

      if (
        !(await text
          .isVisible()
          .catch(() => false))
      ) {
        continue;
      }

      console.log(
        `Visible ${brand} text found`
      );

      await text.scrollIntoViewIfNeeded();

      // Brand may be inside a label
      const label = text.locator(
        'xpath=ancestor::label[1]'
      );

      if (
        await label
          .isVisible({ timeout: 1500 })
          .catch(() => false)
      ) {
        await label.click();

        console.log(
          `${brand} selected using label`
        );

        await this.waitAfterBrandSelection();

        return true;
      }

      // Brand may be inside a link
      const link = text.locator(
        'xpath=ancestor::a[1]'
      );

      if (
        await link
          .isVisible({ timeout: 1500 })
          .catch(() => false)
      ) {
        await link.click();

        console.log(
          `${brand} selected using link`
        );

        await this.waitAfterBrandSelection();

        return true;
      }

      // If text itself is clickable
      try {
        await text.click();

        console.log(
          `${brand} selected using visible text`
        );

        await this.waitAfterBrandSelection();

        return true;
      } catch {
        // continue to fallback
      }
    }

    /*
      METHOD 2 - checkbox anywhere on page
    */

    const brandCheckbox = this.page.getByRole(
      'checkbox',
      {
        name: new RegExp(
          escapeRegExp(brand),
          'i'
        ),
      }
    );

    if (
      await brandCheckbox
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      const checkbox = brandCheckbox.first();

      await checkbox.scrollIntoViewIfNeeded();

      if (
        !(await checkbox
          .isChecked()
          .catch(() => false))
      ) {
        await checkbox.check();
      }

      console.log(
        `${brand} selected using checkbox`
      );

      await this.waitAfterBrandSelection();

      return true;
    }

    /*
      METHOD 3 - label containing Sony/Samsung
      anywhere on page
    */

    const brandLabel = this.page
      .locator('label')
      .filter({
        hasText: new RegExp(
          `\\b${escapeRegExp(brand)}\\b`,
          'i'
        ),
      });

    if (
      await brandLabel
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await brandLabel
        .first()
        .scrollIntoViewIfNeeded();

      await brandLabel
        .first()
        .click();

      console.log(
        `${brand} selected using page label`
      );

      await this.waitAfterBrandSelection();

      return true;
    }

    /*
      METHOD 4 - link containing brand
      anywhere on page
    */

    const brandLink = this.page
      .locator('a')
      .filter({
        hasText: new RegExp(
          `\\b${escapeRegExp(brand)}\\b`,
          'i'
        ),
      });

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

      console.log(
        `${brand} selected using page link`
      );

      await this.waitAfterBrandSelection();

      return true;
    }

    console.log(
      `${brand} brand filter could not be located`
    );

    return false;
  }

  private async expandBrandList(): Promise<void> {
    console.log('Opening Brands section...');

    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    /*
      Find the Brands section
    */

    const brandsSection =
      this.refinements.locator(
        '#brandsRefinements'
      );

    if (
      await brandsSection
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await brandsSection.scrollIntoViewIfNeeded();

      console.log(
        'Brands section found'
      );

      /*
        Click "See more" specifically
        inside the Brands section.
      */

      const seeMore = brandsSection
        .getByText(/see more/i)
        .first();

      if (
        await seeMore
          .isVisible({ timeout: 2500 })
          .catch(() => false)
      ) {
        console.log(
          'See more found under Brands'
        );

        await seeMore.scrollIntoViewIfNeeded();

        await seeMore.click();

        await this.page.waitForTimeout(1200);

        console.log(
          'Brands list expanded'
        );

        return;
      }

      console.log(
        'See more not visible - checking if brand list is already expanded'
      );

      return;
    }

    /*
      Fallback if Amazon changes brandsRefinements ID
    */

    const brandsHeading = this.page.getByText(
      /^Brands$/i
    );

    if (
      await brandsHeading
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await brandsHeading
        .first()
        .scrollIntoViewIfNeeded();

      console.log(
        'Brands heading found'
      );

      /*
        Find a nearby See more
      */

      const parent = brandsHeading
        .first()
        .locator(
          'xpath=ancestor::div[contains(@class,"a-section")][1]'
        );

      const seeMore = parent
        .getByText(/see more/i)
        .first();

      if (
        await seeMore
          .isVisible({ timeout: 2500 })
          .catch(() => false)
      ) {
        await seeMore.click();

        await this.page.waitForTimeout(1200);

        console.log(
          'Brands dropdown opened'
        );

        return;
      }
    }

    console.log(
      'Brands list could not be expanded using normal locator'
    );
  }

  private async waitAfterBrandSelection(): Promise<void> {
    /*
      Amazon may close the brand popup
      and refresh the search result page.
    */

    await this.page.waitForTimeout(1200);

    await this.page.waitForLoadState(
      'domcontentloaded'
    ).catch(() => {});

    await this.waitForResults();

    console.log(
      'Search results refreshed after brand selection'
    );
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