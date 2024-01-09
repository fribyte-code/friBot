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
  client.createPost({
    channel_id: dugnadChannel.id,
    message: config["messages"][0],
  });
}

let task = cron.schedule("0 0 17 * * 0,2", () => {
  sendDugnadMessage();
});

task.start();
