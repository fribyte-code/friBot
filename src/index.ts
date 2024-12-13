import { createMattermostClient } from "./client";
import config from "./config";
import { startCronTasks } from "./cron";

const client = createMattermostClient();

if (config.isProd) {
  startCronTasks(client);
} else {
  //? Debug code goes here
  console.debug("Debug mode, will not start cron tasks");
}
