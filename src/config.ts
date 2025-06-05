/**
 * List of simple messages that does not require custom functions etc.
 */
const generalMessages: GeneralMessageConfig[] = [
  {
    botMessageName: "dugnad",
    get channelName() {
      return process.env.NODE_ENV === "production" ? "dugnad" : "bot-test";
    },
    daysToMessage: [1, 3], // Monday and Wednesday
    timeOfDayToMessage: 17, // 5pm
    messages: [
      "Dugnad i morgen friBytere? :60fpsparrot:\n// Dugnad tomorrow friByters?",
      "Dugnad i morgen mennesker og roboter?\n// Dugnad tomorrow humans and robots?",
      "I morgen er det dugnad! Kommer du?\n// Tomorrow is time for dugnad! Are you coming?",
      "Dugnad i morra, be there or be square\n// Dugnad tomorrow, be there or be square",
      "It's finally time to summon the friByters for duuugnaaad tomorrooooowww! :60psparrot:",
      "Leeeets get ready to ruuuuuumble! Dugnad i morgen! :60fpsparrot:",
      "Anotha day anotha dugnad tomorrow! :60fpsparrot:",
    ],
    reactions: ["white_check_mark", "x"],
  },
  {
    botMessageName: "social",
    get channelName() {
      return process.env.NODE_ENV === "production" ? "social" : "bot-test";
    },
    daysToMessage: [4], // Thursdays
    timeOfDayToMessage: 20, // 8pm
    messages: [
      "Hallisiken kedegis? Hypp på noe sosialt eller?? Reager med hva  du  ønsker\n// Helloski do  something social or? React with what you want\n :video_game: :spiral_note_pad: :beers:",
    ],
    reactions: ["video_game", "spiral_note_pad", "beers"],
  },
  // DrunkBot go home you have asked to many times now without any response
  // {
  //   botMessageName: "drunkBot",
  //   get channelName() {
  //     return process.env.NODE_ENV === "production" ? "social" : "bot-test";
  //   },
  //   daysToMessage: [6], // Saturdays
  //   timeOfDayToMessage: 2, // 2am
  //   messages: ["Hvor er fu? :beers:"],
  // },
  // {
  //   botMessageName: "drunkBot",
  //   get channelName() {
  //     return process.env.NODE_ENV === "production" ? "social" : "bot-test";
  //   },
  //   daysToMessage: [6], // Saturdays
  //   timeOfDayToMessage: 4, // 2am
  //   messages: [
  //     "Hvor er fu? :beers:",
  //     "Noen uuuuute? :stuck_out_tongue_winking_eye:",
  //     "KEEEEEDEEGIIIIIISS?!?!? :pedrodance: :heart:",
  //     "Shit! Serverparken brenner! :fire:",
  //     "Can I pull the cable labeled 'DO NOT REMOVE' in the server room?",
  //   ],
  // },
];

export default {
  get isProd() {
    return process.env.NODE_ENV === "production";
  },
  mattermost: {
    clientURL: "https://chat.fribyte.no",
    teamName: "friByte",
    get token() {
      const token = process.env.TOKEN;
      if (token === undefined)
        throw Error(
          "Bot token is undefined, did you forget to add TOKEN env variable?"
        );
      return token;
    },
  },
  get dugnadAttendanceBotChannelName() {
    return process.env.NODE_ENV === "production" ? "dugnad" : "bot-test";
  },
  /**
   * Represents a list of simple messages that the bot will iterate over and send
   */
  generalMessages,
};

export interface GeneralMessageConfig {
  /**
   * The name of the bot that will send the message.
   * Used in the logs to identify the message
   */
  botMessageName: string;
  /**
   * What channel to send the message in
   */
  channelName: string;
  /**
   * What days of week to send the message
   * 0 is Sunday, 1 is Monday, ..., 6 is Saturday
   * See Cron expressions for more info
   * Must be defined if `cronSentence` is not
   */
  daysToMessage?: number[];
  /**
   * What hour of the day to send the message
   * Must be defined if `cronSentence` is not
   */
  timeOfDayToMessage?: number;
  /**
   * A cron expression that defines when to send the message
   * If this is set, `daysToMessage` and `timeOfDayToMessage` will be ignored
   */
  cronSentence?: string;
  /**
   * The bot will chose one of these messages at random
   */
  messages: string[];
  /**
   * Represents a list of reactions that the bot will add to the message
   */
  reactions?: string[];
}
