import * as cron from "node-cron";
import config from "./config";
import { Client4 } from "@mattermost/client";

//Read access token
const accessTokenPath = "./.token";
const accessTokenFile = Bun.file(accessTokenPath);

const token = (await accessTokenFile.text()).trim();

const client = new Client4();
client.setUrl(config.url);

client.setToken(token);

const team = await client.getTeamByName("friByte");

const dugnadChannel = await client.getChannelByName(team.id, "dugnad");

console.log(dugnadChannel);

function sendDugnadMessage() {
  const messages = config.messages;
  const message = messages[Math.floor(Math.random() * messages.length)];

  client.createPost({
    channel_id: dugnadChannel.id,
    message: message,
  });
}
console.log(createCronScheduleFromConfig());

/**
 * @returns cron like: `0 17 * * 0,2`
 */
function createCronScheduleFromConfig() {
  return `0 ${config.timeOfDayToMessage} * * ${config.daysToMessage.join(",")}`;
}

const task = cron.schedule(createCronScheduleFromConfig(), () => {
  sendDugnadMessage();
});

task.start();
