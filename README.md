# Amazon.in Playwright + TypeScript Automation Assessment

This project automates an Amazon.in TV search scenario using **Playwright with TypeScript**.

The automation searches for televisions, applies display-size and brand filters, opens the first filtered product, captures detailed product information, and stores the captured data in a log file and Playwright HTML report.

---

# Automated Scenario

The automation performs the following steps:

1. Open Amazon.in.
2. Search for `Television`.
3. Apply the **55-inch** display-size filter.
4. Select the following TV brands:
   - Samsung
   - Sony
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
7. Write the captured information to:

```text
logs/product-details.log
```

8. Attach the complete product information to the Playwright HTML report.

---

# Technologies Used

- Playwright
- TypeScript
- Node.js
- npm
- Google Chrome
- Git
- Page Object Model (POM)

---

# Project Structure

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

---

# Complete Setup Guide

This section explains how to run the project on a new laptop from the beginning.

No previous Playwright setup is required.

---

# 1. Install Google Chrome

This project is configured to run using Google Chrome.

Download and install Google Chrome from the official Chrome website.

After installation, open Chrome once to confirm that it works properly.

---

# 2. Install Node.js

Playwright requires Node.js.

Download the latest supported Node.js version from the official Node.js website:

```text
https://nodejs.org/
```

Recommended:

```text
Node.js LTS version
```

During installation, keep the default options selected.

After installation, close and reopen Command Prompt or PowerShell.

---

# 3. Verify Node.js Installation

Open Command Prompt or PowerShell.

## Windows

Press:

```text
Windows Key + R
```

Type:

```text
cmd
```

and press Enter.

Then run:

```cmd
node -v
```

Example output:

```text
v22.x.x
```

Now verify npm:

```cmd
npm -v
```

Example:

```text
10.x.x
```

If both commands display version numbers, Node.js and npm are installed correctly.

---

# 4. Install Git

Git is required to download the project from GitHub.

Download Git from:

```text
https://git-scm.com/
```

Install Git using the default installation options.

After installation, close and reopen Command Prompt or PowerShell.

---

# 5. Verify Git Installation

Run:

```cmd
git --version
```

Example:

```text
git version 2.x.x
```

If a version number is displayed, Git is installed correctly.

---

# 6. Optional: Install Visual Studio Code

Visual Studio Code is not required to run the automation.

It is only useful if you want to view or edit the source code.

Download VS Code from:

```text
https://code.visualstudio.com/
```

The project can still be completely executed using only Command Prompt or PowerShell.

---

# 7. Choose a Folder for the Project

For example, you can place the project on the Desktop.

Open Command Prompt or PowerShell.

Move to Desktop:

```cmd
cd %USERPROFILE%\Desktop
```

---

# 8. Clone the GitHub Repository

Run:

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
```

Git will download the complete project.

After cloning, a folder named:

```text
amazon-playwright-automation
```

will be created.

---

# 9. Enter the Project Folder

Run:

```cmd
cd amazon-playwright-automation
```

You must be inside this folder before running any npm or Playwright commands.

You can verify the files using:

```cmd
dir
```

You should see files such as:

```text
package.json
package-lock.json
playwright.config.ts
README.md
pages
tests
utils
```

---

# 10. Install Project Dependencies

The project dependencies are already defined in:

```text
package.json
package-lock.json
```

Run:

```cmd
npm install
```

If using Windows PowerShell and `npm` is blocked, use:

```powershell
npm.cmd install
```

This command downloads the required Node.js packages into:

```text
node_modules
```

The `node_modules` folder is not stored in GitHub because it can be recreated using `npm install`.

---

# 11. Verify Playwright Installation

Run:

## Windows CMD

```cmd
npx playwright --version
```

## Windows PowerShell

```powershell
npx.cmd playwright --version
```

Example:

```text
Version 1.x.x
```

If a version number is displayed, Playwright is installed correctly.

---

# 12. Browser Requirement

This project uses Google Chrome through the Playwright configuration.

Make sure Google Chrome is installed before running the test.

The configuration uses:

```text
channel: chrome
```

Therefore Google Chrome must be available on the system.

---

# 13. Run the Automation

## Windows PowerShell

Run:

```powershell
npx.cmd playwright test --headed
```

## Windows Command Prompt

Run:

```cmd
npx playwright test --headed
```

## macOS / Linux

Run:

```bash
npx playwright test --headed
```

The `--headed` option allows you to see the browser while the automation is running.

---

# 14. Expected Automation Flow

After running the command, the browser should perform the following steps:

```text
Open Amazon.in
        ↓
