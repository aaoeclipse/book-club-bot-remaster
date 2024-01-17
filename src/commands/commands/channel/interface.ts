import {
  CategoryChannelResolvable,
  ChannelType,
  ChatInputCommandInteraction,
  GuildChannelCreateOptions,
  OverwriteResolvable,
} from "discord.js";
import {
  getCurrentReadingBook,
  getOnlyCurrentReadingBook,
} from "../activeBook/interface";

export const createNewCategory = async (
  interaction: ChatInputCommandInteraction
) => {
  // Get book
  const activeBook = await getOnlyCurrentReadingBook();

  if (!activeBook) return;

  if (!interaction.guild) return;

  // create the first role for the ch1
  let role = await interaction.guild.roles.create({
    name: `${activeBook.book.title.split(" ").join("_")}_ch1`,
    color: "Blue",
  });

  // Create permissions
  let overwrites: OverwriteResolvable[] = [
    {
      id: interaction.guild.id, // for everyone role
      deny: ["ViewChannel"],
    },
    {
      id: role?.id, // for 'ch1' role
      allow: ["ViewChannel"],
    },
  ];

  // Create Category
  const options: GuildChannelCreateOptions = {
    type: ChannelType.GuildCategory,
    name: activeBook.book.title,
    permissionOverwrites: overwrites,
  };

  // call discord to create Category
  let category = await interaction.guild.channels.create(options);

  // Create the first text channel for the ch1 inside the category
  const channelOptions: GuildChannelCreateOptions = {
    name: `${activeBook.book.title.split(" ").join("_")}_ch1`,
    type: ChannelType.GuildText,
    parent: category.id, // set this as the parent to place the text channel inside the category
    permissionOverwrites: overwrites, // same overwrites used for the category
  };

  // call discord to create Channel inside Category
  await interaction.guild.channels.create(channelOptions);
};

export const createNewChapterInCategory = async (
  interaction: ChatInputCommandInteraction
) => {
  // Get book
  const activeBook = await getOnlyCurrentReadingBook();

  if (!activeBook) return;

  if (!interaction.guild) return;

  // create the first role for the next chapter
  let role = await interaction.guild.roles.create({
    name: `${activeBook.book.title.split(" ").join("_")}_ch1`,
    color: "Blue",
  });
  let overwrites: OverwriteResolvable[] = [
    {
      id: interaction.guild.id, // for everyone role
      deny: ["ViewChannel"],
    },
    {
      id: role?.id, // for 'ch1' role
      allow: ["ViewChannel"],
    },
  ];
  console.log("creating new chapter");
};
