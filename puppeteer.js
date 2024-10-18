// const { plugin } = require('puppeteer-with-fingerprints');
const puppeteer = require('puppeteer'); // Use regular puppeteer
const { readFile, writeFile, mkdir } = require('fs/promises');
const path = require('path');
const { start } = require('repl');

// async function fetchFingerprint() {
//     const fingerprint = await plugin.fetch('', {
//         tags: ['Microsoft Windows', 'Chrome'],
//     });
//     return fingerprint;
// }

// async function saveFingerprint(fingerprint, path) {
//     await mkdir(path, { recursive: true });
//     const filePath = `${path}/fingerprint.json`
//     await writeFile(filePath, JSON.stringify(fingerprint, null, 2));
//     console.log(`New fingerprint saved to ${filePath}.`);
// }

async function loadFingerprint(profilePath) {
    try {
        const data = await readFile(`${profilePath}/fingerprint.json`, 'utf8'); // Ensure the path uses `/`
        const fingerprint = JSON.parse(data);
        console.log('Fingerprint file found.');
        return fingerprint;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Fingerprint file not found. Creating profile directory...');
            await mkdir(profilePath, { recursive: true });
            return null;
        } else {
            console.error('Error loading fingerprint:', error);
            throw error;
        }
    }
}

async function startInstance(profileName) {
    try {
        let profilePath = `./profiles/${profileName}`;
        let fingerprint = await loadFingerprint(profilePath);

        // Commenting out fingerprint related code:
        // plugin.useFingerprint(fingerprint);

        const browser = await puppeteer.launch(
            {
                userDataDir: profilePath,
                // Browser arguments can be used as well:
                args: [`--user-data-dir=${path.resolve(profilePath)}`],
                headless: false
            }
        );

        const page = await browser.newPage();
        //await page.goto('https://amiunique.org/fingerprint');
        await page.evaluate((profileName) => {
            document.title = profileName;
        }, profileName);

        browser.on('disconnected', async () => {
            // Fingerprint saving is no longer needed:
            // await saveFingerprint(fingerprint, profilePath);
            console.log(`Browser closed for profile: ${profileName}`);
        });

        console.log(`${profileName} - Close the browser to end the session.`);
    }
    catch (error) {
        console.log('Err at startInstance:', error);
    }
}

module.exports = { startInstance };