Search for Television
        ↓
Wait for search results
        ↓
Apply 55-inch filter
        ↓
Select Samsung
        ↓
Select Sony
        ↓
Open first filtered TV product
        ↓
Capture Product Title
        ↓
Capture Product Price
        ↓
Capture Customer Rating
        ↓
Capture About This Item
        ↓
Capture Product Specifications
        ↓
Capture Brand
        ↓
Capture Availability
        ↓
Capture ASIN
        ↓
Write product-details.log
        ↓
Attach details to Playwright HTML report
```

---

# 15. Successful Execution

A successful execution should display output similar to:

```text
Running 1 test using 1 worker

Amazon.in opened successfully
Searched for Television
Search results loaded
55-inch TV filter applied successfully
Samsung brand selected
Sony brand selected
First filtered TV product opened successfully
Complete product information captured
Product information written to logs/product-details.log
Product details attached to Playwright report

1 passed
```

The exact product information may change because Amazon.in contains live data.

---

# 16. Open the Playwright HTML Report

After the test finishes, Playwright generates an HTML report.

## Windows PowerShell

Run:

```powershell
npx.cmd playwright show-report
```

## Windows Command Prompt

Run:

```cmd
npx playwright show-report
```

## macOS / Linux

Run:

```bash
npx playwright show-report
```

This opens the Playwright report in the browser.

---

# 17. Playwright Report Contains

The HTML report displays the automation steps including:

- Open Amazon.in
- Search for Television
- Wait for search results
- Select 55-inch TV filter
- Select Samsung and Sony
- Open first filtered TV product
- Capture complete product information
- Capture Product Title
- Capture Product Price
- Capture Customer Rating
- Capture About This Item
- Capture Product Specifications
- Capture Brand
- Capture Availability
- Capture ASIN
- Write captured information to the log file
- Attach complete product details to the report

---

# 18. Product Details Attachment

Inside the Playwright HTML report, an attachment named:

```text
Amazon Product Details
```

is available.

The attachment contains:

```text
Product Title
Product Price
Customer Rating
Brand
Availability
ASIN
About This Item
Product Specifications
Product URL
Capture Timestamp
```

---

# 19. Product Log File

The captured product information is written to:

```text
logs/product-details.log
```

On Windows, you can open the file using:

```cmd
notepad logs\product-details.log
```

Or open it manually from the project folder:

```text
amazon-playwright-automation
    ↓
logs
    ↓
product-details.log
```

Example:

```text
Amazon.in Product Capture

Product Title:
Samsung 55 inches Crystal UHD 4K Smart TV

Product Price:
₹45,990.00

Customer Rating:
4.3 out of 5 stars

Brand:
Samsung

Availability:
In stock

