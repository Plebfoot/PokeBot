
import { Message, Client, MessageEmbed, MessageAttachment, MessageFlags } from "discord.js";
import { dbconn } from "../..";
import { Pokemon } from "../../types";
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

export const description = "Command to catch the pokemon!";
export const usage = 'pcatch `\<pokemon>\`'

export const run = async (client: Client, msg: Message, args: Array<string>) => {

    if (!args[0]) {
        return;
    } else {

        const IV = {
            attack: Math.floor(Math.random() * 15) + 1,
            defense: Math.floor(Math.random() * 15) + 1,
            stamina: Math.floor(Math.random() * 15) + 1
        }

        let level = Math.floor(Math.random() * 20) + 1;

        const pokemonName = args[0].toLowerCase();
        if (Pokemon.caughtPokemon) {
            msg.channel.send(`${capitalizeFirstLetter(Pokemon.lastSpawnedPokemon)} has been caught already`);
        } else if (pokemonName === Pokemon.lastSpawnedPokemon) {
            dbconn.query("INSERT INTO `user_pokemon`(`id`, `pokemon_name`, `time`, `attack`, `defense`, `stamina`, `level`) VALUES (?,?,?,?,?,?)", [msg.author.id, pokemonName, IV.attack, IV.defense, IV.stamina, level], (err, rows, fields) => {
                console.log(dbconn)

                msg.channel.send(`You caught ${capitalizeFirstLetter(pokemonName)}!`);
                msg.channel.send(`IV: Attack: ${IV.attack}, Defense: ${IV.defense}, Stamina: ${IV.stamina}`)
                Pokemon.caughtPokemon = true;


            });
        } else {
            msg.channel.send(`You didn't catch the last spawned Pokemon.`);
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

