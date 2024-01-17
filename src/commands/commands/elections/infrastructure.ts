import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCurrElection = async () => {
  const currElection = await prisma.election.findFirst({
    where: { finish: false },
  });

  return currElection;
};

export const createElection = async (user_id: number) => {
  console.log(
    "🚀 ~ file: infrastructure.ts:5 ~ createElection ~ user_id:",
    user_id
  );

  const newElection = await prisma.election.create({
    data: {
      startedBy: user_id,
    },
  });

  return newElection;
};

export const getAllBooksFromElectionDb = async (electionid: number) => {
  console.log(
    "🚀 ~ file: infrastructure.ts:27 ~ getAllBooksFromElectionDb ~ electionid:",
    electionid
  );
  let booksElection = await prisma.booksElection.findMany({
    where: { electionid: electionid },
    include: { book: true }, // Include the Book relation
  });

  const votes = await prisma.vote.groupBy({
    by: ["bookid"],
    where: { electionid: electionid },
    _count: {
      bookid: true,
    },
  });
  console.log(
    "🚀 ~ file: infrastructure.ts:40 ~ getAllBooksFromElectionDb ~ votes:",
    votes
  );

  const newBookElection = booksElection.map((bookElection) => {
    const vote = votes.find((vote) => vote.bookid === bookElection.bookid);
    const voteCount = vote ? vote._count.bookid : 0;

    return {
      ...bookElection,
      votes: voteCount,
    };
  });

  return newBookElection;
};

export const closeElectionDb = async (electionid: number) => {
  console.log(
    "🚀 ~ file: infrastructure.ts:56 ~ closeElectionDb ~ electionid:",
    electionid
  );

  const closedElection = await prisma.election.update({
    where: { id: electionid },
    data: { finish: true },
  });

  return closedElection;
};

export const findWinner = async (electionid: number) => {
  const votes = await prisma.vote.groupBy({
    by: ["bookid"],
    where: { electionid: electionid },
    _count: {
      bookid: true,
    },
  });
};

export const ActiveBookDb = async (bookid: number, currElectionId: number) => {
  const newActiveBook = await prisma.activeBook.create({
    data: {
      bookid: bookid,
      wonElection: currElectionId,
    },
  });

  return newActiveBook;
};
