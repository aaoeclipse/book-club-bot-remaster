import {
  APIEmbedField,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Book } from "./book.type";
import {
  addBookDb,
  addBookToElectionDb,
  getBookFromIdDb,
  getBookOnElection,
  listBooksDb,
  removeBookDb,
  updateBookDb,
} from "./infrastructure";
import { getCurrUser } from "../user";
import { getCurrElection } from "../elections/infrastructure";
import { getBooksOnElection } from "../elections";
import { getOnlyCurrentReadingBook } from "../activeBook/interface";

export const addBook = async (interaction: ChatInputCommandInteraction) => {
  // Get UserId
  const createdBy = await getCurrUser(interaction.user.username);
  // create book
  let book: Book = { title: "", createdBy: createdBy };
  if (!interaction.options.getString("title")) {
    return;
  }
  book["title"] = interaction.options.getString("title") as string;
  if (interaction.options.getString("author")) {
    book["author"] = interaction.options.getString("author") as string;
  }
  if (interaction.options.getString("description")) {
    book["description"] = interaction.options.getString(
      "description"
    ) as string;
  }
  console.log("🚀 ~ file: interface.ts:19 ~ addBook ~ book:", book);

  // Add book to the db
  const newBook = await addBookDb(book);

  await interaction.reply(
    `Book #[${newBook.id}] ${newBook.title} recommended by ${interaction.user.username} added successfuly!`
  );
};

export const removeBook = async (interaction: ChatInputCommandInteraction) => {
  const activeBook = await getOnlyCurrentReadingBook();
  console.log("🚀 ~ removeBook ~ activeBook:", activeBook);
  const bookTitle = interaction.options.getString("title") as string;
  console.log("🚀 ~ removeBook ~ bookTitle:", bookTitle);
  if (activeBook?.book.title === bookTitle) {
    interaction.reply(
      "Sorry can't remove a book that is currently being read."
    );
    return;
  }
  try {
    const book = await removeBookDb(bookTitle);
    interaction.reply(
      `Book Removed: ${book.title} ${book.author || "undefined author"}`
    );
  } catch (error) {
    interaction.reply("Sorry no books where found with that title");
    return;
  }
};

export const listBooks = async (interaction: ChatInputCommandInteraction) => {
  const listBooks: APIEmbedField[] = [];
  const onlyElection = interaction.options.getBoolean("on_election");
  let embedBuiler: EmbedBuilder;

  if (onlyElection) {
    const currEle = await getCurrElection();
    if (!currEle) {
      interaction.reply("no current elections");
      return;
    }
    // get all books from election
    const books = await getBooksOnElection();
    console.log("🚀 ~ file: interface.ts:49 ~ listBooks ~ books:", books);

    if (!books) {
      interaction.reply("No books are availabe at the moment");
      return;
    }

    for (const book of books) {
      listBooks.push({
        name: `[${book.bookid}] - ${book.book.title} ~ votes: ${book.votes}`,
        value: `${book.book.author ? book.book.author : " "}`,
      });
    }

    embedBuiler = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Election books!")
      .setAuthor({ name: "Book Bot" })
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(listBooks)
      .setTimestamp()
      .setFooter({ text: `Election #${currEle?.id}` });
  } else {
    const books = await listBooksDb();

    for (const book of books) {
      listBooks.push({
        name: `[${book.id}] - ${book.title}`,
        value: `${book.author ? book.author : " "}`,
      });
    }

    embedBuiler = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("All Books")
      .setAuthor({ name: "Book Bot" })
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(listBooks)
      .setTimestamp()
      .setFooter({ text: "All books" });
  }

  interaction.reply({ embeds: [embedBuiler] });
};

export const addBookToElection = async (
  interaction: ChatInputCommandInteraction
) => {
  const id = interaction.options.getInteger("book_id");
  console.log("🚀 ~ file: interface.ts:93 ~ addBookToElection ~ id:", id);

  if (!id) {
    interaction.reply("No id was selected");
    return;
  }

  // Check if there are elections in progress
  const election = await getCurrElection();
  console.log(
    "🚀 ~ file: interface.ts:98 ~ addBookToElection ~ election:",
    election
  );

  if (!election) {
    interaction.reply(
      "No current elections in progress, create an election to add books to it"
    );
    return;
  }

  // Check if it's on the electin list:
  let book;
  try {
    book = await getBookOnElection(election.id, id);
  } catch (error) {
    console.log("🚀 ~ error ~ addBookToElection ~ getBookOnElection:", error);
    interaction.reply("The book does not exist");
    return;
  }

  if (book) {
    interaction.reply("The book is already on election");
    return;
  }

  // Add to selected
  let electionRepsonse;
  try {
    electionRepsonse = await addBookToElectionDb(election.id, id);
  } catch (error) {
    console.log("🚀 ~ error ~ addBookToElection ~ addBookToElectionDb:", error);
    interaction.reply("Cannot add that book to the election");
    return;
  }

  if (!electionRepsonse) {
    interaction.reply(
      "Error adding book to election. Unkown reason. ask @aaoeclipse"
    );
    return;
  }

  interaction.reply(`Added book successfuly to the elections`);
};

export const updateBook = async (interaction: ChatInputCommandInteraction) => {
  const bookid = interaction.options.getInteger("book_id");
  console.log("🚀 ~ file: interface.ts:130 ~ updateBook ~ bookid:", bookid);
  if (!bookid) return;

  // Check if book exist
  let book;
  try {
    book = await getBookFromId(bookid);
  } catch (error) {
    interaction.reply("Book does not exist");
    return;
  }

  if (!book) {
    interaction.reply("Book does not exist");
    return;
  }

  const title = interaction.options.getString("title") || undefined;
  const author = interaction.options.getString("author") || undefined;
  const description = interaction.options.getString("description") || undefined;

  if (!title && !author && !description) {
    interaction.reply(
      "You have to use any of the options but at least one: title, author, description"
    );
    return;
  }

  try {
    const updated = await updateBookDb(bookid, title, author, description);
    if (!updated) {
      interaction.reply("error updating book, contact @aaoeclipse");
      return;
    }
    interaction.reply("book updated!");
  } catch (error) {
    interaction.reply("Book not found!");
    return;
  }
};

export const getBookFromId = async (id: number) => {
  return getBookFromIdDb(id);
};

export const getBookDetailView = async (
  interaction: ChatInputCommandInteraction
) => {
  console.log("🚀 Starting ~ getBookDetailView");
  let bookid;
  try {
    bookid = interaction.options.getInteger("book_id");
  } catch (error) {
    interaction.reply("Error finding book");
    return;
  }

  console.log("📝 ~ bookid:", bookid);

  if (!bookid) {
    interaction.reply("Book not found");
    return;
  }
  // check if book exist
  let book;
  try {
    book = await getBookFromId(bookid);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    interaction.reply("Book not found");
    return;
  }
  console.log("📝 ~ book info:", book);

  if (!book) {
    interaction.reply("Book not found");
    return;
  }

  let description = book.description;

  if (description && description.length > 1024)
    description = description.substring(0, 1019) + "...";

  const embedBuiler = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${book.title}`)
    .setAuthor({ name: `${book.author || "No author given"}` })
    .setThumbnail(
      "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=2076&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    )
    .addFields([
      {
        name: "Description",
        value: `${description || "no description given"}`,
      },
    ])
    .setTimestamp()
    .setFooter({ text: `Recommended by ${book.user.username}` });

  interaction.reply({ embeds: [embedBuiler] });
};
