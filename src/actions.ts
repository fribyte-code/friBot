import type { Client4 } from "@mattermost/client";
import type { Post } from "@mattermost/types/posts";
import { markdownTable } from "markdown-table";

import config, { GeneralMessageConfig } from "./config";

export async function sendDugnadAttendanceStats(client: Client4) {
  const team = await client.getTeamByName(config.mattermost.teamName);
  const dugnadChannelName = config.dugnadAttendanceBotChannelName;
  const dugnadChannel = await client.getChannelByName(
    team.id,
    dugnadChannelName
  );
  const botUser = await client.getUserByUsername("fribot");

  const monthlyUserAttendance = new Map();

  let lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 31);

  // We tally up the reported attendance of each user, excluding the bot itself
  const postsPastMonth = Object.values(
    (await client.getPostsSince(dugnadChannel.id, lastMonth.getTime())).posts
  );
  const botPostsPastMonth = postsPastMonth.filter(
    (post) => post.user_id == botUser.id && post.metadata.reactions != undefined
  );

  for (const post of botPostsPastMonth) {
    for (const postReaction of post.metadata.reactions) {
      if (
        postReaction != undefined &&
        postReaction.emoji_name == "white_check_mark" &&
        postReaction.user_id != botUser.id
      ) {
        const username = (await client.getUser(postReaction.user_id)).username;
        if (monthlyUserAttendance.has(username)) {
          monthlyUserAttendance.set(
            username,
            monthlyUserAttendance.get(username) + 1
          );
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

  const postsPastYear = Object.values(
    (await client.getPostsSince(dugnadChannel.id, yearStartDay.getTime())).posts
  );
  const botPostsPastYear = postsPastYear.filter(
    (post) => post.user_id == botUser.id && post.metadata.reactions != undefined
  );

  for (const post of botPostsPastYear) {
    for (const postReaction of post.metadata.reactions) {
      if (
        postReaction != undefined &&
        postReaction.emoji_name == "white_check_mark" &&
        postReaction.user_id != botUser.id
      ) {
        const username = (await client.getUser(postReaction.user_id)).username;
        if (yearlyUserAttendance.has(username)) {
          yearlyUserAttendance.set(
            username,
            yearlyUserAttendance.get(username) + 1
          );
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
    return tuple2[1] - tuple1[1];
  });

  await client.createPost({
    channel_id: dugnadChannel.id,
    message:
      "#### :confusedparrot: Statistikk for deltakelse på dugnad :confusedparrot:\n" +
      "#### // Statistics for attendance at dugnad \n" +
      markdownTable(
        [["Username", "In " + currentYear.toString(), "Past month"]].concat(
          attendanceEntries
        )
      ),
  } as Post);

  console.info(
    new Date().toLocaleString(),
    `Created monthly attendance post in ${dugnadChannelName} channel`
  );
}

export async function sendGeneralMessage(
  client: Client4,
  messageConfig: GeneralMessageConfig
) {
  const team = await client.getTeamByName(config.mattermost.teamName);
  const channel = await client.getChannelByName(
    team.id,
    messageConfig.channelName
  );
  const message =
    messageConfig.messages[
      Math.floor(Math.random() * messageConfig.messages.length)
    ];

  const post = await client.createPost({
    channel_id: channel.id,
    message: message,
  } as Post);

  messageConfig.reactions?.forEach((reaction) => {
    client.addReaction(post.user_id, post.id, reaction);
  });

  console.info(
    new Date().toLocaleString(),
    `Created ${messageConfig.botMessageName} post in ${messageConfig.channelName} channel`
  );
}
