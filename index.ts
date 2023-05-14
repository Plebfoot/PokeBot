import { readdir, stat } from "fs";
import { Activity, Client, Guild, MessageAttachment, MessageEmbed, TextChannel, Intents, Message } from "discord.js";
import { HelpObject, Pokemon } from "./types";
export const helpList: Array<HelpObject> = []

import { createConnection } from "mysql2";

const Canvas = require('canvas')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const {readdirSync} = require('fs');

const config = require("./config/config.json");
const Enmap = require("enmap");
export const client: any = new Client();

client.config = config;

export const dbconn = createConnection({
	host: config.db.hostname,
	database: config.db.database,
	user: config.db.username,
	password: config.db.password
});


readdir("./events/", (err, files) => {
	if (err) throw new Error(err.message);

	files.forEach((file) => {
		if (!file.endsWith(".ts")) return; // Geen typescript? OPROTTEN GAWU 

		// Get EventName & file
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		// Register Event
		client.on(eventName, event.bind(null, client));
	});
});

client.commands = new Enmap();
var logList: string = "Kommandoes: ";

readdir("./commands/", (err, categories) => {
	categories.forEach((category) => {

		readdir(`./commands/${category}/`, (err, files) => {



			if (err) throw new Error(err.message);

			files.forEach((file) => {
				if (!file.endsWith(".ts")) return; // Geen typescript? OPROTTEN GAWU 

				// Require command file and get the name.

				let props = require(`./commands/${category}/${file}`);
				let commandName = file.split(".")[0];

				// set help shit
				if (props.description !== undefined) {
					helpList.push({
						"commandName": commandName,
						"description": props.description,
						"category": category,
						"aliases": props.aliases != undefined ? props.aliases : "None",
						"usage": props.usage != undefined ? props.usage : "None",
						"exclude": props.exclude
					})
				}

				if (props.aliases != undefined) {
					props.aliases.forEach((alias) => {
						client.commands.set(alias, props);
					})
				}

				client.commands.set(commandName, props);
				logList += `${commandName}, `;
			})
		});
	});
})

async function spawnPokemon() {
	const randomId = Math.floor(Math.random() * 807) + 1;

	P.getPokemonByName(randomId) 
		.then(async response => {

			Pokemon.lastSpawnedPokemon = response.name
			Pokemon.caughtPokemon = false;
			console.log(response.name)

			let pokemonImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${response.id}.png`
			  /** Canvas shit  */
			  const canvas = Canvas.createCanvas(400, 400)
			  const context = canvas.getContext('2d')
  
			  // Canvas met pokemon en achtergrond
			  const background = await Canvas.loadImage('./imgs/pbg.png')
			  context.drawImage(background, 0, 0, canvas.width, canvas.height)
			  const pokemon = await Canvas.loadImage(pokemonImg)
			  context.drawImage(pokemon, 140, 50, 200, 200)
			  const attachment = new MessageAttachment(canvas.toBuffer(), 'pokemon.png')
			  
		 // Embed voor pokemon 
			const embed = new MessageEmbed()
				.setTitle(`Oh? a wild Pokémon appeared!`)
				.setDescription('Typ pcatch \`<Pokémon>\` to catch the pokémon!')
				.attachFiles([attachment])
				.setImage('attachment://pokemon.png')
				.setTimestamp();
			client.channels.cache.get("854844714972217354").send(embed)
		})
		.catch(console.log)
}

setInterval(spawnPokemon, 10000);

client.on("ready", () => {
	console.log("Fakka Niffo");
	console.log(logList);
});

client.on('guildCreate', (guild) => {
	const guildId = client.guilds.cache.get(guild.id).id;
	console.log(`The guild ID is: ${guildId}`);
	dbconn.query("INSERT INTO `guilds`(`server_id`, `channel_id`) VALUES (?,?)", [guildId, 0], (err, rows, fields) => {
            if(err) throw err
    


  });
  });

client.login(config.tokenn);


