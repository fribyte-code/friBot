import * as cron from "node-cron";
import config from "./config";
import { sendMessageWithReactions, sendMonthlyAttendanceStats } from ".";

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
    }, {
      timezone: "Europe/Oslo"
    })
  });

  // cron: every day of the first week at 18:00
  cron.schedule("0 18 1-7 * *", () => {
    // note that this is UTC, but Europe/Oslo's 18:00 
    // is always the same weekday as corresponding UTC ts
    const currentWeekDay = new Date().getDay();
    if (currentWeekDay !== 2) // not tuesday
      return;

    sendMonthlyAttendanceStats();
  }, {
    timezone: "Europe/Oslo"
  })

  console.info(new Date().toLocaleString(), "Cron tasks created");
}
