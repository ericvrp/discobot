// const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
// const { cleanup } = require("./tools");

// https://search.azlyrics.com/search.php?q=elvis+presley

const scrapeAzLyrics = async (artist = "elvis", verbose = false) => {
  // console.log(artist, verbose);

  const searchUrl = `https://search.azlyrics.com/search.php?q=${artist}`;
  // console.log(searchUrl);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(searchUrl);
  const artistUrl = await page.$eval("td a", (x) => x.href);
  // console.log("artistUrl", artistUrl);

  const y = await page.goto(artistUrl);
  // console.log(y);

  await browser.close();
}; // end of scrapeAzLyrics(artist, verbose)

module.exports = scrapeAzLyrics;
