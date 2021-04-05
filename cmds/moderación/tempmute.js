const Discord = require('discord.js-light');
const Command = require('../../Utils/Classes').Command;
const model = require('../../models/temp');

module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "tempmute"
        this.category = 'moderacion'
        this.memberPermissions = { guild: ['KICK_MEMBERS', 'MANAGE_MESSAGES'], channel: [] }
        this.botPermissions = { guild: ['ADMINISTRATOR', 'MANAGE_ROLES', 'MANAGE_CHANNELS'], channel: [] }
    }

    /**
     * 
     * @param {Object} obj
     * @param {Discord.Message} obj.message
     * @param {Array<String>} obj.args
     * @param {Discord.Client} obj.client
     * 
     */

    run(obj) {

        const { client, message, args, embedResponse } = obj;

        let roles = message.guild.roles.cache.filter(a => !a.managed && a.editable);

        let roleName = 'MUTED';
        let role = roles.find(a => a.name == roleName);
        if (!role)
            return embedResponse('<:thonk:722390649659195392> | Necesitas crear un rol llamado `MUTED` y que yo pueda gestionar.')

        let miembro = message.mentions.members.first();

        let tiempo = require('ms')(args[1] || 'poto galactico')

        if (!miembro) return embedResponse('<:cancel:804368628861763664> | Menciona a un miembro del servidor.')

        if (miembro.id == message.author.id)
            return embedResponse('<:cancel:804368628861763664> | No te puedes silenciar a ti mismo.')

        if (miembro.roles.highest.comparePositionTo(message.member.roles.highest) >= 0)
            return embedResponse('<:cancel:804368628861763664> | No puedes silenciar a este usuario.')

        if (miembro.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0)
            return embedResponse('<:cancel:804368628861763664> | No puedo moderar a este usuario.')

        if (!args[0].match(/<@(!)?[0-9]{17,18}>/g)) return embedResponse('<:cancel:804368628861763664> | La mencion tiene que ser el primer argumento.')

        if (!tiempo)
            return embedResponse('<:cancel:804368628861763664> | Tiempo invalido, prueba poniendo `5m`.')

        miembro = miembro.user;

        return message.guild.member(miembro).roles.add(role).then(async () => {
            let types = ['text', 'category', 'news']
            let canales = message.guild.channels.cache
                .filter(a => types.includes(a.type))
                .filter(a => a.manageable && ch(a))
                .array();
            function ch(c) {
                let permissions = c.permissionOverwrites.array().find(r => r.id == role.id)
                if (!permissions) {
                    return true
                }
                else if (!permissions.deny.toArray().includes('SEND_MESSAGES')) {
                    return true
                }
                else return false;
            }

            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setTimestamp()
                .setTitle('Miembro silenciado')
                .setAuthor(miembro.tag, miembro.displayAvatarURL({ dynamic: true }))
                .addField('⏲️ Tiempo', require('ms')(tiempo), true)
                .addField('<:moderator:804368587115593800> Moderador', message.author.tag, true)

            let data = await model.findOneAndUpdate({
                id: miembro.id,
                guild: message.guild.id
            }, {
                role: role.id,
                tiempo: Date.now() + tiempo,
                type: 'mute',
                toDelete: tiempo + require('ms')('1h')
            })

            if (!data) await model.create({
                id: miembro.id,
                tiempo: Date.now() + tiempo,
                guild: message.guild.id,
                role: role.id, type: 'mute',
                toDelete: Date.now() + tiempo + require('ms')('1h')
            })

            return message.channel.send({ embed: embed }).finally(async () => {
                for (let c of canales) {
                    await Discord.Util.delayFor(2000)
                    try {
                        await c.updateOverwrite(role, { SEND_MESSAGES: false }).catch(() => { })
                    } catch {
                        return false;
                    }
                }
            })
        }).catch(() => {
            let embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setTimestamp()
                .setDescription('<:cancel:804368628861763664> | Error al intentar silenciar al miembro.')
            return message.channel.send({ embed: embed }).catch(() => { });
        })
    }
}