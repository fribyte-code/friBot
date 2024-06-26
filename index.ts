import { Post } from "@mattermost/types/posts";
import { markdownTable } from "markdown-table";

import { createMattermostClient } from "./client";
import { startCronTasks } from "./cron";

if (!process.env.DEV) startCronTasks();

const client = createMattermostClient();
const team = await client.getTeamByName("friByte");
const botUser = await client.getUserByUsername("fribot");
const dugnadChannel = await client.getChannelByName(team.id, process.env.DEV ? "bot-test" : "dugnad");

export async function sendMessageWithReactions(possibleMessages:string[]) {
	const message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
	const post = await client.createPost({
		channel_id: dugnadChannel.id,
		message: message,
	} as Post);

	client.addReaction(post.user_id, post.id, "white_check_mark");
	client.addReaction(post.user_id, post.id, "x");

	console.info(new Date().toLocaleString(), "Created dugnad post");
}

export async function sendMonthlyAttendanceStats() {
	const monthlyUserAttendance = new Map();

	let lastMonth = new Date();
	lastMonth.setDate(lastMonth.getDate() - 31);

	// We tally up the reported attendance of each user, excluding the bot itself
	const postsPastMonth = Object.values((await client.getPostsSince(dugnadChannel.id, lastMonth.getTime())).posts);
	const botPostsPastMonth = postsPastMonth.filter(post => post.user_id == botUser.id && post.metadata.reactions != undefined);

	for (const post of botPostsPastMonth) {
		for (const postReaction of post.metadata.reactions) {
			if (postReaction != undefined && postReaction.emoji_name == "white_check_mark" && postReaction.user_id != botUser.id) {
				const username = (await client.getUser(postReaction.user_id)).username;
				if (monthlyUserAttendance.has(username)) {
					monthlyUserAttendance.set(username, monthlyUserAttendance.get(username) + 1);
				} else {
					monthlyUserAttendance.set(username, 1);
				}
			}
		}
	}

	const yearlyUserAttendance = new Map();

	const currentYear = new Date().getFullYear();
	let yearStartDay = new Date();
	yearStartDay.setTime(0);
	yearStartDay.setFullYear(currentYear);

	const postsPastYear = Object.values((await client.getPostsSince(dugnadChannel.id, yearStartDay.getTime())).posts);
	const botPostsPastYear = postsPastYear.filter(post => post.user_id == botUser.id && post.metadata.reactions != undefined);

	for (const post of botPostsPastYear) {
		for (const postReaction of post.metadata.reactions) {
			if (postReaction != undefined && postReaction.emoji_name == "white_check_mark" && postReaction.user_id != botUser.id) {
				const username = (await client.getUser(postReaction.user_id)).username;
				if (yearlyUserAttendance.has(username)) {
					yearlyUserAttendance.set(username, yearlyUserAttendance.get(username) + 1);
				} else {
					yearlyUserAttendance.set(username, 1);
				}
			}
		}
	}

	// We insert the attendance of the users into an array of tuples then sort them in descending order
	let attendanceEntries = [];
	for (let entry of yearlyUserAttendance.entries()) {
		let username = entry[0];

		entry.push(monthlyUserAttendance.get(username) ?? 0);
		attendanceEntries.push(entry);
	}
	attendanceEntries.sort((tuple1, tuple2) => {
		return (tuple2[1] - tuple1[1]);
	})

	await client.createPost({
		channel_id: dugnadChannel.id,
		message: 
			"### :confusedparrot: Statistikk for deltakelse på dugnad :confusedparrot:\n" +
			markdownTable([["Medlem", "Siste år", "Siste måned"]].concat(attendanceEntries)),
	} as Post);

	console.info(new Date().toLocaleString(), "Created monthly attendance post");
}
