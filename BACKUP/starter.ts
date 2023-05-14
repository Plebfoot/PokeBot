
import { Message, Client, MessageEmbed, MessageAttachment } from "discord.js";
import { dbconn } from "..";
const axios = require('axios')
const Canvas = require('canvas')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

export const description = "Command to choose your starter pokemon!";
export const usage = 'pstarter \`<pokemon>\`'

let startP = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip', 'turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott', 'chespin', 'fennekin', 'froakie', 'rowlet', 'litten', 'popplio', 'grookey', 'scorbunny', 'sobble'];

export const run = async (client: Client, msg: Message, args: Array<string>) => {
    dbconn.query('SELECT * FROM `message_count` WHERE discord_id = ?', [msg.author.id], (err, rows, fields) => {
        if (rows[0] === undefined) {
            let embed = new MessageEmbed()
            .setTitle('Choose your starter pokémon!')
            .setDescription('**Welcome to your new journey!** \nTo begin play you need to choose one of these pokémon with the \`\`pstarter <pokémon>\`\` command, like this: \`\`pstarter litten\`\`')
            .addField('Generation I', 'Bulbasaur | Charmander | Squirtle', true)
            .addField('Generation II', 'Chikorita | Cyndaquil | Totodile', false)
            .addField('Generation III', 'Treecko | Torchic | Mudkip', false)
            .addField('Generation IV', 'Turtwig | Chimchar | Piplup', false)
            .addField('Generation V', 'Snivy | Tepig | Oshawott', false)
            .addField('Generation VI', 'Chespin | Fennekin | Froakie', false)
            .addField('Generation VII', 'Rowlet | Litten | Popplio', false)
            .addField('Generation VIII', 'Grookey | Scorbunny | Sobble', false)
            .setAuthor('Professor Oak', 'https://pbs.twimg.com/profile_images/428279017339645952/GtojrlL9.jpeg')
    
        dbconn.query("SELECT * FROM `user_pokemon` WHERE `discord_id` = ?", [msg.author.id], (err, rows, fields) => {
            let starter = args[0]
    
            if (!starter) {
                return msg.channel.send(embed)
            }
    
            var pIndex = startP.indexOf(starter.toLowerCase())
    
            dbconn.query("SELECT * FROM pokemon WHERE name = ?;", [startP[pIndex]], async (err, rows, fields) => {
                if (rows[0] == undefined) {
                    let embed = new MessageEmbed()
                        .setAuthor('Professor Oak', 'https://pbs.twimg.com/profile_images/428279017339645952/GtojrlL9.jpeg')
                        .setDescription(`\`\`\`${capitalizeFirstLetter(starter)} can't be your starter Pokémon!\`\`\``)
                    return msg.channel.send(embed)
                } else {
    
                   
                //  let urlImg = `https://pokeres.bastionbot.org/images/pokemon/${rows[0].id}.png`
                    /** Hier maak ik een canvas  */
                    const canvas = Canvas.createCanvas(400, 400)
                    const context = canvas.getContext('2d')
    
                    // Achtergrond van de Canvas is een achtergrond van Pokémon zelf. 
                    const background = await Canvas.loadImage('./imgs/grassfield.png')
                    context.drawImage(background, 0, 0, canvas.width, canvas.height)
                    const shadow = await Canvas.loadImage('./imgs/pshadow.png')
                    context.drawImage(shadow, 20, 270, 400, 50)
                    const pokemon = await Canvas.loadImage('')
                    context.drawImage(pokemon, 100, 100, 200, 200)
    
    
                    // Hier maar ik van de canvas een attachment om later te kunnen versturen in de Discord. 
                    const attachment = new MessageAttachment(canvas.toBuffer(), 'pokemon.png')
    
                    let embed = new MessageEmbed()
                        .setAuthor('Professor Oak', 'https://pbs.twimg.com/profile_images/428279017339645952/GtojrlL9.jpeg')
                        .setTitle('Congratulations!')
                        .setDescription(`\`\`\`${capitalizeFirstLetter(starter.toLowerCase())} is now your starter Pokémon!\`\`\``)
                        .attachFiles([attachment])
                        .setImage('attachment://pokemon.png')
                    msg.channel.send(embed).then(msg => {
                        msg.delete({ timeout: 5000 }).then(mesg => {
                            let oakEmbed = new MessageEmbed()
                                .setAuthor('Professor Oak', 'https://pbs.twimg.com/profile_images/428279017339645952/GtojrlL9.jpeg')
                                .setTitle('Oh wait! Almost forgot!')
                                .setDescription(`\`\`\`Here is your Pokedex and 100 coins! \`\`\``)
                            mesg.channel.send(oakEmbed)
                        })
                    }).catch()
                    let data;
                    await P.getPokemonByName(starter.toLowerCase(), function (response, error) {
                        if (!error) {
                            data = response;
                        } else {
                            console.log(error);
                        }
                    });
                    let types = data.types.map(x => x.type.name)
                    dbconn.query("INSERT INTO `user_pokemon`(`discord_id`, `pokemon_name`, `pokemon_id`, `level`, `hp`, `attack`, `defense`, `special_attack`, `special_defense`, `speed`, `types`, `shiny`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [msg.author.id, starter.toLowerCase(), rows[0].id, 5, randomNum(31), randomNum(31), randomNum(31), randomNum(31), randomNum(31), randomNum(31), types, 0], (err, rows, fields) => {
                        if (err) console.log(err);
                    });
    
                    dbconn.query("INSERT INTO `user_balance`(`discord_id`, `balance`) VALUES (?,?)", [msg.author.id, 100], (err, userRows, fields) => {
                        if (err) console.log(err)
                    })
                }
    
            });
        });
        } else {
            let embed = new MessageEmbed()
                .setAuthor('Professor Oak', 'https://pbs.twimg.com/profile_images/428279017339645952/GtojrlL9.jpeg')
                .setDescription(`\`\`\`You already have your starter!\`\`\``)
            return msg.channel.send(embed)
        }
    })
   
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function randomNum(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
};
