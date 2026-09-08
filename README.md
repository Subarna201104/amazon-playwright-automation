# Amazon.in Playwright + TypeScript Automation Assessment

This project automates an Amazon.in TV search scenario using **Playwright with TypeScript**.

The automation searches for televisions, applies display-size and brand filters, opens the first filtered product, captures detailed product information, and stores the captured data in a log file.

## Automated Scenario

1. Open Amazon.in.
2. Search for `Television`.
3. Apply the **55-inch** display-size filter.
4. Select two TV brands:
   - Sony
   - Samsung
5. Open the first product from the filtered search results.
6. Capture the following product information:
   - Product Title
   - Product Price
   - Customer Rating
   - About This Item
   - Product Specifications / Product Details
   - Brand
   - Availability
   - ASIN
7. Write the captured information to `logs/product-details.log`.
8. Attach the complete product information to the Playwright HTML report.

## Technologies Used

- Playwright
- TypeScript
- Node.js
- Google Chrome
- Page Object Model (POM)

## Project Structure

```text
amazon-playwright-automation/
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

Before running this project, make sure the following are installed:

- Node.js
- npm
- Google Chrome
- Git
- Internet connection
- VS Code or another code editor (optional)

> **Note:** This project is configured to run using Google Chrome.  
> Amazon.in is a live website, so product availability, prices, filters, brands, and page structure may change over time.

## Clone the Repository

Clone the GitHub repository:

```bash
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
```

Navigate to the project directory:

```bash
cd amazon-playwright-automation
```

## Install Dependencies

Install all required project dependencies using:

```bash
npm install
```

If PowerShell blocks the `npm` script on Windows, use:

```powershell
npm.cmd install
```

The required project dependencies are defined in `package.json` and `package-lock.json`, so the `node_modules` folder does not need to be downloaded from the repository.

## Run the Automation

### Windows PowerShell

Run the test with the browser visible:

```powershell
npx.cmd playwright test --headed
```

### macOS / Linux / Other Terminals

```bash
npx playwright test --headed
```

The automation performs the following workflow:

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
Generate Playwright HTML report
```

## Sample Execution Result

A successful execution displays output similar to:

```text
Running 1 test using 1 worker

✓ search 55-inch Sony/Samsung TVs and log the first product

1 passed
```

> The exact execution output may vary because Amazon.in contains live and dynamically changing data.

## Playwright HTML Report

After running the test, open the Playwright HTML report.

### Windows PowerShell

```powershell
npx.cmd playwright show-report
```

### macOS / Linux / Other Terminals

```bash
npx playwright show-report
```

The report displays the automation steps, including:

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

The attachment contains:

- Product Title
- Product Price
- Customer Rating
- About This Item
- Product Specifications
- Brand
- Availability
- ASIN
- Product URL
- Capture Timestamp

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

Actual product information may change because the automation captures live data from Amazon.in.

## Design Approach

The project follows the **Page Object Model (POM)** design pattern to separate page-specific actions from the test scenario.

- `HomePage.ts` — handles Amazon home-page actions and search functionality.
- `SearchResultsPage.ts` — handles search results, display-size filters, and brand filters.
- `ProductPage.ts` — handles product-information extraction.
- `amazon-tv-search.spec.ts` — contains the main test scenario and validations.
- `productLogger.ts` — writes captured product information to the log file.

## Test Output

After successful execution, the following outputs are generated.

### Playwright Report

```text
playwright-report/
```

Contains the Playwright HTML test report.

### Product Log

```text
logs/product-details.log
```

Contains the captured Amazon product information.

## Environment Notes

The project is designed to be portable across supported environments, provided the required prerequisites are installed.

Before execution, ensure that:

- Node.js and npm are installed.
- Google Chrome is installed.
- Internet connectivity is available.
- Project dependencies have been installed using `npm install`.
- Amazon.in is accessible from the execution environment.

Because Amazon.in is a live website, changes to its UI, product availability, filters, or page structure may occasionally affect automation execution.