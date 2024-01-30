import * as cron from "node-cron";
import config from "./config";
import { Client4 } from "@mattermost/client";

const token = process.env.TOKEN as string;

const client = new Client4();
client.setUrl(config.url);

client.setToken(token);

const team = await client.getTeamByName("friByte");

const dugnadChannel = await client.getChannelByName(
  team.id,
  process.env.DEV ? "bot-test" : "dugnad"
);

console.log(dugnadChannel);

async function sendDugnadMessage() {
  const messages = config.messages;
  const message = messages[Math.floor(Math.random() * messages.length)];

  let post = await client.createPost({
    channel_id: dugnadChannel.id,
    message: message,
  });

  client.addReaction(post.user_id, post.id, "white_check_mark");
  client.addReaction(post.user_id, post.id, "x");
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
sendDugnadMessage();
task.start();
