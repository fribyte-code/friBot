import * as cron from "node-cron";
import config from "./config";
import { sendMessageWithReactions } from ".";

type happening = {
  daysToMessage: number[];
  timeOfDayToMessage: number;
  messages: string[]
}

/**
 * @returns cron like: `0 17 * * 0,2`
 */
function createCronScheduleFromHappeningConfig(happening:happening) {
  return `0 ${happening.timeOfDayToMessage} * * ${happening.daysToMessage.join(",")}`;
}

const dugnadCronTask = cron.schedule(createCronScheduleFromHappeningConfig(config.happenings.dugnad), () => {
  sendMessageWithReactions(config.happenings.dugnad.messages);
});

dugnadCronTask.start();
