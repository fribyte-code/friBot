import { initMattermostClient } from "./client";
import { startCronTasks } from "./cron";

const client = initMattermostClient();
console.info("The bot is running")
const team = await client.getTeamByName("friByte");

const dugnadChannel = await client.getChannelByName(
  team.id,
  process.env.DEV ? "bot-test" : "dugnad"
);

export async function sendMessageWithReactions(possibleMessages:string[]) {
  const message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
  let post = await client.createPost({
    channel_id: dugnadChannel.id,
    message: message,
  } as any);

  client.addReaction(post.user_id, post.id, "white_check_mark");
  client.addReaction(post.user_id, post.id, "x");
}

startCronTasks();