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

This section explains how to run the project on a **Windows computer from the beginning**.

No previous Playwright setup is required.

Before running the project, make sure the required software listed below is installed.

---

# 1. Install Google Chrome

This project is configured to run using **Google Chrome**.

Download and install Google Chrome from the official Google Chrome website.

After installation, open Chrome once to confirm that it works properly.

Google Chrome is required because the Playwright configuration uses the Chrome browser channel.

---

# 2. Install Node.js

This project requires **Node.js** because Playwright with TypeScript runs in the Node.js environment.

Installing Node.js also provides:

- npm
- npx

`npm` is used to install the project dependencies.

`npx` is used to execute Playwright commands.

Download the **Node.js LTS version** from the official Node.js website:

```text
https://nodejs.org/
```

During installation, keep the default installation options selected.

After installation, close and reopen Command Prompt or PowerShell.

---

# 3. Verify Node.js and npm Installation

Open Windows Command Prompt.

Press:

```text
Windows Key + R
```

Type:

```text
cmd
```

and press Enter.

Check the Node.js version:

```cmd
node -v
```

Example output:

```text
v22.x.x
```

Check the npm version:

```cmd
npm -v
```

Example output:

```text
10.x.x
```

If both commands display version numbers, Node.js and npm are installed correctly.

---

# 4. Install Git

Git is required to clone/download the project from GitHub.

Download and install Git from the official Git website:

```text
https://git-scm.com/
```

During installation, the default installation options can be used.

After installation, close and reopen Command Prompt or PowerShell.

---

# 5. Verify Git Installation

Open Command Prompt and run:

```cmd
git --version
```

Example output:

```text
git version 2.x.x
```

If a version number is displayed, Git is installed correctly.

---

# 6. Visual Studio Code - Optional

Visual Studio Code is **not required** to execute the automation.

It is only required if the user wants to view or edit the project source code using an editor.

The complete project can be cloned, installed, and executed directly using Windows Command Prompt or PowerShell.

---

# 7. Choose a Location for the Project

The project can be cloned into any folder on the Windows computer.

For example, to use the Desktop, open Command Prompt and run:

```cmd
cd %USERPROFILE%\Desktop
```

---

# 8. Clone the GitHub Repository

Run:

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
```

This downloads the complete project from GitHub.

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

The terminal must be inside the project folder before running npm or Playwright commands.

To verify the project files, run:

```cmd
dir
```

You should see files and folders such as:

```text
pages
tests
utils
logs
package.json
package-lock.json
playwright.config.ts
tsconfig.json
README.md
```

---

# 10. Install Project Dependencies

The project dependencies are defined in:

```text
package.json
package-lock.json
```

## Windows Command Prompt

Run:

```cmd
npm install
```

## Windows PowerShell

Run:

```powershell
npm.cmd install
```

This installs all required project packages into:

```text
node_modules
```

The `node_modules` folder does not need to be downloaded from GitHub because it can be generated using `npm install`.

---

# 11. Verify Playwright Installation

After installing the dependencies, verify Playwright.

## Windows Command Prompt

```cmd
npx playwright --version
```

## Windows PowerShell

```powershell
npx.cmd playwright --version
```

A Playwright version number should be displayed.

Example:

```text
Version 1.x.x
```

This confirms that Playwright is available in the project.

---

# 12. Google Chrome Requirement

This project is configured to use **Google Chrome**.

The Playwright configuration contains the Chrome browser channel.

Therefore, Google Chrome must be installed on the Windows computer before running the automation.

No separate browser installation command is required for this project when Google Chrome is already installed.

---

# 13. Run the Automation

Make sure the terminal is inside:

```text
amazon-playwright-automation
```

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

The `--headed` option allows the browser to remain visible while the automation is running.

---

# 14. Expected Automation Flow

After running the test, the automation performs the following workflow:

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
Attach product details to Playwright HTML report
```

Samsung is selected before Sony because the available Amazon brand filters can update dynamically after a filter is applied.

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

The exact terminal output and product information may vary because Amazon.in contains live and dynamically changing data.

