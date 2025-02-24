// amazon-scraper.js
const express = require('express');
const playwright = require('playwright');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

async function scrapeAmazon(url) {
  const browser = await playwright.chromium.launch({ headless: true }); // Use headless: false for debugging
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the product title and image to load
    await page.waitForSelector('#productTitle');
    await page.waitForSelector('#landingImage');
    await page.waitForSelector('#feature-bullets');

    const title = await page.$eval('#productTitle', (el) => el.textContent.trim());
    const imageUrl = await page.$eval('#landingImage', (el) => el.getAttribute('src'));
    const description = await page.$eval('#feature-bullets', (el) => el.textContent.trim());

    await browser.close();
    return { title, imageUrl, description };
  } catch (error) {
    console.error('Scraping failed:', error);
    await browser.close();
    return { error: error.message };
  }
}

app.get('/scrape', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required.' });
  }

  const result = await scrapeAmazon(url);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});