const fetch = require("node-fetch");
const puppeteer = require("puppeteer"); // https://github.com/puppeteer/puppeteer
const { cleanup } = require("./tools");

//
const scrapeTheRedHandFiles = async (verbose = false) => {
  const posts_per_page = 10000;
  const page = 0;
  const url = `https://www.theredhandfiles.com/wp-admin/admin-ajax.php?id=&post_id=0&slug=home&canonical_url=https%3A%2F%2Fwww.theredhandfiles.com%2F&posts_per_page=${posts_per_page}&page=${page}&offset=0&post_type=post&repeater=default&seo_start_page=1&preloaded=false&preloaded_amount=0&order=DESC&orderby=date&action=alm_get_posts&query_type=standard`;
  const json = await (await fetch(url)).json();
  //   console.log(json.html);

  const browser = await puppeteer.launch();

  const articleUrls = {};
  for (const line of json.html.split("\n")) {
    if (!line.includes("<a href=")) continue;
    const articleUrl = line.split('"')[1];
    if (articleUrl in articleUrls) continue;
    articleUrls[articleUrl] = true;
    // console.log("SOURCE:", articleUrl);

    const page = await browser.newPage();
    await page.goto(articleUrl);

    const postTitle = await page.$eval("h1", (x) => x.textContent.trim());

    const articleArray = await page.$$eval(".article p", (x) =>
      x.map((p) => p.textContent.trim())
    );
    const filteredArticleArray = articleArray.filter(
      (p) => p.length && p !== "Ask a Question"
    );
    if (filteredArticleArray[1].startsWith("Dear"))
      filteredArticleArray.shift(); // skip leading quotes, copyright messages, etc..
    filteredArticleArray.shift(); // skip 'Dear, XXX'
    filteredArticleArray.pop(); // skip 'Love, Nick'

    if (postTitle && filteredArticleArray.length) {
      console.log((verbose ? "Q: " : "") + cleanup(postTitle));
      console.log(
        (verbose ? "A: " : "") + cleanup(filteredArticleArray.join(" "))
      );
      verbose && console.log("");
    }
  }

  await browser.close();
}; // end of scrapeTheRedHandFiles(verbose)

//
module.exports = { scrapeTheRedHandFiles };
