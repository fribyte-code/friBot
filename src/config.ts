export default {
	clientURL: "https://chat.fribyte.no",
	get channelName() {
		return process.env.NODE_ENV === "production" ? "dugnad" : "bot-test";
	},
	get isProd() {
		return process.env.NODE_ENV === "production";
	},
	get token() {
		return process.env.TOKEN ?? throw new Exception("Token is not defined in environment. Add 'TOKEN=<YOUR TOKEN>' to the file '.env' in root folder.");
	}
	dugnad: {
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