---

# 16. Open the Playwright HTML Report

After the automation finishes, the Playwright HTML report can be opened.

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

This opens the Playwright HTML report in the browser.

---

# 17. Playwright Report Contains

The HTML report displays the automation steps, including:

- Open Amazon.in
- Search for Television
- Wait for search results
- Select 55-inch TV filter
- Select Samsung and Sony
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

---

# 18. Product Details Attachment

The Playwright HTML report contains an attachment named:

```text
Amazon Product Details
```

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

The captured product information is also written to:

```text
logs/product-details.log
```

To open the log file directly using Windows Command Prompt or PowerShell:

```cmd
notepad logs\product-details.log
```

The file can also be opened manually from:

```text
amazon-playwright-automation
        ↓
logs
        ↓
product-details.log
```

Example log information:

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

The actual captured information depends on the product available on Amazon.in during execution.

---

# 20. Running the Project Again

If the repository has already been cloned, it does **not** need to be cloned again.

Open Command Prompt or PowerShell and navigate to the project folder.

Example:

```cmd
cd C:\Users\YourName\Desktop\amazon-playwright-automation
```

To download the latest project changes from GitHub:

```cmd
git pull
```

Install dependencies if required:

## Windows Command Prompt

```cmd
npm install
```

## Windows PowerShell

```powershell
npm.cmd install
```

Then run the automation again.

## Windows Command Prompt

```cmd
npx playwright test --headed
```

## Windows PowerShell

```powershell
npx.cmd playwright test --headed
```

---

# 21. Clean Dependency Installation

Because the project contains:

```text
package-lock.json
```

dependencies can also be installed using:

## Windows Command Prompt

```cmd
npm ci
```

## Windows PowerShell

```powershell
npm.cmd ci
```

`npm ci` installs the dependency versions recorded in `package-lock.json`.

This is useful when setting up the project on another Windows computer.

---

# 22. Run in Debug Mode

If the automation needs to be inspected step by step, Playwright Debug Mode can be used.

## Windows PowerShell

```powershell
npx.cmd playwright test --headed --debug
```

## Windows Command Prompt

```cmd
npx playwright test --headed --debug
```

Debug mode opens the Playwright Inspector.

The Inspector can be used to:

- Pause the automation
- Continue the test step by step
- Inspect locators
- View browser actions
- Identify where a test failure occurs

---

# 23. Open a Playwright Trace After Failure

If the test fails and Playwright generates a trace file, the exact trace location is displayed in the terminal.

Example:

```text
test-results\...\trace.zip
```

## Windows PowerShell

```powershell
npx.cmd playwright show-trace path-to-trace.zip
```

## Windows Command Prompt

```cmd
npx playwright show-trace path-to-trace.zip
```

Replace:

```text
path-to-trace.zip
```

with the actual trace path displayed after the failed test.

The Playwright Trace Viewer helps inspect:

- Browser actions
- Test steps
- Page snapshots
- Network activity
- Locators
- Failure details

---

# 24. Important Project Files

## Main Test

```text
tests/amazon-tv-search.spec.ts
```

This file contains the main automation scenario and validations.

---

## Home Page Object

```text
pages/HomePage.ts
```

Handles:

- Opening Amazon.in
- Dismissing optional popups/interstitials
- Searching for Television

---

## Search Results Page Object

```text
pages/SearchResultsPage.ts
```

Handles:

- Waiting for search results
- Applying the 55-inch display-size filter
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
- Product Price
- Customer Rating
- About This Item
- Product Specifications
- Brand
- Availability
- ASIN

---

## Product Logger

```text
utils/productLogger.ts
```

Writes the captured product information to:

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
- Single-worker execution

---

# 25. Troubleshooting

## Error: Node.js Is Not Recognized

Example:

```text
'node' is not recognized as an internal or external command
```

Install Node.js.

After installation, close and reopen Command Prompt or PowerShell.

Verify:

```cmd
node -v
```

---

## Error: npm Is Not Recognized

Verify that Node.js is installed:

```cmd
node -v
```

Then check npm:

