import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { writeProductLog } from '../utils/productLogger';

test.describe('Amazon.in TV Search Automation', () => {

  test(
    'Search 55-inch Sony/Samsung TVs and log the first product',
    async ({ page }, testInfo) => {

      const homePage = new HomePage(page);
      const searchResultsPage = new SearchResultsPage(page);

      // STEP 1 - Open Amazon.in
      await test.step('Open Amazon.in', async () => {
        await homePage.open();

        await expect(page).toHaveURL(/amazon\.in/);

        console.log('Amazon.in opened successfully');
      });

      // STEP 2 - Search for Television
      await test.step('Search for Television', async () => {
        await homePage.search('Television');

        console.log('Searched for Television');
      });

      // STEP 3 - Wait for search results
      await test.step('Wait for search results', async () => {
        await searchResultsPage.waitForResults();

        console.log('Search results loaded');
      });

      // STEP 4 - Apply 55-inch filter
      await test.step('Select 55-inch TV filter', async () => {
        await searchResultsPage.applyDisplaySize55Inch();

        console.log('55-inch TV filter applied');
      });

      // STEP 5 - Select Sony and Samsung
      await test.step('Select Sony and Samsung brands', async () => {
        const selectedBrands =
          await searchResultsPage.applyBrands();

        console.log(
          `Selected brands: ${selectedBrands.join(', ')}`
        );

        expect(selectedBrands).toContain('Sony');
        expect(selectedBrands).toContain('Samsung');
      });

      // STEP 6 - Open first filtered product
      let productPage: ProductPage;

      await test.step('Open first filtered TV product', async () => {
        const openedPage =
          await searchResultsPage.openFirstProduct();

        productPage = new ProductPage(openedPage);

        console.log('First filtered TV product opened');
      });

      // STEP 7 - Capture complete product info
      const productInfo = await test.step(
        'Capture complete product information',
        async () => {

          const info =
            await productPage.captureProductInfo();

          console.log('Complete product information captured');

          return info;
        }
      );

      // STEP 8 - Product title
      await test.step('Capture Product Title', async () => {
        console.log(
          `Product Title: ${productInfo.title}`
        );

        expect(productInfo.title).toBeTruthy();
      });

      // STEP 9 - Product price
      await test.step('Capture Product Price', async () => {
        console.log(
          `Product Price: ${productInfo.price}`
        );

        expect(productInfo.price).toBeTruthy();
      });

      // STEP 10 - Customer rating
      await test.step('Capture Customer Rating', async () => {
        console.log(
          `Customer Rating: ${productInfo.extras['Rating']}`
        );
      });

      // STEP 11 - About This Item
      await test.step('Capture About This Item', async () => {
        console.log('About This Item:');

        console.log(
          productInfo.extras['About this item']
        );
      });

      // STEP 12 - Product specifications
      await test.step(
        'Capture Product Specifications',
        async () => {

          console.log('Product Specifications:');

          console.log(productInfo.productDetails);
        }
      );

      // STEP 13 - Brand
      await test.step('Capture Brand', async () => {
        console.log(
          `Brand: ${productInfo.extras['Brand']}`
        );
      });

      // STEP 14 - Availability
      await test.step('Capture Availability', async () => {
        console.log(
          `Availability: ${productInfo.extras['Availability']}`
        );
      });

      // STEP 15 - ASIN
      await test.step('Capture ASIN', async () => {
        console.log(
          `ASIN: ${productInfo.extras['ASIN']}`
        );
      });

      // STEP 16 - Write everything to log file
      await test.step(
        'Write captured information to product-details.log',
        async () => {

          await writeProductLog(productInfo);

          console.log(
            'Product information written to logs/product-details.log'
          );
        }
      );

      // STEP 17 - Attach details to Playwright report
      await test.step(
        'Attach complete product details to Playwright report',
        async () => {

          const reportData = `
Amazon.in Product Capture
=========================

Product Title:
${productInfo.title}

Product Price:
${productInfo.price}

Customer Rating:
${productInfo.extras['Rating']}

Brand:
${productInfo.extras['Brand']}

Availability:
${productInfo.extras['Availability']}

ASIN:
${productInfo.extras['ASIN']}

About This Item:
${productInfo.extras['About this item']}

Product Specifications:
${productInfo.productDetails}

Product URL:
${productInfo.url}

Captured At:
${productInfo.capturedAt}
`;

          await testInfo.attach(
            'Amazon Product Details',
            {
              body: Buffer.from(reportData),
              contentType: 'text/plain',
            }
          );

          console.log(
            'Product details attached to Playwright report'
          );
        }
      );

    }
  );

});