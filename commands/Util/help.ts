
import { Message, Client, MessageEmbed, MessageAttachment } from "discord.js";

export const description = "Command to catch the pokemon!";
export const usage = 'pcatch `\<pokemon>\`'

export const run = async (client: Client, msg: Message, args: Array<string>) => {
    msg.channel.send('test')


}


