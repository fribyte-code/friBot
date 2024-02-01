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
function createCronScheduleFromHappening(happening:happening) {
  return `0 ${happening.timeOfDayToMessage} * * ${happening.daysToMessage.join(",")}`;
}

export function startCronTasks() {
  config.happenings.forEach((happening:happening) => {
    cron.schedule(createCronScheduleFromHappening(happening), () => {
      sendMessageWithReactions(happening.messages);
    })
  });
  console.info("Cron tasks started")
}
