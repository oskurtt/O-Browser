const { plugin } = require('puppeteer-with-fingerprints');
const { readFile, writeFile, mkdir } = require('fs/promises');
const path = require('path');
const { start } = require('repl');

async function fetchFingerprint() {
    const fingerprint = await plugin.fetch('', {
        tags: ['Microsoft Windows', 'Chrome'],
    });
    return fingerprint;
}

async function saveFingerprint(fingerprint, path) {
    await mkdir(path, { recursive: true });
    const filePath = `${path}/fingerprint.json`
    await writeFile(filePath, JSON.stringify(fingerprint, null, 2));
    console.log(`New fingerprint saved to ${filePath}.`);
}

async function loadFingerprint(profilePath) {
    try {
        const data = await readFile(`${profilePath}/fingerprint.json`, 'utf8'); // Ensure the path uses `/`
        const fingerprint = JSON.parse(data);
        console.log('Fingerprint file found.');
        return fingerprint;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Fingerprint file not found. Fetching a new fingerprint...');
            const fingerprint = await fetchFingerprint();
            await saveFingerprint(fingerprint, profilePath); // Save the new fingerprint
            return fingerprint;
        } else {
            console.error('Error loading fingerprint:', error);
            throw error;
        }
    }
}

async function startInstance(profileName) {
    try{
        let profilePath = `./profiles/${profileName}`;
        let fingerprint = await loadFingerprint(profilePath);

        plugin.useFingerprint(fingerprint);
        const browser = await plugin.launch(
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
            await saveFingerprint(fingerprint, profilePath);
            console.log(`Fingerprint saved to ${profilePath} after browser closed.`);
        });

        console.log(`${profileName} - Close the browser to save the fingerprint.`);
    }
    catch (error) {
        console.log('Err at startInstance:', error);
    }
}
// Main function:
async function main() {
    try{
        await startInstance('oli');
        await startInstance('test');
    }
    catch (error) {
        console.log('Err at main:', error);
    }

}

main().catch(console.error);
