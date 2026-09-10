import { test, expect } from '@playwright/test';

import { HomePage }
  from '../pages/HomePage';

import { SearchResultsPage }
  from '../pages/SearchResultsPage';

import { ProductPage }
  from '../pages/ProductPage';

import { writeProductLog }
  from '../utils/productLogger';


test.describe(
  'Amazon.in TV Search Automation',
  () => {

    test(
      'Search 55-inch TVs, select Sony and Samsung, and log first product',
      async ({ page }, testInfo) => {

        const homePage =
          new HomePage(page);

        const searchResultsPage =
          new SearchResultsPage(page);


        // ==========================================
        // STEP 1 - OPEN AMAZON
        // ==========================================

        await test.step(
          'Open Amazon.in',
          async () => {

            await homePage.open();

            await expect(page)
              .toHaveURL(/amazon\.in/);

            console.log(
              'Amazon.in opened successfully'
            );
          }
        );


        // ==========================================
        // STEP 2 - SEARCH TELEVISION
        // ==========================================

        await test.step(
          'Search for Television',
          async () => {

            await homePage.search(
              'Television'
            );

            console.log(
              'Searched for Television'
            );
          }
        );


        // ==========================================
        // STEP 3 - WAIT FOR RESULTS
        // ==========================================

        await test.step(
          'Wait for search results',
          async () => {

            await searchResultsPage
              .waitForResults();

            console.log(
              'Search results loaded'
            );
          }
        );


        // ==========================================
        // STEP 4 - APPLY 55-INCH
        // ==========================================

        await test.step(
          'Apply 55-inch TV filter',
          async () => {

            await searchResultsPage
              .applyDisplaySize55Inch();

            console.log(
              '55-inch filter confirmed'
            );
          }
        );


        // ==========================================
        // STEP 5 - SELECT SONY + SAMSUNG
        // ==========================================

        let selectedBrands: string[] = [];

        await test.step(
          'Select Sony and Samsung brands',
          async () => {

            selectedBrands =
              await searchResultsPage
                .applyBrands();

            expect(
              selectedBrands
            ).toContain('Sony');

            expect(
              selectedBrands
            ).toContain('Samsung');

            expect(
              selectedBrands
            ).toHaveLength(2);

            console.log(
              `Selected brands: ${selectedBrands.join(', ')}`
            );
          }
        );


        // ==========================================
        // STEP 6 - OPEN FIRST PRODUCT
        // ==========================================

        let productPage!: ProductPage;

        await test.step(
          'Open first filtered TV product',
          async () => {

            const openedPage =
              await searchResultsPage
                .openFirstProduct();

            productPage =
              new ProductPage(
                openedPage
              );

            console.log(
              'First filtered TV product opened'
            );
          }
        );


        // ==========================================
        // STEP 7 - CAPTURE PRODUCT INFORMATION
        // ==========================================

        const productInfo =
          await test.step(
            'Capture complete product information',
            async () => {

              const info =
                await productPage
                  .captureProductInfo();

              console.log(
                'Complete product information captured'
              );

              return info;
            }
          );


        // ==========================================
        // STEP 8 - VALIDATE 55-INCH PRODUCT
        // ==========================================

        await test.step(
          'Validate that opened TV is 55 inches',
          async () => {

            const productText = `
${productInfo.title}

${productInfo.productDetails}

${productInfo.extras['About this item']}
`;

            expect(
              productText
            ).toMatch(
              /55\s*(inch|inches)/i
            );

            console.log(
              'Validated that opened TV is 55 inches'
            );
          }
        );


        // ==========================================
        // STEP 9 - PRODUCT TITLE
        // ==========================================

        await test.step(
          'Capture Product Title',
          async () => {

            console.log(
              `Product Title: ${productInfo.title}`
            );

            expect(
              productInfo.title
            ).toBeTruthy();
          }
        );


        // ==========================================
        // STEP 10 - PRODUCT PRICE
        // ==========================================

        await test.step(
          'Capture Product Price',
          async () => {

            console.log(
              `Product Price: ${productInfo.price}`
            );

            expect(
              productInfo.price
            ).toBeTruthy();

            expect(
              productInfo.price
            ).not.toBe(
              '(price not found)'
            );
          }
        );


        // ==========================================
        // STEP 11 - CUSTOMER RATING
        // ==========================================

        await test.step(
          'Capture Customer Rating',
          async () => {

            console.log(
              `Customer Rating: ${productInfo.extras['Rating']}`
            );
          }
        );


        // ==========================================
        // STEP 12 - ABOUT THIS ITEM
        // ==========================================

        await test.step(
          'Capture About This Item',
          async () => {

            console.log(
              'About This Item:'
            );

            console.log(
              productInfo.extras[
                'About this item'
              ]
            );
          }
        );


        // ==========================================
        // STEP 13 - SPECIFICATIONS
        // ==========================================

        await test.step(
          'Capture Product Specifications',
          async () => {

            console.log(
              'Product Specifications:'
            );

            console.log(
              productInfo.productDetails
            );
          }
        );


        // ==========================================
        // STEP 14 - BRAND
        // ==========================================

        await test.step(
          'Capture Brand',
          async () => {

            console.log(
              `Brand: ${productInfo.extras['Brand']}`
            );
          }
        );


        // ==========================================
        // STEP 15 - AVAILABILITY
        // ==========================================

        await test.step(
          'Capture Availability',
          async () => {

            console.log(
              `Availability: ${productInfo.extras['Availability']}`
            );
          }
        );


        // ==========================================
        // STEP 16 - ASIN
        // ==========================================

        await test.step(
          'Capture ASIN',
          async () => {

            console.log(
              `ASIN: ${productInfo.extras['ASIN']}`
            );
          }
        );


        // ==========================================
        // STEP 17 - WRITE LOG
        // ==========================================

        await test.step(
          'Write captured information to product-details.log',
          async () => {

            await writeProductLog(
              productInfo
            );

            console.log(
              'Product information written to logs/product-details.log'
            );
          }
        );


        // ==========================================
        // STEP 18 - PLAYWRIGHT REPORT
        // ==========================================

        await test.step(
          'Attach complete product details to Playwright report',
          async () => {

            const reportData = `
Amazon.in Product Capture
=========================

Selected Brands:
${selectedBrands.join(', ')}

Screen Size:
55 inches

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
                body:
                  Buffer.from(
                    reportData
                  ),

                contentType:
                  'text/plain',
              }
            );

            console.log(
              'Product details attached to Playwright report'
            );
          }
        );
      }
    );
  }
);