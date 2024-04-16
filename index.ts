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

	console.info(new Date().toLocaleString(), "Created dugnad post")
}

export async function sendMonthlyAttendanceStats() {
	const userAttendance = new Map();

	const allPosts = Object.values((await client.getPosts(dugnadChannel.id)).posts);
	const botPosts = allPosts.filter(post => post.user_id == botUser.id && post.metadata.reactions != undefined);

	// We tally up the reported attendance of each user, excluding the bot itself
	for (const post of botPosts) {
		for (const postReaction of post.metadata.reactions) {
			if (postReaction != undefined && postReaction.emoji_name == "white_check_mark" && postReaction.user_id != botUser.id) {
				const username = (await client.getUser(postReaction.user_id)).username
				if (userAttendance.has(username)){
					userAttendance.set(username, userAttendance.get(username) + 1)
				} else {
					userAttendance.set(username, 1)
				}
			}
		}
	}

	// We insert the attendance of the users into an array of tuples then sort them in descending order
	let attendanceEntries = []
	for (let entry of userAttendance.entries()) {
		attendanceEntries.push(entry)
	}
	attendanceEntries.sort((tuple1, tuple2) => {
		return (tuple2[1] - tuple1[1])
	})

	await client.createPost({
		channel_id: dugnadChannel.id,
		message: 
			"### :confusedparrot: Deltagelse på dugnader den siste måneden:\n" +
			markdownTable([["Medlem", "Dugnader"]].concat(attendanceEntries)),
	} as Post);

	console.info(new Date().toLocaleString(), "Created monthly attendance post")
}
