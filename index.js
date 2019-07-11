(async() => {
  const express = require('express');
  const app = express();
  const puppeteer = require('puppeteer');
  const foxr = require('foxr').default;
  const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

  const chrome = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const {Storage} = require('@google-cloud/storage');

  app.get('/', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'World';
    res.send(`Hello ${target}!`);
  });

  app.get('/upload', async (req, res) => {
    const storage = new Storage();
    const bucketName = 'cloudrun-sample-storage';
    const filename = './sample.html';
    await storage.bucket(bucketName).upload(filename, {
      destination: 'sample.html',
      public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      },
    }).catch(e => console.log(e));
    res.send(`upload`);
  });

  app.get('/chrome', async (req, res) => {
    const page = await chrome.newPage();
    await page.goto('https://example.com');
    const file = await page.screenshot({encoding: 'binary'});
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.type('png');
    res.send(file);
  });

  // Not working in CloudRun
  app.get('/firefox', async (req, res) => {
    try {
      const browser = await foxr.launch({
        executablePath: '/usr/bin/firefox'
      });
      const page = await browser.newPage();
      await page.goto('https://example.com/').catch(e => console.log(e));
      await page.screenshot({path: '/tmp/screenshot.png'});
      res.sendFile('/tmp/screenshot.png');
    } catch(error) {
      console.log(error)
    }
  });

  app.get('/chrome_noco', async (req, res) => {
    const page = await chrome.newPage();
    await page.goto('https://noco.fun/ogp_render/b/t1Vu8I15FvKZpP6REzKj/e/ArHvhis7pI2JV3Ovv6Mt/', {
      waitUntil: 'networkidle2'
    });
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    const file = await page.screenshot({encoding: 'binary'});
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.type('png');
    res.send(file);
  });

  const port = process.env.PORT || 8080;
  app.listen(port, err => {
    if (err) return console.error(err);
    console.log('Hello world listening on port', port);
  });
})();
