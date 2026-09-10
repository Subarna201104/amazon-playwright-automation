# Amazon.in Playwright + TypeScript Automation Assessment

This project automates an Amazon.in TV search scenario using **Playwright with TypeScript**.

The automation searches for televisions, applies display-size and brand filters, opens the first filtered product, captures detailed product information, and stores the captured data in a log file and Playwright HTML report.

---

# Automated Scenario

The automation performs the following steps:

1. Open Amazon.in.
2. Search for `Television`.
3. Apply the **55-inch** display-size filter.
4. Select two TV brands:
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

Google Chrome is required because the Playwright configuration uses the Chrome browser channel.


---

# 2. Install Node.js

This project requires **Node.js** because Playwright with TypeScript runs in the Node.js environment.

Installing Node.js also provides:

```text
npm
npx
```

`npm` is used to install the project dependencies.

`npx` is used to execute Playwright commands.

Download the **Node.js LTS version** from the official Node.js website:

```text
https://nodejs.org/
```

### Steps

1. Open a web browser.
2. Go to the official Node.js website.
3. Download the **LTS version** of Node.js for Windows.
4. Open the downloaded installer.
5. Follow the installation instructions using the default options.
6. Complete the installation.
7. Close any Command Prompt or PowerShell window that was already open.
8. Open a new Command Prompt or PowerShell window.

---

# 3. Verify Node.js and npm Installation

After installing Node.js, verify that Node.js and npm are available.

### Steps

1. Press:

```text
Windows Key + R
```

2. Type:

```text
cmd
```

3. Press Enter.
4. Windows Command Prompt will open.
5. Type:

```cmd
node -v
```

6. Press Enter.
7. Check whether a Node.js version number is displayed.

Example:

```text
v22.x.x
```

8. Now type:

```cmd
npm -v
```

9. Press Enter.
10. Check whether an npm version number is displayed.

Example:

```text
10.x.x
```

If both commands display version numbers, Node.js and npm are installed correctly.

---

# 4. Install Git

Git is required to clone the project from GitHub.

Download Git from the official Git website:

```text
https://git-scm.com/
```

### Steps

1. Open a web browser.
2. Go to the official Git website.
3. Download Git for Windows.
4. Open the downloaded installer.
5. Follow the installation instructions using the default options.
6. Complete the installation.
7. Close Command Prompt or PowerShell if it is already open.
8. Open a new Command Prompt or PowerShell window.

---

# 5. Verify Git Installation

After installing Git, verify that it is available.

### Steps

1. Open Windows Command Prompt.
2. Type:

```cmd
git --version
```

3. Press Enter.
4. Check whether a Git version number is displayed.

Example:

```text
git version 2.x.x
```

5. If the version number is displayed, Git is installed successfully.

---

# 6. Visual Studio Code - Optional

Visual Studio Code is **not required** to run the automation.

It is only useful if the user wants to:

- View the project files
- Read the TypeScript code
- Edit the project
- Use the integrated terminal

The complete project can be executed directly using Windows Command Prompt or PowerShell.

### Steps to Install VS Code - Optional

1. Open a web browser.
2. Go to the official Visual Studio Code website.
3. Download VS Code for Windows.
4. Open the downloaded installer.
5. Follow the installation instructions.
6. Complete the installation.
7. Open VS Code if you want to view or edit the project.

If you only want to execute the automation, this step can be skipped.

---

# 7. Choose a Location for the Project

The project can be cloned into any folder on the Windows computer.

For this example, the project will be saved on the Windows Desktop.

### Steps

1. Open Windows Command Prompt.
2. Type the following command:

```cmd
cd %USERPROFILE%\Desktop
```

3. Press Enter.
4. Command Prompt will now point to the Desktop.
5. The terminal should display a location similar to:

```text
C:\Users\YourName\Desktop>
```

6. Keep this Command Prompt window open.
7. Continue to the repository cloning step.

---

# 8. Clone the GitHub Repository

The project now needs to be downloaded from GitHub.

