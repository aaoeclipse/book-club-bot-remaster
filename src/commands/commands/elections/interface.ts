import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getCurrUser } from "../user";
import {
  ActiveBookDb,
  closeElectionDb,
  createElection,
  getAllBooksFromElectionDb,
  getCurrElection,
} from "./infrastructure";
import { createNewCategory } from "../channel/interface";

export const makeElections = async (
  interaction: ChatInputCommandInteraction
) => {
  // Check if user exists
  const user = await getCurrUser(interaction.user.username);

  // Check if there is an election already running
  const electionRunning = await getCurrElection();
  if (electionRunning) {
    interaction.reply(
      "There is already an election in progress. Finish that election first"
    );
    return;
  }

  // Make Elections
  const election = await createElection(user);

  console.log(
    "🚀 ~ file: interface.ts:11 ~ makeElections ~ election:",
    election
  );

  if (election === null) {
    interaction.reply("Error creating the election!");
    return;
  }

  interaction.reply({
    content: `Election Created! ${election.id} ~ ${election.startedBy}`,
    ephemeral: false,
  });
};

export const finishElections = async (
  interaction: ChatInputCommandInteraction
) => {
  const election = await currElection();
  console.log(
    "🚀 ~ file: interface.ts:31 ~ finishElections ~ election:",
    election
  );

  if (!election) {
    interaction.reply("no election is open");
    return;
  }

  // Find Winner
  const books = await getAllBooksFromElectionDb(election.id);
  console.log("🚀 ~ file: interface.ts:40 ~ finishElections ~ books:", books);
  const maxVoteBook = books.reduce(
    (max, book) => (book.votes > max.votes ? book : max),
    books[0]
  );
  console.log(
    "🚀 ~ file: interface.ts:42 ~ finishElections ~ maxVoteBook:",
    maxVoteBook
  );

  // If there is nothing on maxVoteBook means the election was empty, therefore add books and votes to the election
  if (!maxVoteBook) {
    interaction.reply(
      "no books on election, you have to add books to the election and vote for them"
    );
    return;
  }

  // add winner to the db
  const activeBook = await ActiveBookDb(maxVoteBook.book.id, election.id);
  console.log(
    "🚀 ~ file: interface.ts:46 ~ finishElections ~ activeBook:",
    activeBook
  );

  if (!activeBook) {
    interaction.reply("Error couldnt add new active book, contact @aaoeclipse");
    return;
  }

  const embedBuiler = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`Book Winner of the Election: ${election.id}`)
    .setAuthor({ name: "Book Bot" })
    .setThumbnail(
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    )
    .setDescription(
      `The winner of the elections with ${maxVoteBook.votes} votes!`
    )
    .addFields({
      name: `${maxVoteBook.book.title}`,
      value: `${maxVoteBook.book.author}`,
    })
    .setFooter({ text: `Election #${election.id}` });

  // Close election
  const closedElection = closeElectionDb(election.id);
  if (!closedElection) {
    interaction.reply("Error couldn't close election, contact @aaoeclipse");
    return;
  }

  await createNewCategory(interaction);

  interaction.reply({ embeds: [embedBuiler] });
};

export const currElection = () => {
  return getCurrElection();
};

export const getBooksOnElection = async () => {
  const currElection = await getCurrElection();
  if (!currElection) return;

  return getAllBooksFromElectionDb(currElection.id);
};
