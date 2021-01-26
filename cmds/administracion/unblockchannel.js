const Discord = require("discord.js");
//Después de Alias es opcional.
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "unblockchannel"
        this.alias = []
        this.category = 'administracion'
        this.botPermissions = { guild: [], channel: ['MANAGE_CHANNELS'] }
        this.memberPermissions = { guild: [], channel: ['MANAGE_CHANNELS'] }
    }
    run({ message, client }) {

        return message.channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGES: null
        }).then(() => {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription(`<:moderator:779536592431087619> | ${message.author.username} ha desbloqueado el canal para los miembros.`)
                .setTimestamp()
            return message.channel.send({ embed: embed })

        }).catch(err => {

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription(`<:cancel:779536630041280522> | Error al intentar desbloquear el canal.`)
                .setTimestamp()
                .setFooter(err)
            return message.channel.send({ embed: embed })

        })
    }
}