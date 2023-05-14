import { Client, Message, BaseClient, DiscordAPIError, MessageEmbed, MessageAttachment } from "discord.js";
const Canvas = require('canvas')
const { generateIVSummary, generateStat, generateSpaces } = require("../functions");
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

module.exports = (client: any, message: Message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    /**
    * 
    * Simple command handler
    * 
    */

    let prefix = 'p'

    if (message.mentions.users.first() == client.user) {
        message.channel.send(`My prefix in this guild is \`${prefix}\``);
    }

    if (message.content.indexOf(prefix) !== 0) return;

    // Get arguments
    var rawArgs = message.content.slice(prefix.length).trim()
    var regeX = /[^\s"]+|"([^"]*)"/gi;
    var args = [];
    // Check if they are combined with a string
    do {
        var match = regeX.exec(rawArgs);
        if (match != null) {
            args.push(match[1] ? match[1] : match[0]);
        }
    } while (match != null);

    // Try to get the args
    try { var command = args.shift().toLowerCase(); } catch (e) { }
    const cmd = client.commands.get(command); // Command object

    if (!cmd) return;

    // Run the command if you can find it
    cmd.run(client, message, args);
}
