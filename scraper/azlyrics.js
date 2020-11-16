const puppeteer = require("puppeteer"); // https://github.com/puppeteer/puppeteer
// const { cleanup } = require("./tools");

//
const _startPuppeteer = async () => {
  browser = await puppeteer.launch({
    slowMo: 2 * 1000, // slow down by 2s
  }); // global
  page = await browser.newPage(); // global
  // page.on("console", (msg) =>
  //   process.stderr.write(`PAGE LOG: ${msg.text()}\n`)
  // );
};

const _stopPuppeteer = async () => {
  browser.close();
  delete browser, page; // delete global to make sure we don't reuse them
};

// https://search.azlyrics.com/search.php?q=elvis+presley
const scrapeAzLyricsByArtist = async (artist = "elvis presley") => {
  const searchUrl = `https://search.azlyrics.com/search.php?q=${artist}`;
  process.stderr.write(`searchUrl: ${searchUrl}\n`);

  await _startPuppeteer();

  await page.goto(searchUrl);
  const artistUrl = await page.$eval("td a", (x) => x.href);

  await _scrapeAzLyricsByArtistUrl(artistUrl);

  await_stopPuppeteer();
};

const scrapeAzLyricsByArtistUrl = async (artistUrl) => {
  await _startPuppeteer();
  await _scrapeAzLyricsByArtistUrl(artistUrl);
  await _stopPuppeteer();
};

const _scrapeAzLyricsByArtistUrl = async (artistUrl) => {
  process.stderr.write(`artistUrl: ${artistUrl}\n`);

  await page.goto(artistUrl);
  const songUrls = await page.$$eval(".listalbum-item a", (songs) =>
    songs.map((song) => song.href)
  );
  for (const songUrl of songUrls) {
    await _scrapeAzLyricsBySongUrl(songUrl);
    // break; // XXX
  }
};

//
const scrapeAzLyricsBySongUrl = async (songUrl) => {
  await _startPuppeteer();
  await _scrapeAzLyricsBySongUrl(songUrl);
  await _stopPuppeteer();
};

const _scrapeAzLyricsBySongUrl = async (songUrl) => {
  process.stderr.write(`songUrl: ${songUrl}\n`);

  await page.goto(songUrl);
  const lines = await page.$$eval(".text-center > div", (lines) =>
    lines.map((line) => line.textContent.trim())
  );

  let lyrics = "";
  for (const line of lines) {
    if (line.length >= 150) {
      // skip the headers
      lyrics = line;
      break;
    }
  }

  if (lyrics) {
    // console.log(`Song: ${songUrl}`);
    console.log(`Lyrics: ${lyrics}\n`);
  } else {
    process.stderr.write(`Song not found\n`);
  }
};

//
module.exports = {
  scrapeAzLyricsByArtist,
  scrapeAzLyricsByArtistUrl,
  scrapeAzLyricsBySongUrl,
};
