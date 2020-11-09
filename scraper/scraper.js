const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const scrapeTheRedHandFiles = require("./theredhandfiles");
const scrapeAzLyrics = require("./azlyrics");

switch (process.argv[2]) {
  case "theredhandfiles":
    scrapeTheRedHandFiles(true);
    break;

  default:
    scrapeAzLyrics(process.argv[2], true);
    break;
}
