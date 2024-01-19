import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildBasedChannel,
  GuildChannelCreateOptions,
  OverwriteResolvable,
} from "discord.js";
import { getOnlyCurrentReadingBook } from "../activeBook/interface";
import { Book } from "@prisma/client";
import { getCurrUser } from "../user";

export const createNewCategory = async (
  interaction: ChatInputCommandInteraction
) => {
  // Get book
  const activeBook = await getOnlyCurrentReadingBook();

  if (!activeBook) return;

  if (!interaction.guild) return;

  // Create Category
  const options: GuildChannelCreateOptions = {
    type: ChannelType.GuildCategory,
    name: activeBook.book.title,
  };

  // call discord to create Category
  await interaction.guild.channels.create(options);
};

export const handleUserChangeInChapter = async (
  interaction: ChatInputCommandInteraction,
  max_value: number,
  curr_value: number,
  new_value: number,
  active_book: Book
) => {
  // check all values that are below the max value.
  curr_value += 1;
  while (curr_value < new_value && curr_value < max_value) {
    // Add permission to that user to those chapters
    addRoleToUser(interaction, active_book, curr_value);
    curr_value += 1;
  }

  // if there are chapters remaning (above the max)
  if (new_value > max_value) {
    // call the createNewChannels
    // Add permission to that user to those chapters
    createNewChannels(interaction, max_value, new_value, active_book);
  }
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

/**
 * Creates the channels between two numbers, excluding the 1st and including the 2nd
 * @param interaction
 * @param max_channel
 * @param new_channel
 * @param active_book
 */
export const createNewChannels = async (
  interaction: ChatInputCommandInteraction,
  max_channel: number,
  new_channel: number,
  active_book: Book
) => {
  if (!interaction.guild) return;

  // Grab current category
  let category = await interaction.guild.channels.cache.find(
    (channel) =>
      channel.name === active_book.title &&
      channel.type === ChannelType.GuildCategory
  );

  if (!category) return;

  // Loop through all the new chapters that
  // need to be created in the discord server
  for (
    // We add 1 to start on 1 instead of 0
    let new_chapter = max_channel + 1;
    new_chapter < new_channel + 1;
    new_chapter++
  ) {
    // TODO: Fix: This is so bad practice, this should be a promise.all
    await createChannel(interaction, new_chapter, active_book, category);
  }
};

/**
 * Creates a channel with the permission to that user
 * @param interaction
 * @param channel_ch
 * @param active_book
 * @param category
 * @returns
 */
const createChannel = async (
  interaction: ChatInputCommandInteraction,
  channel_ch: number,
  active_book: Book,
  category: GuildBasedChannel
) => {
  if (!interaction) return;
  if (!interaction.guild) return;
  if (!interaction.member) return;

  const channel_name = `${active_book.title
    .split(" ")
    .join("_")}_ch${channel_ch}`.toLowerCase();

  // Check if role exists:
  let role = await interaction.guild.roles.cache.find(
    (e) => e.name === `${channel_name}`
  );
  if (!role)
    role = await interaction.guild.roles.create({
      name: channel_name,
      color: "Blue",
    });

  let overwrites: OverwriteResolvable[] = [
    {
      id: interaction.guild.id,
      deny: ["ViewChannel"],
    },
    {
      id: role?.id,
      allow: ["ViewChannel"],
    },
  ];

  const channelOptions: GuildChannelCreateOptions = {
    name: channel_name,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites: overwrites,
  };

  // CREATE CHANNEL
  const exists = await interaction.guild.channels.cache.find(
    (element) => element.name === channel_name
  );
  if (!exists) {
    console.log(`[+] New Chapter ${channel_ch} created!`);
    await interaction.guild.channels.create(channelOptions);
  }
  // ADD ROLE TO CURR USER
  addRoleToUser(interaction, active_book, channel_ch);
};

const addRoleToUser = async (
  interaction: ChatInputCommandInteraction,
  active_book: Book,
  channel_ch: number
) => {
  if (!interaction) return;
  if (!interaction.guild) return;
  if (!interaction.member) return;

  let userRole;
  const roleName = `${active_book.title
    .split(" ")
    .join("_")}_ch${channel_ch}`.toLowerCase();

  userRole = interaction.guild.roles.cache.find(
    (role) => role.name === roleName
  );

  // @ts-ignore
  await interaction.member.roles.add(userRole);
};

export const removeRoles = async (
  interaction: ChatInputCommandInteraction,
  currChapter: number,
  newValue: number,
  active_book: Book
) => {
  if (newValue > currChapter) {
    interaction.reply("You can only delete progress if it's negative");
    return;
  }
  if (newValue < 0) {
    interaction.reply("You can only delete progress to 0");
    return;
  }

  for (let i = currChapter; i >= newValue; i--) {
    if (i === 0) break;
    const rolName = `${active_book.title
      .split(" ")
      .join("_")}_ch${i}`.toLowerCase();

    // remove roles
    // @ts-ignore
    const roleToRemove = await interaction.member?.roles.cache.find(
      (e: any) => e.name === `${rolName}`
    );
    // @ts-ignore
    await interaction.member.roles.remove(roleToRemove);
  }
};
