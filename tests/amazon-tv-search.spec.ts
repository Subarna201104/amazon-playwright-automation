import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { writeProductLog } from '../utils/productLogger';

test.describe(
  'Amazon.in TV Search Automation',
  () => {
    test(
      'Search 55-inch TVs, select Sony and Samsung, and log first product',
      async ({ page }, testInfo) => {

        const homePage =
          new HomePage(page);

        const results =
          new SearchResultsPage(page);

        await test.step(
          'Open Amazon.in',
          async () => {
            await homePage.open();

            await expect(page).toHaveURL(
              /amazon\.in/
            );

            console.log(
              'Amazon.in opened successfully'
            );
          }
        );

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

        await test.step(
          'Wait for search results',
          async () => {
            await results.waitForResults();

            console.log(
              'Search results loaded'
            );
          }
        );

        await test.step(
          'Select 55-inch TV filter',
          async () => {
            await results.applyDisplaySize55Inch();

            console.log(
              '55-inch filter confirmed'
            );
          }
        );

        let selectedBrands: string[] = [];

        await test.step(
          'Select Sony and Samsung brands',
          async () => {
            selectedBrands =
              await results.applyBrands();

            expect(
              selectedBrands
            ).toContain('Sony');

            expect(
              selectedBrands
            ).toContain('Samsung');

            console.log(
              `Selected brands: ${selectedBrands.join(', ')}`
            );
          }
        );

        let productPage;

        await test.step(
          'Open first filtered TV product',
          async () => {
            productPage =
              await results.openFirstProduct();

            console.log(
              'First filtered product opened'
            );
          }
        );

        const product =
          new ProductPage(productPage!);

        let productInfo:
          Awaited<
            ReturnType<
              ProductPage['captureProductInfo']
            >
          >;

        await test.step(
          'Capture complete product information',
          async () => {
            productInfo =
              await product.captureProductInfo();

            expect(
              productInfo.title
            ).toBeTruthy();

            expect(
              productInfo.price
            ).toBeTruthy();

            console.log(
              'Complete product information captured'
            );
          }
        );

        await test.step(
          'Capture Product Title',
          async () => {
            console.log(
              `Product Title: ${productInfo.title}`
            );
          }
        );

        await test.step(
          'Capture Product Price',
          async () => {
            console.log(
              `Product Price: ${productInfo.price}`
            );
          }
        );

        await test.step(
          'Capture Customer Rating',
          async () => {
            console.log(
              `Customer Rating: ${
                productInfo.extras[
                  'Customer Rating'
                ] ?? 'Not available'
              }`
            );
          }
        );

        await test.step(
          'Capture About This Item',
          async () => {
            console.log(
              `About This Item: ${
                productInfo.extras[
                  'About this item'
                ] ?? 'Not available'
              }`
            );
          }
        );

        await test.step(
          'Capture Product Specifications',
          async () => {
            console.log(
              `Product Specifications: ${productInfo.productDetails}`
            );
          }
        );

        await test.step(
          'Capture Brand',
          async () => {
            console.log(
              `Brand: ${
                productInfo.extras[
                  'Brand'
                ] ?? 'Not available'
              }`
            );
          }
        );

        await test.step(
          'Capture Availability',
          async () => {
            console.log(
              `Availability: ${
                productInfo.extras[
                  'Availability'
                ] ?? 'Not available'
              }`
            );
          }
        );

        await test.step(
          'Capture ASIN',
          async () => {
            console.log(
              `ASIN: ${
                productInfo.extras[
                  'ASIN'
                ] ?? 'Not available'
              }`
            );
          }
        );

        await test.step(
          'Write captured information to product-details.log',
          async () => {
            writeProductLog(
              productInfo
            );

            console.log(
              'Product information written to logs/product-details.log'
            );
          }
        );

        await test.step(
          'Attach complete product details to Playwright report',
          async () => {

            const reportText = [
              'Amazon Product Details',
              '',
              `Product Title: ${productInfo.title}`,
              '',
              `Product Price: ${productInfo.price}`,
              '',
              `Customer Rating: ${
                productInfo.extras[
                  'Customer Rating'
                ] ?? 'Not available'
              }`,
              '',
              `Brand: ${
                productInfo.extras[
                  'Brand'
                ] ?? 'Not available'
              }`,
              '',
              `Availability: ${
                productInfo.extras[
                  'Availability'
                ] ?? 'Not available'
              }`,
              '',
              `ASIN: ${
                productInfo.extras[
                  'ASIN'
                ] ?? 'Not available'
              }`,
              '',
              'About This Item:',
              productInfo.extras[
                'About this item'
              ] ?? 'Not available',
              '',
              'Product Specifications:',
              productInfo.productDetails,
              '',
              `Product URL: ${productInfo.url}`,
              '',
              `Captured At: ${productInfo.capturedAt}`,
            ].join('\n');

            await testInfo.attach(
              'Amazon Product Details',
              {
                body: Buffer.from(
                  reportText
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