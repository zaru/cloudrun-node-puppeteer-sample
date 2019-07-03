(async() => {
  const express = require('express');
  const app = express();
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  app.get('/', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'World';
    res.send(`Hello ${target}!`);
  });

  app.get('/sc', async (req, res) => {
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const file = await page.screenshot({encoding: 'binary'});
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.type('png');
    res.send(file);
    // await page.screenshot({path: '/tmp/hoge.png'});
    // res.sendFile('/tmp/hoge.png');
  });

  app.get('/noco', async (req, res) => {
    const page = await browser.newPage();
    await page.goto('https://noco.fun/ogp_render/b/t1Vu8I15FvKZpP6REzKj/e/ArHvhis7pI2JV3Ovv6Mt/', {
      waitUntil: 'networkidle0'
    });
    const file = await page.screenshot({encoding: 'binary'});
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.type('png');
    res.send(file);
  });

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log('Hello world listening on port', port);
  });
})();
