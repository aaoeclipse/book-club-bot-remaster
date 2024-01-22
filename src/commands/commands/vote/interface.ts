import { ChatInputCommandInteraction } from "discord.js";
import { getCurrElection } from "../elections/infrastructure";
import { getBookOnElection } from "../books/infrastructure";
import {
  getVoteFromUserToBook,
  newUserVote,
  removeVote,
} from "./infrastructure";
import { getCurrUser } from "../user";

export const voteForBook = async (interaction: ChatInputCommandInteraction) => {
  const bookid = interaction.options.getInteger("book_id");
  if (!bookid) {
    interaction.reply("Sorry no book with that id!");
    return;
  }

  // Check if there is an election on progress
  const currElection = await getCurrElection();

  if (!currElection) {
    interaction.reply(
      "No current elections in progress, create an election to add books to it"
    );
    return;
  }

  // Check if book exist
  const book = await getBookOnElection(currElection.id, bookid);

  if (!book) {
    interaction.reply("Sorry no book with that id!");
    return;
  }

  // Get User
  const userid = await getCurrUser(interaction.user.username);

  // Check if vote
  const voteexist = await getVoteFromUserToBook(
    userid,
    bookid,
    currElection.id
  );

  if (voteexist) {
    // removeVote
    const remd_book = await removeVote(voteexist.id);
    if (remd_book) {
      interaction.reply("Vote removed!");
    } else {
      interaction.reply("couln't remove your vote, sending @aaoeclipse a mssg");
    }
  } else {
    // Add vote from user/book to that election
    const userVote = await newUserVote(userid, bookid, currElection.id);
    if (userVote) {
      interaction.reply(`Your vote was added to ${book.bookid}`);
    } else {
      interaction.reply("couldn't add your vote, sending @aaoeclipse a mssg");
    }
  }
};

export const getAllVotes = async () => {};
