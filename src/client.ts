import { Client4 } from "@mattermost/client";

import config from "./config";

export function createMattermostClient() {
  const client = new Client4();
  client.setUrl(config.mattermost.clientURL);
  client.setToken(config.mattermost.token);

  console.info(new Date().toLocaleString(), "Mattermost client created");

  return client;
}
