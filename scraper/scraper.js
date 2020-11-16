const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { scrapeTheRedHandFiles } = require("./theredhandfiles");
const {
  scrapeAzLyricsByArtist,
  scrapeAzLyricsByArtistUrl,
  scrapeAzLyricsBySongUrl,
} = require("./azlyrics");

const cmd = process.argv[2];
if (cmd === "theredhandfiles") {
  scrapeTheRedHandFiles(true);
} else if (cmd.startsWith("https://")) {
  if (cmd.includes("/lyrics")) scrapeAzLyricsBySongUrl(cmd);
  else scrapeAzLyricsByArtistUrl(cmd);
} else {
  scrapeAzLyricsByArtist(cmd);
}
