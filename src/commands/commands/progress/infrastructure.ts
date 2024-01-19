import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Prisma: Gets the user progress on a specific book
 * @param user_id
 * @param book_id
 * @returns current progress (Progress)
 */
export const checkUserProgressOnBookDb = async (
  user_id: number,
  book_id: number
) => {
  const currProgress = await prisma.progress.findFirst({
    where: { userid: user_id, bookid: book_id },
  });

  return currProgress;
};

/**
 * Prisma: Creates the user progress (with chapter 1) on a specific book
 * @param user_id
 * @param book_id
 * @returns new progress (Progress)
 */
export const createProgressOnUserAndBookDb = async (
  user_id: number,
  book_id: number
) => {
  const newProgress = await prisma.progress.create({
    data: {
      userid: user_id,
      bookid: book_id,
      chapter: 1,
    },
  });

  return newProgress;
};

/**
 * Prisma: Update progress of user on that book to x
 * WARNING! what if a user just for fun says 3 000 000?
 * maybe we have to put a cap limit. SO DON'T SEND A VERY
 * HIGH NUMBER!! Make validation first!
 *
 * @param progress_id
 * @param new_chapter
 * @returns new progress (Progress)
 */
export const progressUserOnBoookDb = async (
  progress_id: number,
  new_chapter: number
) => {
  const newProgress = await prisma.progress.update({
    where: { id: progress_id },
    data: { chapter: new_chapter },
  });

  return newProgress;
};

/**
 * Grab the max progress done on the book.
 *
 * @param book_id
 * @returns the latest progress on that book (someone has been)
 */
export const getMaxProgressOnBookDb = async (book_id: number) => {
  const maxProgress = await prisma.progress.findFirst({
    where: { bookid: book_id },
    orderBy: { chapter: "desc" },
  });
  return maxProgress;
};
