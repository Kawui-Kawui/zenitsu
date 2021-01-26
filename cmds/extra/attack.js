const statusA = new Map();
const Discord = require('discord.js');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "attack"
        this.category = 'extra'
    }
    async run({ client, message, embedResponse }) {

        let prob = Math.floor(Math.random() * 99) + 1;

        let data = await client.getData({ id: message.author.id }, 'demonios')
        let dinero = Math.floor(Math.random() * 49) + 1;
        let { nivelenemigo, nivelespada } = data;

        let dañoenemigo = nivelenemigo;
        let dañouser = nivelespada;

        if (dañoenemigo > dañouser)
            return embedResponse('Mejor vete a entrenar... No estas listo.')

        else {

            if (!statusA.get(message.author.id)) {

                statusA.set(message.author.id, { status: true });

            }

            else {

                return embedResponse('Ya estas en combate!')

            }

            let embed1 = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription('Estas teniendo una pelea con el enemigo ⚔️!')
                .setTimestamp()
                .setThumbnail('https://media1.tenor.com/images/dce718a6dcfac57261944a5bee6c1d76/tenor.gif?itemid=17922860')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

            message.channel.send({ embed: embed1 }).catch(() => { });

            await Discord.Util.delayFor(5000);

            if (prob >= 60) {

                let dataz = await client.updateData({ id: message.author.id }, { $inc: { monstruos: 1, dinero: dinero, nivelenemigo: 1 } }, 'demonios');

                let embed = new Discord.MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`Has derrotado un demonio (total: ${dataz.monstruos}) y recibiste ${dinero}$ (total: ${dataz.dinero}$)`)
                    .setTimestamp()
                    .setThumbnail('https://media1.tenor.com/images/8914edb2f83697285be18d3a231dda31/tenor.gif?itemid=18818936')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

                statusA.delete(message.author.id);

                return message.channel.send({ embed: embed }).catch(() => { });
            }

            else {

                let embed = new Discord.MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`Has perdido contra un demonio!`)
                    .setTimestamp()
                    .setThumbnail('https://media1.tenor.com/images/70f561dfe0728a68561f1fad7f79acce/tenor.gif?itemid=14992860')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

                statusA.delete(message.author.id);

                return message.channel.send({ embed: embed }).catch(() => { });

            }

        }
    }
}