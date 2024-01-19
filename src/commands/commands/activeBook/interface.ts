import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getCurrReadingActiveBookDb } from "./infrastructure";

export const getCurrIdOfBook = async () => {
  const currBook = await getCurrReadingActiveBookDb();
  if (!currBook || !currBook?.book) return;

  return currBook.book.id;
};

export const getCurrentReadingBook = async (
  interaction: ChatInputCommandInteraction
) => {
  const currentBook = await getCurrReadingActiveBookDb();
  console.log(
    "🚀 ~ file: interface.ts:7 ~ getCurrentReadingBook ~ currentBook:",
    currentBook
  );

  let embedBuiler: EmbedBuilder;

  if (!currentBook) {
    interaction.reply("no previous winner");
    return;
  }

  embedBuiler = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`[${currentBook.bookid}] ~ ${currentBook.book.title}`)
    .setAuthor({ name: `${currentBook.book.author}` })
    .setThumbnail(
      "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=2076&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    )
    .addFields(
      {
        name: "Description",
        value: `${currentBook.book.description}`,
      },
      {
        name: "Winner of Election #",
        value: `${currentBook.wonElection}`,
      }
    )
    .setTimestamp()
    .setFooter({ text: `Recommended by ${currentBook.book.createdBy}` });

  interaction.reply({ embeds: [embedBuiler] });
};

export const getOnlyCurrentReadingBook = async () => {
  return getCurrReadingActiveBookDb();
};
