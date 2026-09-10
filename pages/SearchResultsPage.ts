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

    const rangeCheckbox = this.refinements.getByRole(
      'checkbox',
      {
        name: /53\.0\s*to\s*61\.9\s*in/i,
      }
    );

    const rangeLink = this.refinements.getByRole('link', {
      name: /53\.0\s*to\s*61\.9\s*in/i,
    });

    const inchLink = this.refinements.getByRole('link', {
      name: /55\s*(inch|inches)/i,
    });

    if (
      await exact55
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await exact55.first().click();

      console.log(
        'Exact 55-inch filter selected'
      );
    } else if (
      await rangeCheckbox
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await rangeCheckbox.first().check();

      console.log(
        '53.0 to 61.9 inch filter selected'
      );
    } else if (
      await rangeLink
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await rangeLink.first().click();

      console.log(
        '53.0 to 61.9 inch filter selected'
      );
    } else if (
      await inchLink
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await inchLink.first().click();

      console.log(
        '55-inch filter selected'
      );
    } else {
      throw new Error(
        '55-inch TV filter is not available'
      );
    }

    await this.waitAfterFilter();

    console.log(
      '55-inch TV filter applied successfully'
    );
  }

  async applyBrands(): Promise<string[]> {
    // IMPORTANT:
    // Samsung first, Sony second
    const requiredBrands = [
      'Samsung',
      'Sony',
    ];

    const selectedBrands: string[] = [];

    for (const brand of requiredBrands) {
      const selected =
        await this.selectBrandFilter(brand);

      if (!selected) {
        throw new Error(
          `${brand} brand filter could not be selected`
        );
      }

      selectedBrands.push(brand);

      console.log(
        `${brand} completed successfully`
      );
    }

    console.log(
      `Final selected brands: ${selectedBrands.join(', ')}`
    );

    return selectedBrands;
  }

  private async selectBrandFilter(
    brand: string
  ): Promise<boolean> {
    console.log(
      `Selecting ${brand} from Brands filter...`
    );

    await this.refinements.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await this.refinements.scrollIntoViewIfNeeded();

    const escapedBrand =
      escapeRegExp(brand);

    /*
      STEP 1:
      Try visible link in left sidebar
    */

    let brandLinks = this.refinements
      .locator('a')
      .filter({
        hasText: new RegExp(
          `\\b${escapedBrand}\\b`,
          'i'
        ),
      });

    let count =
      await brandLinks.count();

    for (let i = 0; i < count; i++) {
      const link =
        brandLinks.nth(i);

      const visible =
        await link
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      const href =
        (await link.getAttribute('href')) ??
        '';

      // Never click product links
      if (href.includes('/dp/')) {
        continue;
      }

      await link.scrollIntoViewIfNeeded();

      console.log(
        `${brand} found in left sidebar`
      );

      await link.click();

      await this.waitAfterFilter();

      console.log(
        `${brand} brand selected`
      );

      return true;
    }

    /*
      STEP 2:
      Try Amazon p_89 brand URL
    */

    const allLinks =
      this.refinements.locator('a');

    const allCount =
      await allLinks.count();

    for (
      let i = 0;
      i < allCount;
      i++
    ) {
      const link =
        allLinks.nth(i);

      const href =
        (await link.getAttribute('href')) ??
        '';

      let decodedHref = href;

      try {
        decodedHref =
          decodeURIComponent(href);
      } catch {
        decodedHref = href;
      }

      if (
        decodedHref
          .toLowerCase()
          .includes(
            `p_89:${brand.toLowerCase()}`
          )
      ) {
        const visible =
          await link
            .isVisible()
            .catch(() => false);

        if (!visible) {
          continue;
        }

        await link.scrollIntoViewIfNeeded();

        console.log(
          `${brand} brand URL found`
        );

        await link.click();

        await this.waitAfterFilter();

        console.log(
          `${brand} brand selected`
        );

        return true;
      }
    }

    /*
      STEP 3:
      Find Brands heading
    */

    const brandsHeading =
      this.refinements.getByText(
        /^Brands$/i
      );

    if (
      await brandsHeading
        .first()
        .isVisible({
          timeout: 2000,
        })
        .catch(() => false)
    ) {
      await brandsHeading
        .first()
        .scrollIntoViewIfNeeded();

      console.log(
        'Brands heading found'
      );
    }

    /*
      STEP 4:
      Click See more under Brands
    */

    const seeMoreLinks =
      this.refinements.getByText(
        /See more/i
      );

    const seeMoreCount =
      await seeMoreLinks.count();

    const brandsBox =
      await brandsHeading
        .first()
        .boundingBox()
        .catch(() => null);

    for (
      let i = 0;
      i < seeMoreCount;
      i++
    ) {
      const seeMore =
        seeMoreLinks.nth(i);

      const visible =
        await seeMore
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      const box =
        await seeMore.boundingBox();

      if (
        box &&
        brandsBox &&
        box.y > brandsBox.y &&
        box.y - brandsBox.y <
          700
      ) {
        console.log(
          'Clicking See more under Brands'
        );

        await seeMore.scrollIntoViewIfNeeded();

        await seeMore.click();

        await this.page.waitForTimeout(
          1000
        );

        console.log(
          'Brands list expanded'
        );

        break;
      }
    }

    /*
      STEP 5:
      Search again after See more
    */

    brandLinks = this.refinements
      .locator('a')
      .filter({
        hasText: new RegExp(
          `\\b${escapedBrand}\\b`,
          'i'
        ),
      });

    count =
      await brandLinks.count();

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const link =
        brandLinks.nth(i);

      const visible =
        await link
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      const href =
        (await link.getAttribute('href')) ??
        '';

      if (href.includes('/dp/')) {
        continue;
      }

      await link.scrollIntoViewIfNeeded();

      console.log(
        `${brand} visible after expanding Brands`
      );

      await link.click();

      await this.waitAfterFilter();

      console.log(
        `${brand} brand selected`
      );

      return true;
    }

    /*
      STEP 6:
      Try checkbox
    */

    const checkbox =
      this.refinements.getByRole(
        'checkbox',
        {
          name: new RegExp(
            escapedBrand,
            'i'
          ),
        }
      );

    if (
      await checkbox
        .first()
        .isVisible({
          timeout: 2000,
        })
        .catch(() => false)
    ) {
      const box =
        checkbox.first();

      await box.scrollIntoViewIfNeeded();

      const checked =
        await box
          .isChecked()
          .catch(() => false);

      if (!checked) {
        await box.check();
      }

      await this.waitAfterFilter();

      console.log(
        `${brand} checkbox selected`
      );

      return true;
    }

    /*
      STEP 7:
      Try brand list row
    */

    const rows =
      this.refinements
        .locator('li')
        .filter({
          hasText: new RegExp(
            `\\b${escapedBrand}\\b`,
            'i'
          ),
        });

    const rowCount =
      await rows.count();

    for (
      let i = 0;
      i < rowCount;
      i++
    ) {
      const row =
        rows.nth(i);

      const visible =
        await row
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      await row.scrollIntoViewIfNeeded();

      const link =
        row.locator('a');

      if (
        await link
          .first()
          .isVisible({
            timeout: 1000,
          })
          .catch(() => false)
      ) {
        const href =
          (await link
            .first()
            .getAttribute('href')) ??
          '';

        if (!href.includes('/dp/')) {
          await link
            .first()
            .click();

          await this.waitAfterFilter();

          console.log(
            `${brand} selected from brand row`
          );

          return true;
        }
      }

      const rowCheckbox =
        row.locator(
          'input[type="checkbox"]'
        );

      if (
        await rowCheckbox
          .first()
          .isVisible({
            timeout: 1000,
          })
          .catch(() => false)
      ) {
        const box =
          rowCheckbox.first();

        const checked =
          await box
            .isChecked()
            .catch(() => false);

        if (!checked) {
          await box.check();
        }

        await this.waitAfterFilter();

        console.log(
          `${brand} selected using row checkbox`
        );

        return true;
      }
    }

    /*
      DEBUG
    */

    console.log(
      `Could not select ${brand}. Matching sidebar links:`
    );

    const debugLinks =
      this.refinements.locator('a');

    const debugCount =
      await debugLinks.count();

    for (
      let i = 0;
      i <
      Math.min(
        debugCount,
        100
      );
      i++
    ) {
      const link =
        debugLinks.nth(i);

      const visible =
        await link
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      const text =
        (
          await link
            .innerText()
            .catch(() => '')
        ).trim();

      const href =
        await link
          .getAttribute('href')
          .catch(() => null);

      const ariaLabel =
        await link
          .getAttribute(
            'aria-label'
          )
          .catch(() => null);

      if (
        text
          .toLowerCase()
          .includes(
            brand.toLowerCase()
          ) ||
        href
          ?.toLowerCase()
          .includes(
            brand.toLowerCase()
          ) ||
        ariaLabel
          ?.toLowerCase()
          .includes(
            brand.toLowerCase()
          )
      ) {
        console.log(
          `DEBUG ${brand}: text="${text}", href="${href}", aria-label="${ariaLabel}"`
        );
      }
    }

    console.log(
      `${brand} could not be found inside Brands filter`
    );

    return false;
  }

  private async waitAfterFilter(): Promise<void> {
    await this.page.waitForTimeout(
      1200
    );

    await this.page
      .waitForLoadState(
        'domcontentloaded'
      )
      .catch(() => {});

    await this.waitForResults();
  }

  firstProductLink(): Locator {
    return this.resultCards
      .filter({
        has: this.page.locator(
          'h2'
        ),
      })
      .locator(
        'h2 a[href*="/dp/"], a[href*="/dp/"]'
      )
      .first();
  }

  async openFirstProduct(): Promise<Page> {
    console.log(
      'Samsung and Sony filters completed'
    );

    console.log(
      'Opening first filtered TV product...'
    );

    await this.waitForResults();

    const productLink =
      this.firstProductLink();

    await productLink.waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    await productLink.scrollIntoViewIfNeeded();

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
      'First filtered TV product opened successfully'
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