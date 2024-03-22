const puppeteer = require('puppeteer');
const { newInjectedPage } = require('fingerprint-injector');
const { FingerprintGenerator } = require('fingerprint-generator');
const { plugin } = require('puppeteer-with-fingerprints');
const path = require('path');
(async () => {
  
  const browser = await plugin.launch(
    {
      userDataDir: './test-profile/oli',
      // Browser arguments can be used as well:
      args: [`--user-data-dir=${path.resolve('./test-profile/oli')}`],
      headless: false
    }
  );

  // plugin.useProfile(path.resolve('./test-profile/oli'), {
  //   // Don't load fingerprint from profile folder:
  //   loadFingerprint: false,
  //   // Don't load proxy from profile folder:
  //   loadProxy: false,
  // });
  // const browser = await plugin.launch({headless: false});
  const page = await browser.newPage();


  //const page = await browser.newPage();
  //await page.goto('https://amiunique.org/fingerprint');

})();
