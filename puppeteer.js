const puppeteer = require('puppeteer');
const { readFile, writeFile, mkdir } = require('fs/promises');
const path = require('path');

async function startInstance(profileName) {
    try {
        let profilePath = `./profiles/${profileName}`;

        const browser = await puppeteer.launch({
            userDataDir: profilePath,
            args: [
                `--user-data-dir=${path.resolve(profilePath)}`,
                '--start-maximized' 
            ],
            headless: false,
            defaultViewport: null  
        });

        const [page] = await browser.pages();

        await page.goto('https://www.google.com');

        browser.on('disconnected', async () => {
            console.log(`Browser closed for profile: ${profileName}`);
        });

        console.log(`${profileName} - Close the browser to end the session.`);
    } catch (error) {
        console.log('Error at startInstance:', error);
    }
}

module.exports = { startInstance };
