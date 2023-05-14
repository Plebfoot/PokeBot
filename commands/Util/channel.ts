
import { Message, Client, MessageEmbed, MessageAttachment, MessageFlags } from "discord.js";
import { isBuffer } from "util";
import { dbconn } from "../..";
import { Pokemon } from "../../types";
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

export const description = "Command to catch the pokemon!";
export const usage = 'pcatch `\<pokemon>\`'

export const run = async (client: Client, msg: Message, args: Array<string>) => {
    if (!args[0]) {
        return msg.channel.send('Je moet wel een channel id toevoegen, Hoe je dat doet? Rechtermuisknop op de channel die je wilt gebruiken als pokemon channel, kopieer ID.');
    } else {
        const channelId = args[0]
        dbconn.query('SELECT * FROM guilds WHERE server_id = ?', [msg.guild.id], (err, rows, fields) => {
            dbconn.query('UPDATE `guilds` SET `channel_id`= ?', [channelId])
            // msg.channel.send(msg.guild.id)
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

