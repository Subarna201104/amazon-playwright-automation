# Amazon.in Playwright + TypeScript Automation Assessment

This project automates an Amazon.in TV search scenario using **Playwright with TypeScript**.

The automation searches for televisions, applies display-size and brand filters, opens the first filtered product, captures detailed product information, and stores the captured data in a log file.

## Automated Scenario

1. Open Amazon.in
2. Search for `Television`
3. Apply the **55-inch** display-size filter
4. Select two TV brands:
   - Sony
   - Samsung
5. Open the first product from the filtered search results
6. Capture the following product information:
   - Product Title
   - Product Price
   - Customer Rating
   - About This Item
   - Product Specifications / Product Details
   - Brand
   - Availability
   - ASIN
7. Write the captured information to `logs/product-details.log`
8. Attach the complete product information to the Playwright HTML report

## Technologies Used

- Playwright
- TypeScript
- Node.js
- Google Chrome
- Page Object Model (POM)

## Project Structure

```text
amazon-in-playwright-main/
│
├── pages/
│   ├── HomePage.ts
│   ├── SearchResultsPage.ts
│   └── ProductPage.ts
│
├── tests/
│   └── amazon-tv-search.spec.ts
│
├── utils/
│   └── productLogger.ts
│
├── logs/
│   └── product-details.log
│
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Google Chrome
- VS Code (recommended)

## Installation

Clone/download the project and open it in VS Code.

Install the project dependencies:

```bash
npm install
```

If PowerShell blocks the npm script on Windows, use:

```bash
npm.cmd install
```

## Run the Automation

To run the test with the browser visible:

```bash
npx.cmd playwright test --headed
```

The automation will:

```text
Open Amazon.in
        ↓
Search for Television
        ↓
Apply 55-inch filter
        ↓
Select Sony and Samsung
        ↓
Open first filtered TV
        ↓
Capture product information
        ↓
Write product-details.log
        ↓
Generate Playwright report
```

## Sample Execution Result

A successful execution displays:

```text
Running 1 test using 1 worker

✓ search 55-inch Sony/Samsung TVs and log the first product

1 passed
```

## Playwright HTML Report

After running the test, open the HTML report using:

```bash
npx.cmd playwright show-report
```

The report displays individual automation steps including:

- Open Amazon.in
- Search for Television
- Select 55-inch TV filter
- Select Sony and Samsung
- Open the first filtered TV product
- Capture complete product information
- Capture Product Title
- Capture Product Price
- Capture Customer Rating
- Capture About This Item
- Capture Product Specifications
- Capture Brand
- Capture Availability
- Capture ASIN
- Write captured information to `product-details.log`
- Attach complete product details to the Playwright report

## Product Details Attachment

The Playwright HTML report contains an attachment named:

```text
Amazon Product Details
```

The attachment contains the captured product title, price, rating, About This Item, product specifications, brand, availability, ASIN, product URL, and capture timestamp.

## Product Log

The captured product information is also written to:

```text
logs/product-details.log
```

Example:

```text
Product Title:
Samsung 55 inches Crystal UHD 4K Samsung Vision AI Smart TV

Product Price:
₹45,990.00

Customer Rating:
4.3 out of 5 stars

Availability:
In stock
```

Actual product information may change because the test captures live data from Amazon.in.

## Design Approach

The project follows the **Page Object Model (POM)** design pattern.

- `HomePage.ts` handles Amazon home-page actions.
- `SearchResultsPage.ts` handles search results and filters.
- `ProductPage.ts` handles product-information extraction.
- `amazon-tv-search.spec.ts` contains the test scenario and validations.
- `productLogger.ts` writes the captured product information to the log file.

## Test Output

After execution:

```text
playwright-report/
```

contains the Playwright HTML report.

```text
logs/product-details.log
```

contains the captured Amazon product information.