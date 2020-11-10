const puppeteer = require("puppeteer"); // https://github.com/puppeteer/puppeteer
// const { cleanup } = require("./tools");

// https://search.azlyrics.com/search.php?q=elvis+presley
const scrapeAzLyricsByArtist = async (artist = "elvis presley") => {
  const searchUrl = `https://search.azlyrics.com/search.php?q=${artist}`;
  process.stderr.write(`searchUrl: ${searchUrl}\n`);

  browser = await puppeteer.launch({
    slowMo: 1 * 1000, // slow down by 1s
  }); // global
  page = await browser.newPage(); // global
  // page.on("console", (msg) =>
  //   process.stderr.write(`PAGE LOG: ${msg.text()}\n`)
  // );

  await page.goto(searchUrl);
  const artistUrl = await page.$eval("td a", (x) => x.href);
  await scrapeAzLyricsByArtistUrl(artistUrl);

  browser.close();
};

const scrapeAzLyricsByArtistUrl = async (artistUrl) => {
  process.stderr.write(`artistUrl: ${artistUrl}\n`);

  await page.goto(artistUrl);
  const songUrls = await page.$$eval(".listalbum-item a", (songs) =>
    songs.map((song) => song.href)
  );
  for (const songUrl of songUrls) {
    await scrapeAzLyricsBySongUrl(songUrl);
    // break; // XXX
  }
};

//
const scrapeAzLyricsBySongUrl = async (songUrl) => {
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
