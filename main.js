const { plugin } = require('puppeteer-with-fingerprints');
const { readFile, writeFile, mkdir } = require('fs/promises');
const { FingerprintGenerator } = require('fingerprint-generator');

async function fetchFingerprint() {
    const fingerprint = await plugin.fetch('', {
        tags: ['Microsoft Windows', 'Chrome'],
    });
    // const fingerprintGenerator = new FingerprintGenerator({
    //     // Example configuration, adjust as needed
    //     browsers: ['chrome', 'firefox', 'safari'],
    //     //operatingSystems: ['windows', 'macos', 'linux'],
    //     operatingSystems: ['windows'],
    //     devices: ['desktop'],
    //     screen: {
    //         // Define minimum and maximum width
    //         width: { min: 1000, max: 1500 },
    //         // Similarly, you can define height if needed
    //         height: { min: 500, max: 700 },
    //       },
    // });

    // const fingerprint = fingerprintGenerator.getFingerprint();
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

// Main function:
async function main() {
    try{
        let profilePath = './profiles/pink-flamingo';
        let fingerprint = await loadFingerprint(profilePath);
        plugin.useFingerprint(fingerprint);

        const browser = await plugin.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://amiunique.org/fingerprint');

        browser.on('disconnected', async () => {
            await saveFingerprint(fingerprint, profilePath);
            console.log(`Fingerprint saved to ${profilePath} after browser closed.`);
        });

        console.log('Close the browser to save the fingerprint.');
    }
    catch (error) {
        console.log('Err at main:', error);
    }

}

main().catch(console.error);
