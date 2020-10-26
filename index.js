require("dotenv").config();

const { execSync, spawn } = require("child_process");
const Discord = require("discord.js");
const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`); // Prefix messages to me with @DiscoBot
});

const gpt2 = (prompt, channel) => {
  console.log("Model prompt >>>", prompt);

  // 124M 355M 774M 1558M
  const docker = spawn(
    "docker",
    "run -i gpt-2 python src/interactive_conditional_samples.py --model_name=1558M".split(
      " "
    )
  );

  //   docker.stderr.on("data", (data) => {
  //     console.error("stderr:", data.toString());
  //   });

  docker.stdout.on("data", function (data) {
    // console.log("stdout: received from docker:", data.toString());
    for (const s of data.toString().split("\n")) {
      if (
        !s ||
        s.startsWith("=============") ||
        s.startsWith("Model prompt >>>")
      )
        continue;
      console.log(prompt + " : " + s);
      channel.send(prompt + " : " + s);
    }
  });

  //   docker.stdout.on("end", function () {
  //     console.log("stdout: docker end");
  //   });

  docker.stdin.write(prompt + "\n");
  docker.stdin.end(); // XXX do we need this or can we keep this 'open'?
};

client.on("message", (msg) => {
  //   console.log(msg);

  if (!msg.content.startsWith("<> ")) return;
  //   if (!msg.mentions.has(client.user)) return;

  const prompt = msg.content.split("> ")[1];
  gpt2(prompt, msg.channel);

  /*
  switch (msg.content) {
    case "ping":
      msg.reply("pong");
      break;

    case "hello":
      msg.reply("hello to you too " + msg.author.username);
      break;

    // case "whoami":
    //   //   console.log(JSON.stringify(msg, null, 2));
    //   msg.reply(JSON.stringify(msg, null, 2));
    //   break;

    default:
      if (msg.content.startsWith("gpt2 ")) {
        gpt2(msg.content.substr(5), msg.channel);
      }
      break;
  }
  */
});
