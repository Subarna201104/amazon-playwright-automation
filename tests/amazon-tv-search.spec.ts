import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { writeProductLog } from '../utils/productLogger';

const SEARCH_TERM = 'Television';
const BRANDS = ['Sony', 'Samsung'] as const;

test.describe('Amazon.in TV search and product capture', () => {

  test(
    'search 55-inch Sony/Samsung TVs and log the first product',
    async ({ page }, testInfo) => {

      const homePage = new HomePage(page);
      const resultsPage = new SearchResultsPage(page);

      await test.step('Open Amazon.in', async () => {
        await homePage.open();
        await expect(page).toHaveURL(/amazon\.in/i);
      });

      await test.step(`Search for ${SEARCH_TERM}`, async () => {
        await homePage.search(SEARCH_TERM);
        await resultsPage.waitForResults();
      });

      await test.step('Select 55-inch TV filter', async () => {
        await resultsPage.applyDisplaySize55Inch();
      });

      await test.step(
        'Select two TV brands - Sony and Samsung',
        async () => {

          const selectedBrands =
            await resultsPage.applyBrands([...BRANDS]);

          expect(selectedBrands).toHaveLength(2);
        }
      );

      const productTab = await test.step(
        'Open the first filtered TV product',
        async () => {

          return await resultsPage.openFirstProduct();
        }
      );

      const productPage = new ProductPage(productTab);

      const info = await test.step(
        'Capture complete product information',
        async () => {

          const productInfo =
            await productPage.captureProductInfo();

          expect(productInfo.title.length)
            .toBeGreaterThan(0);

          expect(productInfo.price.length)
            .toBeGreaterThan(0);

          expect(productInfo.productDetails.length)
            .toBeGreaterThan(0);

          return productInfo;
        }
      );

      await test.step('Capture Product Title', async () => {
        console.log('Product Title:', info.title);
        expect(info.title.length).toBeGreaterThan(0);
      });

      await test.step('Capture Product Price', async () => {
        console.log('Product Price:', info.price);
        expect(info.price.length).toBeGreaterThan(0);
      });

      await test.step('Capture Customer Rating', async () => {
        console.log(
          'Customer Rating:',
          info.extras['Rating'] || 'Not Available'
        );
      });

      await test.step('Capture About This Item', async () => {
        console.log(
          'About This Item:',
          info.extras['About this item'] || 'Not Available'
        );
      });

      await test.step('Capture Product Specifications', async () => {
        console.log(
          'Product Specifications:',
          info.productDetails
        );

        expect(info.productDetails.length)
          .toBeGreaterThan(0);
      });

      await test.step('Capture Brand', async () => {
        console.log(
          'Brand:',
          info.extras['Brand'] || 'Not Available'
        );
      });

      await test.step('Capture Availability', async () => {
        console.log(
          'Availability:',
          info.extras['Availability'] || 'Not Available'
        );
      });

      await test.step('Capture ASIN', async () => {
        console.log(
          'ASIN:',
          info.extras['ASIN'] || 'Not Available'
        );
      });

      const logPath = await test.step(
        'Write captured product information to product-details.log',
        async () => {

          const path = writeProductLog(info);

          expect(path)
            .toContain('product-details.log');

          console.log(
            `Product log created at: ${path}`
          );

          return path;
        }
      );

      await test.step(
        'Attach complete product details to Playwright report',
        async () => {

          const reportContent = `
============================================================
                 AMAZON.IN PRODUCT DETAILS
============================================================

Captured At:
${info.capturedAt}

Product URL:
${info.url}

------------------------------------------------------------
MANDATORY DETAILS
------------------------------------------------------------

Product Title:
${info.title}

Product Price:
${info.price}

Customer Rating:
${info.extras['Rating'] || 'Not Available'}

------------------------------------------------------------
ABOUT THIS ITEM
------------------------------------------------------------

${info.extras['About this item'] || 'Not Available'}

------------------------------------------------------------
PRODUCT DETAILS / SPECIFICATIONS
------------------------------------------------------------

${info.productDetails}

------------------------------------------------------------
ADDITIONAL INFORMATION
------------------------------------------------------------

Brand:
${info.extras['Brand'] || 'Not Available'}

Availability:
${info.extras['Availability'] || 'Not Available'}

ASIN:
${info.extras['ASIN'] || 'Not Available'}

------------------------------------------------------------
LOG FILE
------------------------------------------------------------

${logPath}

============================================================
                 END OF PRODUCT DETAILS
============================================================
`;

          await testInfo.attach(
            'Amazon Product Details',
            {
              body: Buffer.from(reportContent),
              contentType: 'text/plain',
            }
          );

          console.log(reportContent);
        }
      );
    }
  );
});