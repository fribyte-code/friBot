import { Client4 } from "@mattermost/client";
import * as cron from "node-cron";

//Read config file
const configPath = "./config.json";
const configFile = Bun.file(configPath);

const config = await configFile.json();
console.log(config);

//Read access token
const accessTokenPath = "./.token";
const accessTokenFile = Bun.file(accessTokenPath);

const token = (await accessTokenFile.text()).trim();

const client = new Client4();
client.setUrl(config["url"]);

client.setToken(token);

const team = await client.getTeamByName("friByte");

const dugnadChannel = await client.getChannelByName(team.id, "dugnad");

console.log(dugnadChannel);

//Initial setup LOL

function sendDugnadMessage() {
  let messages = config["messages"] as string[];
  let message = messages[Math.floor(Math.random() * messages.length)];

  client.createPost({
    channel_id: dugnadChannel.id,
    message: message,
  });
}
console.log(createCronScheduleFromConfig());
function createCronScheduleFromConfig() {
  let initial = "0 0";
  initial += " " + config["timeOfDayToMessage"].toString();
  initial += " * *";
  initial +=
    " " +
    config["daysToMessage"].reduce(
      (acc: string, x: Number) => acc + "," + x.toString()
    );
  return initial;
}

let task = cron.schedule(createCronScheduleFromConfig(), () => {
  sendDugnadMessage();
});
sendDugnadMessage();
sendDugnadMessage();
task.start();
