const fetch = require("node-fetch");
const puppeteer = require("puppeteer");

const fetchAll = async () => {
  const posts_per_page = 10000;
  const page = 0;
  const url = `https://www.theredhandfiles.com/wp-admin/admin-ajax.php?id=&post_id=0&slug=home&canonical_url=https%3A%2F%2Fwww.theredhandfiles.com%2F&posts_per_page=${posts_per_page}&page=${page}&offset=0&post_type=post&repeater=default&seo_start_page=1&preloaded=false&preloaded_amount=0&order=DESC&orderby=date&action=alm_get_posts&query_type=standard`;
  const json = await (await fetch(url)).json();
  //   console.log(json.html);

  const articleUrls = {};
  for (const line of json.html.split("\n")) {
    if (!line.includes("<a href=")) continue;
    const articleUrl = line.split('"')[1];
    if (articleUrl in articleUrls) continue;
    articleUrls[articleUrl] = true;

    console.log("SOURCE:", articleUrl);
    const text = await (await fetch(articleUrl)).text();
    console.log(text);

    // focus on text within class="Body" and also within class="BodyA"
    /*
        <p class="Body"><span lang="EN-US">Dear Pat,</span></p>
        <p class="Body"><span lang="EN-US">The letters sent to </span><em><span lang="DE">The Red Hand Files</span></em><span lang="EN-US"> are mostly beautiful, full of love and a joy to read, but I do get the odd unkind message. Generally, though, I like them and find them weirdly energising. There is nothing quite like a good death threat in the morning to get the juices flowing. They are a form of validation, really, as </span><span lang="EN-US">no one with a public platform and an opinion is doing his or her job effectively if they are not being attacked from time to time.</span></p>
        <p class="Body"><span lang="EN-US">Having said that, Pat, when you say that we are living in a </span><span dir="RTL" lang="AR-SA">‘</span><span lang="EN-US">time of cynicism and cruelty</span><span dir="RTL" lang="AR-SA">’</span><span lang="EN-US">, I am not sure I agree with you. I think we are living through a frightening and deeply uncertain time, and though there are dementing and cynical voices out there, which are being emboldened and amplified by social media — that loony engine of outrage — they do not represent the voices of the many, or the good. My experience of <em>actual people</em> in this time is overwhelmingly positive — there is a great deal of love and mutual regard and community. I think most of us understand that in order to rise above this particular moment we must pull together, and act with civility, generosity and kindness. We have a monumental task ahead of us that will require vast reserves of energy — we must rehabilitate the world — and this fellow feeling and mutual respect is essential to the process.</span></p>
        <p class="BodyA"><span lang="EN-US">Of course, there is much in our world that is in need of change, to be set to rights, and clearly humanity is complex, conflicted and full of faults, but at this moment in time, when our very existence hangs in the balance, we need to come together not just in good faith and consolation, but also in a spirit of creativity and invention. </span><span lang="EN-US">Our existence depends upon offering the best of ourselves. Negativity, cynicism and resentment will not do. </span><span dir="RTL" lang="AR-SA">‘</span><span lang="EN-US">We must love one another or die.</span><span dir="RTL" lang="AR-SA">’</span></p>
        <p class="Body"><span lang="NL">Love, Nick </span></p>
    */

    console.log("-----------------------------------");
  }
};

fetchAll();
