import { Book } from "./book.type";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addBookDb = async (book: Book) => {
  console.log("🚀 ~ file: infrastructure.ts:7 ~ addBookDb ~ book:", book);
  const newBook = await prisma.book.create({
    data: {
      title: book.title,
      author: book.author,
      createdBy: book.createdBy,
      chapters: book.chapter,
      description: book.description,
    },
  });

  return newBook;
};

export const listBooksDb = async () => {
  console.log("🚀 ~ file: infrastructure.ts:23 ~ listBooksDb ~ START");
  const books = await prisma.book.findMany();
  return books;
};

export const removeBookDb = async (title: string) => {
  const book = await prisma.book.delete({
    where: {
      title: title,
    },
  });
  return book;
};

export const addBookToElectionDb = async (currElection: number, id: number) => {
  console.log("🚀 ~ file: infrastructure.ts:37 ~ addBookToElection ~ id:", id);
  const newBookElection = await prisma.booksElection.create({
    data: {
      bookid: id,
      electionid: currElection,
    },
  });
  return newBookElection;
};

export const getBookOnElection = async (currElection: number, id: number) => {
  console.log("🚀 ~ file: infrastructure.ts:41 ~ getBookOnElection ~ id:", id);
  const book = await prisma.booksElection.findFirst({
    where: { bookid: id, electionid: currElection },
  });

  return book;
};

export const updateBookDb = async (
  id: number,
  title?: string,
  author?: string,
  description?: string
) => {
  const book = await prisma.book.update({
    where: { id: id },
    data: { title: title, author: author, description: description },
  });

  return book;
};

export const getBookFromIdDb = async (id: number) => {
  const book = await prisma.book.findFirst({
    where: { id: id },
    include: { user: true },
  });
  return book;
};
