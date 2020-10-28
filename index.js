require("dotenv").config();

const { execSync, spawn } = require("child_process");
const Discord = require("discord.js");
const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`); // Prefix messages to me with @DiscoBot
});

//
const gpt2 = (prompt, channel) => {
  channel.send("Starting gpt2 engine...");

  // 124M 345M (774M 1558M)
  const process = spawn(
    "docker",
    "run -i gpt-2 python src/interactive_conditional_samples.py --model_name=345M".split(
      " "
    )
  );

  // process.stderr.on("data", (data) => {
  //   console.error("stderr:", data.toString());
  // });

  process.stdout.on("data", function (data) {
    // console.log("stdout: received from process:", data.toString());
    for (const s of data.toString().split("\n")) {
      if (!s || !s.trim() || s.startsWith("=============")) {
        continue;
      }
      if (s.startsWith("Model prompt >>>")) {
        channel.send("Model prompt >>> " + prompt);
        continue;
      }
      console.log(prompt + " : " + s);
      channel.send(prompt + " : " + s);
    }
  });

  // process.stdout.on("end", function () {
  //   console.log("stdout: process end");
  // });

  process.stdin.write(prompt + "\n");
  process.stdin.end(); // XXX do we need this or can we keep this 'open'?
};

//
const covidStatistics = (channel) => {
  channel.send("Getting CovidStatistics");

  const process = spawn(
    "java",
    "-jar ../CovidStatistieken/CovidStatistieken.jar".split(" ")
  );

  // process.stderr.on("data", (data) => {
  //   console.error("stderr:", data.toString());
  // });

  process.stdout.on("data", function (data) {
    const s = data.toString();
    // console.log(s);
    s && s.trim() && channel.send(s);
  });

  // process.stdout.on("end", function () {
  //   console.log("stdout: process end");
  // });

  // process.stdin.write(prompt + "\n");
  // process.stdin.end(); // XXX do we need this or can we keep this 'open'?
};

//
client.on("message", (msg) => {
  //   console.log(msg);

  if (msg.content.startsWith("/covid")) {
    const content = msg.content.substr(6).trim();
    covidStatistics(msg.channel);
  }

  if (msg.content.startsWith("/gpt2")) {
    const content = msg.content.substr(5).trim();
    gpt2(content, msg.channel);
  }
});

// the end
