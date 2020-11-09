const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { scrapeTheRedHandFiles } = require("./theredhandfiles");
const { scrapeAzLyricsByArtist } = require("./azlyrics");

switch (process.argv[2]) {
  case "theredhandfiles":
    scrapeTheRedHandFiles(true);
    break;

  default:
    scrapeAzLyricsByArtist(process.argv[2]);
    break;
}