Repository:

```text
https://github.com/Subarna201104/amazon-playwright-automation
```

### Steps

1. Keep Windows Command Prompt open.
2. Make sure Command Prompt is pointing to the location where you want to save the project.
3. If you followed the previous step, Command Prompt should currently be pointing to the Desktop.
4. Copy the following command:

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
```

5. Paste the command into Command Prompt.
6. Press Enter.
7. Git will begin downloading the project.
8. Wait until Git finishes cloning the repository.
9. You may see messages similar to:

```text
Cloning into 'amazon-playwright-automation'...
Receiving objects...
Resolving deltas...
```

10. After completion, a folder named:

```text
amazon-playwright-automation
```

will be created automatically.

11. Do not manually create the project folder.
12. Continue to the next step to enter the project folder.

---

# 9. Enter the Project Folder

After cloning the repository, Command Prompt must be moved inside the project folder.

### Steps

1. Keep the same Command Prompt window open.
2. Type:

```cmd
cd amazon-playwright-automation
```

3. Press Enter.
4. Command Prompt should now display a location similar to:

```text
C:\Users\YourName\Desktop\amazon-playwright-automation>
```

5. This confirms that Command Prompt is inside the project folder.
6. To verify the project files, type:

```cmd
dir
```

7. Press Enter.
8. You should see files and folders such as:

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

If these files are displayed, you are in the correct project folder.

---

# 10. Install Project Dependencies

The project dependencies are defined in:

```text
package.json
package-lock.json
```

The dependencies must be installed before running the automation.

### Windows Command Prompt - Steps

1. Make sure Command Prompt is inside the `amazon-playwright-automation` folder.
2. Type:

```cmd
npm install
```

3. Press Enter.
4. Wait for npm to install all required project dependencies.
5. Do not close Command Prompt while the installation is running.
6. After installation, a `node_modules` folder will be created automatically.
7. Wait until the command completely finishes before continuing.

### Windows PowerShell

If PowerShell blocks the normal npm command, use:

```powershell
npm.cmd install
```

The `node_modules` folder does not need to be stored in GitHub because it can be recreated using the project dependencies.

---

# 11. Verify Playwright Installation

After installing the project dependencies, verify that Playwright is available.

### Windows Command Prompt - Steps

1. Keep Command Prompt open.
2. Make sure it is still inside the project folder.
3. Type:

```cmd
npx playwright --version
```

4. Press Enter.
5. Check whether a Playwright version number is displayed.

Example:

```text
Version 1.x.x
```

6. If a version number appears, Playwright is ready.

### Windows PowerShell

Use:

```powershell
npx.cmd playwright --version
```

---

# 12. Google Chrome Requirement

This project is configured to use **Google Chrome**.

The Playwright configuration uses the Chrome browser channel.

Therefore, Google Chrome must be installed on the Windows computer before running the automation.

### Steps

1. Confirm that Google Chrome has already been installed.
2. Open Google Chrome manually once.
3. Check that Chrome opens normally.
4. Close Chrome.
5. Return to Command Prompt or PowerShell.
6. Continue to the automation execution step.

---

# 13. Run the Automation

Make sure the terminal is inside:

```text
amazon-playwright-automation
```

### Windows Command Prompt - Steps

1. Open Command Prompt if it is not already open.
2. Navigate to the project folder if required.
3. Make sure the terminal is inside `amazon-playwright-automation`.
4. Type:

```cmd
npx playwright test --headed
```

5. Press Enter.
6. Wait for Google Chrome to open.
7. Allow the automation to run.
8. Do not manually interact with the browser while the automation is running.
9. Wait until the complete test execution finishes.
10. Check Command Prompt for the final test result.

### Windows PowerShell

Run:

```powershell
npx.cmd playwright test --headed
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

### Windows Command Prompt - Steps

1. Wait until the Playwright test has completely finished.
2. Return to Command Prompt.
3. Make sure Command Prompt is still inside the `amazon-playwright-automation` folder.
4. Type:

```cmd
npx playwright show-report
```

5. Press Enter.
6. Wait for the Playwright HTML report to open in the browser.
7. The report will display the test execution details.

### Windows PowerShell

Run:

```powershell
npx.cmd playwright show-report
```

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

### Steps to Open the Log File

1. Wait until the automation has finished.
2. Return to Command Prompt.
3. Make sure Command Prompt is inside the project folder.
4. Type:

```cmd
notepad logs\product-details.log
```

5. Press Enter.
6. Windows Notepad will open.
7. The captured Amazon product information will be displayed.

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

Node.js, Git and Google Chrome also do not need to be installed again if they are already available on the computer.

### Steps

1. Open Windows Command Prompt.
2. Type:

```cmd
cd %USERPROFILE%\Desktop\amazon-playwright-automation
```

3. Press Enter.
4. Make sure Command Prompt is now inside the project folder.
5. Run:

```cmd
npx playwright test --headed
```

6. Press Enter.
7. Wait for the automation to complete.

### Windows PowerShell

If using PowerShell:

```powershell
npx.cmd playwright test --headed
```

---

# 21. Update an Existing Project

If the repository was cloned earlier and the latest changes need to be downloaded from GitHub, use `git pull`.

### Steps

1. Open Windows Command Prompt.
2. Navigate to the project folder:

```cmd
cd %USERPROFILE%\Desktop\amazon-playwright-automation
```

3. Press Enter.
4. Type:

```cmd
git pull
```

5. Press Enter.
6. Wait for Git to download the latest changes.
7. Run:

```cmd
npm install
```

8. Press Enter.
9. Wait for the dependencies to finish installing/updating.
10. Run:

```cmd
npx playwright test --headed
```

11. Press Enter.
12. Wait for the automation to complete.

---

# 22. Clean Dependency Installation

Because the project contains:

```text
package-lock.json
```

dependencies can also be installed using `npm ci`.

### Windows Command Prompt

```cmd
npm ci
```

### Windows PowerShell

```powershell
npm.cmd ci
```

`npm ci` installs the dependency versions recorded in `package-lock.json`.

This is useful when setting up the project on another Windows computer.

---

# 23. Run in Debug Mode

If the automation needs to be inspected step by step, Playwright Debug Mode can be used.

### Windows Command Prompt - Steps

1. Open Command Prompt.
2. Navigate to the project folder.
3. Type:

```cmd
npx playwright test --headed --debug
```

4. Press Enter.
5. Playwright Inspector will open.
6. Use the Inspector to observe the automation step by step.

### Windows PowerShell

Run:

```powershell
npx.cmd playwright test --headed --debug
```

The Playwright Inspector can be used to:

- Pause the automation
- Continue the test step by step
- Inspect locators
- View browser actions
- Identify where a test failure occurs

---

# 24. Open a Playwright Trace After Failure

If the test fails and Playwright generates a trace file, the exact trace location is displayed in the terminal.

Example:

```text
test-results\...\trace.zip
```

### Steps

1. Wait for the failed test to finish.
2. Look at the terminal output.
3. Find the path ending with:

```text
trace.zip
```

4. Copy the displayed trace path.
5. Run:

```cmd
npx playwright show-trace path-to-trace.zip
```

6. Replace `path-to-trace.zip` with the actual path shown in the terminal.
7. Press Enter.
8. The Playwright Trace Viewer will open.

### Windows PowerShell

Use:

```powershell
npx.cmd playwright show-trace path-to-trace.zip
```

The Trace Viewer helps inspect:

- Browser actions
- Test steps
- Page snapshots
- Network activity
- Locators
- Failure details

---

# 25. Important Project Files

## Main Test

```text
tests/amazon-tv-search.spec.ts
```

This file contains the main automation scenario and validations.

## Home Page Object

```text
pages/HomePage.ts
```

Handles:

- Opening Amazon.in
- Dismissing optional popups/interstitials
- Searching for Television

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

## Product Logger

```text
utils/productLogger.ts
```