ASIN:
XXXXXXXXXX
```

Actual values depend on the currently available Amazon product.

---

# 20. Running the Project Again

If the project is already downloaded, you do not need to clone it again.

Open Command Prompt or PowerShell.

Move to the project directory.

Example:

```cmd
cd C:\Users\YourName\Desktop\amazon-playwright-automation
```

Then update the repository:

```cmd
git pull
```

Install dependencies if required:

```cmd
npm install
```

Then run:

```cmd
npx playwright test --headed
```

For PowerShell:

```powershell
npx.cmd playwright test --headed
```

---

# 21. Recommended Clean Installation

Because the project contains `package-lock.json`, another option is:

```cmd
npm ci
```

For PowerShell:

```powershell
npm.cmd ci
```

`npm ci` installs dependencies using the exact versions recorded in `package-lock.json`.

It is useful when running the project on another system.

---

# 22. Run in Debug Mode

If the automation needs to be inspected step by step, run:

## Windows PowerShell

```powershell
npx.cmd playwright test --headed --debug
```

## Windows CMD

```cmd
npx playwright test --headed --debug
```

This opens the Playwright Inspector.

The Inspector allows the user to:

- Pause the test
- Continue step by step
- Inspect locators
- View browser actions
- Identify where a test failure occurs

---

# 23. Open a Trace After Failure

If Playwright creates a trace file after a failed execution, it can be opened using:

```cmd
npx playwright show-trace path-to-trace.zip
```

For PowerShell:

```powershell
npx.cmd playwright show-trace path-to-trace.zip
```

The exact trace path will be displayed in the terminal after a failed test.

---

# 24. Important Files

## Main Test

```text
tests/amazon-tv-search.spec.ts
```

This file controls the complete test workflow.

---

## Home Page Object

```text
pages/HomePage.ts
```

Handles:

- Opening Amazon.in
- Dismissing optional popups
- Searching for Television

---

## Search Results Page Object

```text
pages/SearchResultsPage.ts
```

Handles:

- Waiting for search results
- Selecting the 55-inch filter
- Selecting Samsung
- Selecting Sony
- Opening the first filtered product

---

## Product Page Object

```text
pages/ProductPage.ts
```

Handles extraction of:

- Product Title
- Price
- Rating
- About This Item
- Specifications
- Brand
- Availability
- ASIN

---

## Product Logger

```text
utils/productLogger.ts
```

Handles writing captured product information to:

```text
logs/product-details.log
```

---

## Playwright Configuration

```text
playwright.config.ts
```

Contains configuration such as:

- Amazon.in base URL
- Google Chrome browser
- Viewport
- Timeouts
- HTML report
- Screenshots on failure
- Trace on failure
- Single worker execution

---

# 25. Troubleshooting

## Error: `node is not recognized`

Example:

```text
'node' is not recognized as an internal or external command
```

Solution:

Install Node.js and reopen Command Prompt or PowerShell.

Then verify:

```cmd
node -v
```

---

## Error: `npm is not recognized`

Verify Node.js is installed.

Run:

```cmd
npm -v
```

If using PowerShell, try:

```powershell
npm.cmd -v
```

---

## Error: `git is not recognized`

Install Git.

Then reopen the terminal and run:

```cmd
git --version
```

---

## Error: `npx is not recognized`

Node.js/npm may not be installed correctly.

Check:

```cmd
node -v
npm -v
```

---

## PowerShell Execution Policy Error

If PowerShell displays an error similar to:

```text
running scripts is disabled on this system
```

Use the `.cmd` version of the command.

Instead of:

```powershell
npm install
```

use:

```powershell
npm.cmd install
```

Instead of:

```powershell
npx playwright test --headed
```

use:

```powershell
npx.cmd playwright test --headed
```

---

## Chrome Not Found

Make sure Google Chrome is installed.

This project uses the Chrome browser channel.

Verify that Chrome opens normally on the computer.

---

## Amazon Page Does Not Load

Check:

- Internet connection
- Amazon.in accessibility
- VPN/proxy settings
- Firewall restrictions

Amazon.in must be reachable for the test to run.

---

## Brand or Filter Is Not Available

Amazon.in is a live website.

Its:

- filters
- brands
- products
- prices
- page layout
- recommendations

can change at any time.

Because of this, the automation contains locator fallbacks and waits, but major website changes may still require locator updates.

---

## Test Fails Due to Slow Internet

Retry the test:

```cmd
npx playwright test --headed
```

For PowerShell:

```powershell
npx.cmd playwright test --headed
```

---

# 26. Quick Start for Evaluator

For a new Windows computer:

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm install
npx playwright test --headed
```

For Windows PowerShell:

```powershell
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm.cmd install
npx.cmd playwright test --headed
```

Then open the report:

```powershell
npx.cmd playwright show-report
```

---

# 27. System Requirements Summary

Before running this project, the computer should have:

```text
✓ Windows / macOS / Linux
✓ Node.js
✓ npm
✓ Git
✓ Google Chrome
✓ Internet connection
```

Optional:

```text
✓ Visual Studio Code
```

The evaluator does not need to manually install TypeScript or Playwright globally.

They are handled through the project dependencies.

---

# 28. Design Approach

The project follows the **Page Object Model (POM)** design pattern.

The page-specific actions and locators are separated from the main test scenario.

This improves:

- Readability
- Maintainability
- Reusability
- Separation of concerns

The main Page Objects are:

```text
HomePage
SearchResultsPage
ProductPage
```

---

# 29. Environment Notes

Amazon.in is a live and dynamic website.

Therefore the following can change between executions:

- Product availability
- Product prices
- Customer ratings
- Search results
- Brand order
- Display-size filters
- Product specifications
- Amazon page structure

The test captures currently available live information during execution.

---

# 30. Repository

GitHub Repository:

```text
https://github.com/Subarna201104/amazon-playwright-automation
```

---

# Final Execution Command

### Windows PowerShell

```powershell
npx.cmd playwright test --headed
```

### Windows CMD

```cmd
npx playwright test --headed
```

### Open HTML Report

```powershell
npx.cmd playwright show-report
```

### Open Product Log

```cmd
notepad logs\product-details.log
```