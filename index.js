
(async() => {
  const express = require('express');
  const app = express();
  // const puppeteer = require('puppeteer');
  // const puppeteer = require('puppeteer-firefox');
  // const browser = await puppeteer.launch({
    // headless: true,
    // args: [
    //   '--no-sandbox',
    //   '--disable-setuid-sandbox'
    // ]
  // });
  // const foxr = require('foxr').default;
  // const browser = await foxr.launch({
  //   // executablePath: '/Applications/Firefox.app/Contents/MacOS/firefox-bin'
  //   executablePath: '/usr/bin/firefox'
  // });
  // const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

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

  // app.get('/sc', async (req, res) => {
  //   const page = await browser.newPage();
  //   await page.goto('https://example.com');
  //   const file = await page.screenshot({encoding: 'binary'});
  //   res.setHeader('Cache-Control', 'public, max-age=0');
  //   res.type('png');
  //   res.send(file);
  //   // await page.screenshot({path: '/tmp/hoge.png'});
  //   // res.sendFile('/tmp/hoge.png');
  // });

  // app.get('/noco', async (req, res) => {
  //   const page = await browser.newPage();
  //   // page.setViewport({width: 1200, height: 630, deviceScaleFactor: 1});
  //   // await page.goto('http://localhost:9999/sample.html').catch(e => console.log(e));
  //   await page.goto('https://noco.fun/ogp_render/b/t1Vu8I15FvKZpP6REzKj/e/ArHvhis7pI2JV3Ovv6Mt/', {
  //     waitUntil: 'networkidle2'
  //   }).catch(e => console.log(e));
  //   // await page.waitFor(5000);
  //   // await page.evaluateHandle('document.fonts.ready');
  //   await sleep(5000);
  //   await page.screenshot({path: '/tmp/hoge.png'});
  //   res.sendFile('/tmp/hoge.png');
  //   // const file = await page.screenshot({encoding: 'binary'});
  //   // res.setHeader('Cache-Control', 'public, max-age=0');
  //   // res.type('png');
  //   // res.send(file);
  // });

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log('Hello world listening on port', port);
  });
})();
