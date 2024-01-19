import { ChatInputCommandInteraction } from "discord.js";
import { getCurrUser } from "../user";
import { getOnlyCurrentReadingBook } from "../activeBook/interface";
import {
  checkUserProgressOnBookDb,
  createProgressOnUserAndBookDb,
  getMaxProgressOnBookDb,
  progressUserOnBoookDb,
} from "./infrastructure";
import { handleUserChangeInChapter, removeRoles } from "../channel/interface";

/**
 * Some things to consider. When progress, the application must know
 * whether or not to add a new channel or just add permission to the
 * user. :S
 * There are two ways of doing this:
 * 1. Before any progress, check the max of that book and create channels of the diff.
 * 2. Create new table in the db
 *
 * for now I'm going to go with the first option.
 */

// TODO:  Ahhhh damn i forgot what if someone mess up and wants to delete?!

/**
 * Gets the progress of the user on that book
 * @param user_id userid
 * @param book_id bookid
 * @returns Progress
 */
export const checkProgress = async (user_id: number, book_id: number) => {
  const currProgress = await checkUserProgressOnBookDb(user_id, book_id);
  return currProgress;
};

/**
 *
 * @param interaction
 * @returns
 */
export const currProgress = async (
  interaction: ChatInputCommandInteraction
) => {
  // GET USER
  const user = await getCurrUser(interaction.user.username);
  // GET BOOK
  const currBook = await getOnlyCurrentReadingBook();

  const currBookId = currBook?.book.id;
  if (!currBookId || !currBook) {
    interaction.reply("There are is no current book");
    return;
  }

  const progress = await checkProgress(user, currBookId);
  if (!progress) {
    interaction.reply(`You have not started reading ${currBook.book.title}!`);
    return;
  }

  interaction.reply(`${currBook.book.title} ~ CH${progress.chapter}!`);
};

/**
 * Update progress of a book to chapter x.
 * @param interaction
 */
export const updateProgress = async (
  interaction: ChatInputCommandInteraction
) => {
  console.log("🚀 ~ updateProgress Started!");
  // Get Value
  try {
    const newVal = interaction.options.getInteger("current_chapter");

    if (!newVal) {
      interaction.reply("No new chapter was selected");
      return;
    }
    if (newVal < 0) {
      interaction.reply("New chapters can only be above 0");
      return;
    }

    // GET USER
    const user = await getCurrUser(interaction.user.username);

    // GET BOOK
    const currBook = await getOnlyCurrentReadingBook();

    const currBookId = currBook?.book.id;
    if (!currBookId || !currBook) {
      interaction.reply("There are is no current book");
      return;
    }

    let progressUser = await checkProgress(user, currBookId);

    // GET MAX Progress
    let maxChapterOnBook = await getMaxProgressOfBook(currBookId);

    // If this is empty, it means that there is no one with any progress
    if (!maxChapterOnBook) maxChapterOnBook = 0;

    const isValid = isNewValValid(maxChapterOnBook, newVal);
    if (!isValid) {
      interaction.reply(
        "Sorry you can only progress no more than 5 at a time!"
      );
      return;
    }

    if (!progressUser) {
      const progress = await createProgressOnUserAndBookDb(user, currBookId);
      progressUser = await progressUserOnBoookDb(progress.id, newVal);
    } else {
      await progressUserOnBoookDb(progressUser.id, newVal);
    }

    if (newVal < progressUser.chapter) {
      // Delete Roles!
      await removeRoles(
        interaction,
        progressUser.chapter,
        newVal + 1,
        currBook.book
      );
    } else {
      // Create the channels!
      await handleUserChangeInChapter(
        interaction,
        maxChapterOnBook,
        progressUser?.chapter || 0,
        newVal,
        currBook.book
      );
    }

    interaction.reply("Progress updated!");
  } catch (error) {
    interaction.reply("Sorry but i cannot handle the process");
  }
};

/**
 * Adds 1 to the progress of the current book that is being read.
 * And if there is no progress then it creats the progrss on chapter 1.
 *
 * @param interaction
 * @returns
 */
export const nextChapter = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  // GET USER
  const user = await getCurrUser(interaction.user.username);
  // GET BOOK
  const currBook = await getOnlyCurrentReadingBook();

  const currBookId = currBook?.book.id;
  if (!currBookId || !currBook) {
    interaction.reply("There are is no current book");
    return;
  }

  // GET MAX Progress
  let maxChapterOnBook = await getMaxProgressOfBook(currBookId);

  // If this is empty, it means that there is no one with any progress
  // it should just create chapter 1
  if (!maxChapterOnBook) maxChapterOnBook = 0;

  // GET PROGRESS OF USER ON THAT BOOK
  const progressUser = await checkProgress(user, currBookId);

  // If no progress then add ch1 to the progress
  if (!progressUser || !progressUser.chapter) {
    const newProgress = await createProgressOnUserAndBookDb(user, currBookId);

    // VALIDATE AND CREATE NEW CHANNEL
    const isValid = isNewValValid(maxChapterOnBook, newProgress.chapter);
    if (!isValid) {
      interaction.reply(
        "Sorry you can only progress no more than 5 at a time!"
      );
      return;
    }

    await handleUserChangeInChapter(
      interaction,
      maxChapterOnBook,
      0,
      newProgress.chapter,
      currBook.book
    );

    // Reply

    interaction.reply(
      `Congratulations ${interaction.user.username} you just started reading ${currBook.book.title}!`
    );
    return;
  }
  // Increment progress by 1
  const newProgress = await progressUserOnBoookDb(
    progressUser.id,
    progressUser.chapter + 1
  );

  // VALIDATE AND CREATE NEW CHANNEL
  const isValid = isNewValValid(maxChapterOnBook, newProgress.chapter);
  if (!isValid) {
    interaction.reply("Sorry you can only progress no more than 5 at a time!");
    return;
  }

  await handleUserChangeInChapter(
    interaction,
    maxChapterOnBook,
    progressUser.chapter,
    newProgress.chapter,
    currBook.book
  );

  // Reply
  interaction.reply(
    `${interaction.user.username} progressed from ch${progressUser.chapter} to ch${newProgress.chapter} ~ ${currBook.book.title}`
  );
};

const isNewValValid = (maxVal: number, newVal: number) => {
  if (newVal - maxVal > 5) {
    return false;
  }
  return true;
};

const getMaxProgressOfBook = async (
  book_id: number
): Promise<number | void> => {
  const maxProgress = await getMaxProgressOnBookDb(book_id);
  return maxProgress?.chapter;
};
