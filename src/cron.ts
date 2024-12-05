import type { Client4 } from "@mattermost/client";
import * as cron from "node-cron";

import * as botActions from "./actions";
import config from "./config";

export function startCronTasks(client:Client4) {
	// Weekly dugnad invitations
	// cron: At timeOfDay on all daysToMessage every week, not in july
	cron.schedule(`0 ${config.dugnad.timeOfDayToMessage} * 1-6,8-12 ${config.dugnad.daysToMessage.join(",")}`, () => {
   		botActions.sendSocialInvite(client);
	}, {
		timezone: "Europe/Oslo"
	});

	// Monthly attendace statistics
	// cron: every day of the first week at 18:00, not in july
	cron.schedule("0 18 1-7 1-6,8-12 *", () => {
    	// note that this is UTC, but Europe/Oslo's 18:00 
		// is always the same weekday as corresponding UTC ts
		const currentWeekDay = new Date().getDay();
		if (currentWeekDay !== 2) // not tuesday
			return;
		botActions.sendDugnadAttendanceStats(client);
	}, {
    	timezone: "Europe/Oslo"
	});
	
	// Weekly social invitation
	// cron: At timeOfDay on all daysToMessage every week, not in july
	cron.schedule(`0 ${config.social.timeOfDayToMessage} * 1-6,8-12 ${config.social.daysToMessage.join(",")}`, () => {
		botActions.sendSocialInvite(client);
	}, {
    	timezone: "Europe/Oslo"
	});

	console.info(new Date().toLocaleString(), "Cron tasks created");
}
