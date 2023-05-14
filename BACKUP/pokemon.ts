
            // .then(() => {
            //     dbconn.query("SELECT * FROM pokemon WHERE id = ?;", [randomNumber], (err, rows, fields) => {
            //         let obj = rows[0]

            //         console.log(obj.name)
            //         const filter = m => m.content.toLowerCase().includes(`pcatch ${obj.name}`)

            //         msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            //             .then(collected => {

            //                 dbconn.query("INSERT INTO `user_pokemon` (`discord_id`, `pokemon_id`, `pokemon_level`) VALUES (?,?,?)", [collected.first().author.id, obj.id, 1], (err, rows, fields) => {
            //                     if (err) console.log(err);
            //                 });
            //                 msg.channel.send(`${collected.first().author.username} got the correct answer! The correct answer was: \`${capitalizeFirstLetter(obj.name)}\``).then(msg => {
            //                     msg.delete({ timeout: 5000 }).then(mesg => { mesg.channel.send(`${capitalizeFirstLetter(obj.name)} has been added to your Pokédex!`) })
            //                 }).catch()
            //             })
            //             .catch(collected => {
            //                 msg.channel.send(`Oh no! the wild \`${capitalizeFirstLetter(obj.name)}\` fled!`).then((m) => {
            //                     m.delete({ timeout: 5000 }).then((ms) => {
            //                         ms.channel.send('Better luck next time trainers!')
            //                     })
            //                 }).catch();
            //             });
            //     });

            
import { Message, Client, MessageEmbed, MessageAttachment, Collection } from "discord.js";
import { url } from "inspector";
const axios = require('axios')
const Canvas = require('canvas')
// import { dbconn } from "../../index";
const { getEmoji } = require("../../functions");

export const description = "Pokémon";
export const aliases = ["p!", "pokecatch"];
export const usage = "catch Pikachu"

export const run = async (client: Client, msg: Message, args: Array<string>) => {

    /**
 * 
 *  Checked hier of de pokemon guild id er nog instaat, zo ja stuurt die niks. als die niet gevangen is binnen een uur wordt de pokemon gedelete uit de GUILD_POKEMON table. En wordt er een nieuwe verzonden.
 * 
 */


    getPokemonCount().then(async (res) => {

        let server = msg.guild.id

        let randomNumber = Math.floor(Math.random() * (res + 1)) + 1
        let urlImg = `https://pokeres.bastionbot.org/images/pokemon/${randomNumber}.png`
        /** Hier maak ik een canvas  */
        const canvas = Canvas.createCanvas(400, 400)
        const context = canvas.getContext('2d')

        // Achtergrond van de Canvas is een achtergrond van Pokémon zelf. 
        const background = await Canvas.loadImage('./imgs/pbg.png')
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        const pokemon = await Canvas.loadImage(urlImg)
        context.drawImage(pokemon, 140, 50, 200, 200)
        // Hier maar ik van de canvas een attachment om later te kunnen versturen in de Discord. 
        const attachment = new MessageAttachment(canvas.toBuffer(), 'pokemon.png')

        // Hiermee maak ik een Embed aan om de foto + de pokémon te sturen. 
        const embed = new MessageEmbed()
            .setTitle(`Oh? a wild Pokémon appeared!`)
            .setDescription('Typ pcatch \`<Pokémon>\` to catch the pokémon!')
            .attachFiles([attachment])
            .setImage('attachment://pokemon.png')
            .setTimestamp()
        msg.channel.send(embed).then(() => {
            dbconn.query("SELECT * FROM pokemon WHERE id = ?;", [randomNumber], (err, pokemonRow, fields) => {
                let obj = pokemonRow[0]
                console.log(obj.name)
                dbconn.query("INSERT INTO `guild_pokemon` (`guild_id`, `pokemon`, `pokemon_id`) VALUES (?,?,?)", [server, obj.name, obj.id], (err, rows, fields) => {
                    if (err) console.log(err);
                });
            })
        })
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}



function getPokemonCount() {
    const pokemonCountPromise = new Promise<number>((resolve, reject) => {
        dbconn.query("SELECT COUNT(id) AS pokemon_count FROM pokemon;", (err, rows, fields) => {
            resolve(rows[0].pokemon_count)
        });
    });

    return pokemonCountPromise
}

function generateStat(stats, statToGen, ivs, level, nature) {
    let bs = 0;

    let natureFactor = 1;
    if (nature[1] === statToGen) {
        natureFactor = 1.1;
    } else if (nature[2] === statToGen) {
        natureFactor = 0.9;
    }

    for (let stat of stats) {
        if (stat.stat.name !== statToGen) continue;
        bs = stat.base_stat;
    }
    if (statToGen === "hp") {
        return Math.floor((2 * bs + ivs[statToGen] + 0) * level / 100 + level + 10);
    } else {
        return Math.floor(Math.floor((2 * bs + ivs[statToGen] + 0) * level / 100 + 5) * natureFactor)
    }
}

function generateIVSummary(ivs) {
    let sum = 0;
    for (let iv in ivs) {
        sum += ivs[iv];
    }
    return (Math.floor(sum / 186 * 100)) + "%";

}