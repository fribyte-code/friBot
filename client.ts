import { Client4 } from "@mattermost/client";
import config from "./config";

export function createMattermostClient() {
  const client = new Client4();
  
  client.setUrl(config.clientURL);
  
  const token = process.env.TOKEN;
  if (typeof token  === "undefined") {
    throw Error("API bot token is undefined, did you forget to add TOKEN env variable?")
  } else {
    client.setToken(token);
  }

	console.info(new Date().toLocaleString(), "Mattermost client created")

  return client;
}