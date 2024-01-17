import { ChatInputCommandInteraction } from "discord.js";
import { getCurrUser } from "../user";

export const checkProgress = (interaction: ChatInputCommandInteraction) => {
  console.log("checking progress of user");
};

export const updateProgress = async (
  interaction: ChatInputCommandInteraction
) => {
  console.log("updating progres");
  const user = await getCurrUser(interaction.user.username);
};

export const nextChapter = async (interaction: ChatInputCommandInteraction) => {
  console.log("user next chapter on book x");
  const user = await getCurrUser(interaction.user.username);
};