Writes the captured product information to:

```text
logs/product-details.log
```

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

# 26. Troubleshooting

## Error: Node.js Is Not Recognized

Example:

```text
'node' is not recognized as an internal or external command
```

### Solution

1. Check whether Node.js has been installed.
2. If not, install Node.js.
3. Close Command Prompt.
4. Open Command Prompt again.
5. Run:

```cmd
node -v
```

6. Confirm that the Node.js version appears.

---

## Error: npm Is Not Recognized

### Solution

1. Check Node.js:

```cmd
node -v
```

2. Press Enter.
3. Check npm:

```cmd
npm -v
```

4. Press Enter.
5. If using Windows PowerShell, try:

```powershell
npm.cmd -v
```

---

## Error: Git Is Not Recognized

Example:

```text
'git' is not recognized as an internal or external command
```

### Solution

1. Install Git for Windows.
2. Close Command Prompt.
3. Open Command Prompt again.
4. Run:

```cmd
git --version
```

5. Confirm that the Git version is displayed.

---

## Error: npx Is Not Recognized

### Solution

1. Check Node.js:

```cmd
node -v
```

2. Check npm:

```cmd
npm -v
```

3. Make sure both commands display versions.
4. Navigate to the project folder.
5. Install the project dependencies:

```cmd
npm install
```

6. Try the Playwright command again.

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

### Solution

1. Check whether Google Chrome is installed.
2. Open Chrome manually.
3. Confirm that Chrome works.
4. Close Chrome.
5. Run the automation again.

This project is configured to use the Google Chrome browser channel.

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

Run the test again.

### Windows Command Prompt

```cmd
npx playwright test --headed
```

### Windows PowerShell

```powershell
npx.cmd playwright test --headed
```

---

# 27. Quick Start for Evaluator

For a completely new Windows computer, first make sure the following are installed:

```text
1. Node.js
2. Git
3. Google Chrome
4. Internet connection is available
```

Then open Windows Command Prompt.

### Steps

1. Go to the Desktop:

```cmd
cd %USERPROFILE%\Desktop
```

2. Press Enter.

3. Clone the repository:

```cmd
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
```

4. Press Enter and wait for cloning to finish.

5. Enter the project folder:

```cmd
cd amazon-playwright-automation
```

6. Press Enter.

7. Install the dependencies:

```cmd
npm install
```

8. Press Enter and wait for installation to finish.

9. Run the automation:

```cmd
npx playwright test --headed
```

10. Press Enter and wait for the test to complete.

11. Open the HTML report:

```cmd
npx playwright show-report
```

12. Press Enter.

13. To open the product log:

```cmd
notepad logs\product-details.log
```

### Windows PowerShell

Use:

```powershell
cd $HOME\Desktop
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm.cmd install
npx.cmd playwright test --headed
npx.cmd playwright show-report
```

---

# 28. System Requirements Summary

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

# 29. Why Node.js Is Required

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

# 30. Design Approach

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

# 31. Environment Notes

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

# 32. GitHub Repository

Repository:

```text
https://github.com/Subarna201104/amazon-playwright-automation
```

---

# Final Commands

## First-Time Setup - Windows Command Prompt

```cmd
cd %USERPROFILE%\Desktop
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm install
npx playwright --version
npx playwright test --headed
```

## First-Time Setup - Windows PowerShell

```powershell
cd $HOME\Desktop
git clone https://github.com/Subarna201104/amazon-playwright-automation.git
cd amazon-playwright-automation
npm.cmd install
npx.cmd playwright --version
npx.cmd playwright test --headed
```

## Run Test - Windows Command Prompt

```cmd
npx playwright test --headed
```

## Run Test - Windows PowerShell

```powershell
npx.cmd playwright test --headed
```

## Open HTML Report - Windows Command Prompt

```cmd
npx playwright show-report
```

## Open HTML Report - Windows PowerShell

```powershell
npx.cmd playwright show-report
```

## Open Product Log

```cmd
notepad logs\product-details.log
```