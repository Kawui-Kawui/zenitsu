const Discord = require('discord.js');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "stats"
        this.category = 'extra'
    }
    async run({ client, message, args }) {

        let member = message.guild.members.cache.find(a => a.user.username === args.join(' ')) || message.guild.members.cache.find(a => a.user.tag === args.join(' ')) || message.guild.members.cache.find(a => a.displayName === args.join(' ')) || message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member
        let data = await client.getData({ id: member.user.id }, 'demonios')
        let { monstruos, nivelenemigo, nivelespada, xpusuario, dinero, jefes } = data;

        let embed = new Discord.MessageEmbed()
            .setColor(client.color)
            .setTimestamp()
            .setAuthor(`Estadisticas de ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
            .addField('Monstruos cazados', monstruos, true)
            .addField('Nivel del enemigo', nivelenemigo, true)
            .addField('Nivel de ' + member.user.tag, nivelespada, true)
            .addField('Experiencia de usuario', xpusuario, true)
            .addField('Dinero', dinero, true)
            .addField('Jefes derrotados', jefes, true)

        message.channel.send({ embed: embed }).catch(() => { });
    }
}