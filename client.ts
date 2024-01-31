import { Client4 } from "@mattermost/client";
import config from "./config";

export function initMattermostClient() {
  const client = new Client4();
  
  client.setUrl(config.clientURL);
  
  const token = process.env.TOKEN;
  if (typeof token  === "undefined") {
    console.log("api token is undefined, did you forget to add TOKEN env variable? Check docs")
  } else {
    client.setToken(token);
  }

  return client;
}