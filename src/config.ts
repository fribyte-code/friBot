export default {
	get isProd() { return process.env.NODE_ENV === "production"; },
	mattermost: {
		clientURL: "https://chat.fribyte.no",
		teamName: "friByte",
		get token() {
			const token = process.env.TOKEN;
			if (token === undefined)
				throw Error("Bot token is undefined, did you forget to add TOKEN env variable?");
			return token;
		},
	},
	dugnad: {
		get channelName() { return process.env.NODE_ENV === "production" ? "dugnad" : "bot-test"; },
		daysToMessage: [1, 3], // Monday and Wednesday
		timeOfDayToMessage: 17, // 5pm
		messages: [
			"Dugnad i morgen friBytere? :60fpsparrot:\n// Dugnad tomorrow friByters?",
			"Dugnad i morgen mennesker og roboter?\n// Dugnad tomorrow humans and robots?",
			"I morgen er det dugnad! Kommer du?\n// Tomorrow is time for dugnad! Are you coming?",
			"Dugnad i morra, be there or be square\n// Dugnad tomorrow, be there or be square",
		],
	}
};