```cmd
npm -v
```

For Windows PowerShell:

```powershell
npm.cmd -v
```

---

## Error: Git Is Not Recognized

Example:

```text
'git' is not recognized as an internal or external command
```

Install Git and reopen the terminal.

Verify:

```cmd
git --version
```

---

## Error: npx Is Not Recognized

Check that Node.js and npm are installed:

```cmd
node -v
npm -v
```

Then install the project dependencies:

```cmd
npm install
```

---

## PowerShell Script Execution Error

If Windows PowerShell displays an error similar to:

```text
running scripts is disabled on this system
```

use the `.cmd` versions of the commands.

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

## Google Chrome Not Found

Make sure Google Chrome is installed on the Windows computer.

This project is configured to use the Chrome browser channel.

Open Google Chrome manually once to verify that it is installed correctly.

---

## Amazon.in Does Not Load

Check:

- Internet connection
- Amazon.in accessibility
- Firewall restrictions
- VPN or proxy configuration

Amazon.in must be accessible for the automation to execute.

---

## Brand or Filter Is Not Available

Amazon.in is a live website.

Its:

- Filters
- Brands
- Products
- Prices
- Ratings
- Search results
- Page layout

can change over time.

The automation contains locator fallbacks and waits to handle some dynamic changes, but major website changes may require locator updates.

---

## Test Fails Due to Slow Internet

Run the test again:

### Windows PowerShell

```powershell
npx.cmd playwright test --headed
```

### Windows Command Prompt

```cmd
npx playwright test --headed
```

---

# 26. Quick Start for Evaluator

For a completely new Windows computer, first install:

```text
1. Node.js
2. Git
3. Google Chrome
4. Internet connection must be available
```

Then open Windows Command Prompt and run:

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm install
npx playwright test --headed
```

To open the Playwright report:

```cmd
npx playwright show-report
```

For Windows PowerShell:

```powershell
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm.cmd install
npx.cmd playwright test --headed
npx.cmd playwright show-report
```

---

# 27. System Requirements Summary

Before running this project, the Windows computer should have:

```text
✓ Windows
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

The evaluator does **not** need to install Playwright or TypeScript globally.

The required project packages are defined in the project dependencies and are installed using:

```cmd
npm install
```

---

# 28. Why Node.js Is Required

Node.js provides the runtime environment required for the Playwright TypeScript project.

It also provides:

```text
npm
npx
```

The basic relationship is:

```text
Node.js
   ↓
provides npm and npx
   ↓
npm installs project dependencies
   ↓
npx executes Playwright
   ↓
Playwright runs the TypeScript automation
   ↓
Google Chrome opens
   ↓
Amazon.in automation executes
```

Node.js only needs to be installed **once on the Windows computer**.

It does not need to be reinstalled every time the project is executed.

---

# 29. Design Approach

The project follows the **Page Object Model (POM)** design pattern.

Page-specific actions and locators are separated from the main test scenario.

The main Page Objects are:

```text
HomePage
SearchResultsPage
ProductPage
```

This approach improves:

- Readability
- Maintainability
- Reusability
- Separation of concerns

---

# 30. Environment Notes

The project is designed to run on a **Windows computer** with the required prerequisites installed.

Amazon.in is a live and dynamic website.

Therefore, the following can change between executions:

- Product availability
- Product prices
- Customer ratings
- Search results
- Brand order
- Display-size filters
- Product specifications
- Amazon page structure

The automation captures the currently available live information during execution.

---

# 31. GitHub Repository

Repository:

```text
https://github.com/Subarna201104/amazon-playwright-automation
```

---

# Final Commands

## First-Time Setup - Windows Command Prompt

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm install
npx playwright test --headed
```

## First-Time Setup - Windows PowerShell

```powershell
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm.cmd install
npx.cmd playwright test --headed
```

## Run Test - PowerShell

```powershell
npx.cmd playwright test --headed
```

## Open HTML Report - PowerShell

```powershell
npx.cmd playwright show-report
```

## Open Product Log

```cmd
notepad logs\product-details.log
```