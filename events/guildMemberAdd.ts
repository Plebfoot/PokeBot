import { GuildMember, TextChannel, MessageEmbed, Client, Message, MessageAttachment } from "discord.js";
import { dbconn } from ".././";
const Canvas = require('canvas')
Canvas.registerFont('./monaco.ttf', { family: 'Pixelar'})

module.exports = (client: Client, member: GuildMember) => {
    dbconn.query('SELECT * FROM `user_pokemon` where discord_id = ?', [member.user.id], async (err, rows, fields) => {
    if(rows[0] == undefined) {
        const canvas = Canvas.createCanvas(500, 400)
        const context = canvas.getContext('2d')
    
        // Achtergrond van de Canvas is een achtergrond van Pokémon zelf. 
        const background = await Canvas.loadImage('./imgs/beginDia.png')
        context.font = `35px Pixelar`
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        context.fillText(`Welcome trainer ${member.displayName}! \nTo begin your journey please \nuse pstarter!`, 35, 336)
        const attachment = new MessageAttachment(canvas.toBuffer(), 'pokemon.png')
    
        var welcomeChannel = (member.guild.channels.cache.get('854844714972217354') as TextChannel);
        welcomeChannel.send(attachment)
    } else {
        const canvas = Canvas.createCanvas(500, 400)
        const context = canvas.getContext('2d')
    
        // Achtergrond van de Canvas is een achtergrond van Pokémon zelf. 
        const background = await Canvas.loadImage('./imgs/beginDia.png')
        context.font = `35px Pixelar`
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        context.fillText(`Welcome back trainer ${member.displayName}! \nGood luck with catching Pokemon!`, 38, 340)
        const attachment = new MessageAttachment(canvas.toBuffer(), 'pokemon.png')
    
        var welcomeChannel = (member.guild.channels.cache.get('854844714972217354') as TextChannel);
        welcomeChannel.send(attachment)
    }
})
   
}
