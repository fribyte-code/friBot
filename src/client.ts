import { Client4 } from "@mattermost/client";

import config from "./config";

export function createMattermostClient() {
	const client = new Client4();
	client.setUrl(config.mattermost.clientURL);

	const token = config.mattermost.token;
	client.setToken(token);

	console.info(new Date().toLocaleString(), "Mattermost client created");
	
	return client;
}