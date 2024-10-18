const puppeteer = require('puppeteer');

(async () => {
    try {
        // Launch the browser
        const browser = await puppeteer.launch({ headless: false }); // headless: false opens the browser window

        // Open a new page
        const page = await browser.newPage();

        // Navigate to Google
        await page.goto('https://google.com');

        // Log success message
        console.log('Successfully navigated to Google!');

        // Close the browser after 5 seconds
        setTimeout(async () => {
            await browser.close();
            console.log('Browser closed.');
        }, 5000);
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();
