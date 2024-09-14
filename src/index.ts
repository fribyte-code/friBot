import { createMattermostClient } from "./client";
import { startCronTasks } from "./cron";

const client = createMattermostClient();

if (process.env.NODE_ENV === "production") startCronTasks(client);

console.log(process.env.NODE_ENV)