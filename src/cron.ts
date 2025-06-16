import type { Client4 } from "@mattermost/client";
import * as cron from "node-cron";

import * as botActions from "./actions";
import config from "./config";

export function startCronTasks(client: Client4) {
  // Monthly attendance statistics
  // cron: every day of the first week at 18:00, not in june or july because vacation
  cron.schedule(
    "0 18 1-7 1-5,8-12 *",
    () => {
      // note that this is UTC, but Europe/Oslo's 18:00
      // is always the same weekday as corresponding UTC ts
      const currentWeekDay = new Date().getDay();
      if (currentWeekDay !== 2)
        // not tuesday
        return;
      botActions.sendDugnadAttendanceStats(client);
    },
    {
      timezone: "Europe/Oslo",
    }
  );

  // Schedule all generalMessage cronjobs listed in config
  for (const message of config.generalMessages) {
    if (
      !message.cronSentence &&
      (!message.daysToMessage || !message.timeOfDayToMessage)
    ) {
      console.error(
        "Invalid general message config, must have either cronSentence or both daysToMessage and timeOfDayToMessage"
      );
      throw new Error("Invalid general message config");
    }
    cron.schedule(
      message.cronSentence ??
        `0 ${
          message.timeOfDayToMessage
        } * 1-6,8-12 ${message.daysToMessage?.join(",")}`,
      () => {
        botActions.sendGeneralMessage(client, message);
      }
    );

    console.info(new Date().toLocaleString(), "Cron tasks created");
  }
}
