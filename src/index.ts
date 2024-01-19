import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import getTokens from "./utils/token";
import { addUser } from "./commands/commands/user";
import {
  addBook,
  addBookToElection,
  getBookDetailView,
  listBooks,
  removeBook,
  updateBook,
} from "./commands/commands/books";
import { voteForBook } from "./commands/commands/vote/index";
import {
  finishElections,
  makeElections,
} from "./commands/commands/elections/index";
import {
  checkProgress,
  currProgress,
  nextChapter,
  updateProgress,
} from "./commands/commands/progress/interface";
import { getCurrentReadingBook } from "./commands/commands/activeBook/interface";
import { createNewCategory } from "./commands/commands/channel/interface";

const { TOKEN, CLIENT_ID } = getTokens();

const run_command = {
  addUser: addUser,
  add_book: addBook,
  remove_book: removeBook,
  list_books: listBooks,
  vote_book: voteForBook,
  create_election: makeElections,
  finish_elections: finishElections,
  next_chapter: nextChapter,
  updateChapter: updateProgress,
  checkProgress: checkProgress,
  add_book_to_election: addBookToElection,
  update_book: updateBook,
  book_info: getBookDetailView,
  show_current_book: getCurrentReadingBook,
  curr_progress: currProgress,
  set_book_progress: updateProgress,
};
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName in run_command) {
    // @ts-ignore
    run_command[interaction.commandName](interaction);
  }
});

client.login(TOKEN);
