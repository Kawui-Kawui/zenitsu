/* eslint-disable no-unused-vars */
const { sendEmbed, mapaCanvas, awaitMessage } = require('../../Utils/Functions')
const tresenraya = require('tresenraya');
const { Message, MessageAttachment } = require('discord.js');
const { Client } = require('discord.js');

const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "tresenraya"
        this.alias = ['ttt']
        this.category = 'diversion'
    }
    /**
     * @param {Object} obj
     * @param {Message} obj.message
     * @param {Client} obj.client
     */
    async run(obj) {

        const { message, client } = obj;

        let usuario = message.mentions.members.first()

        if (!usuario || usuario.id == message.author.id || (usuario.user.bot && usuario.id != client.user.id)) return sendEmbed({
            channel: message.channel,
            description: `<:cancel:804368628861763664> | Menciona a un miembro del servidor para jugar.`,
            footerText: 'Si quieres jugar solo menciona al bot...'
        });

        usuario = usuario.user
        if (message.guild.partida)
            return sendEmbed({ channel: message.channel, description: '<:cancel:804368628861763664> | Hay otra persona jugando en este servidor.' })

        sendEmbed({
            channel: message.channel,
            description: `<a:waiting:804396292793040987> | ${usuario} tienes 1 minuto para responder...\n¿Quieres jugar?: ~~responde "s"~~\n¿No quieres?: ~~responde "n"~~`
        });

        message.guild.partida = new tresenraya.partida({ jugadores: [message.author.id, usuario.id] });

        if (usuario.id == client.user.id) {

            setTimeout(() => {

                message.channel.send('s')

            }, 3000)

        }

        let respuesta = await awaitMessage({ channel: message.channel, filter: (m) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), time: (1 * 60) * 1000, max: 1 }).catch(() => { })

        if (!respuesta) {
            sendEmbed({
                channel: message.channel,
                description: `😔 | ${usuario} no respondió...`
            })
            return message.guild.partida = undefined;
        }

        if (respuesta.first().content == 'n') {
            sendEmbed({
                channel: message.channel,
                description: '😔 | Rechazó la invitación...'
            })
            return message.guild.partida = undefined;
        }

        const { partida } = message.guild;

        partida.on('ganador', async (jugador, tablero, paso) => {
            message.guild.partida = undefined;
            return sendEmbed({
                channel: message.channel,
                description: `<:zsUHHHHHH:649036589195853836> | ¡Ha ganado ${client.users.cache.get(jugador).username}!\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes, true), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
        });

        partida.on('empate', async (jugadores, tablero, paso) => {
            message.guild.partida = undefined;
            return sendEmbed({
                channel: message.channel,
                description: `<:wtfDuddd:797933539454091305> | Un empate entre ${jugadores.map(user => client.users.cache.get(user).username).join(' y ')}!\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });

        });

        partida.on('finalizado', async (jugadores, tablero, paso) => {
            message.guild.partida = undefined;
            return sendEmbed({
                channel: message.channel,
                description: `<:wtfDuddd:797933539454091305> | Tiempo excedido!\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
        })

        await sendEmbed({
            description: `🤔 | Empieza ${client.users.cache.get(partida.turno.jugador).username}, elige un número del 1 al 9 [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`,
            channel: message.channel,
            attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
            imageURL: 'attachment://tictactoe.gif'
        });

        if (partida.turno.jugador == client.user.id) partida.elegir(4)

        await sendEmbed({
            channel: message.channel,
            description: `😆 | Turno de ${client.users.cache.get(partida.turno.jugador).username} [\`${partida.turno.ficha}\`]\n\n ${partida.tablero.string}`,
            attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
            imageURL: 'attachment://tictactoe.gif'
        })

        const colector = message.channel.createMessageCollector(msg => msg.author.id === partida.turno.jugador && !isNaN(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 9) && partida.disponible(msg.content) && !partida.finalizado, { time: (10 * 60) * 1000 });

        colector.on('collect', async (msg) => {
            partida.elegir(msg.content);
            if (partida.finalizado) {
                colector.stop();
                delete message.numero;
                return;
            }

            if (partida.turno.jugador != client.user.id)
                await sendEmbed({
                    channel: msg.channel,
                    description: `😆 | Turno de ${client.users.cache.get(partida.turno.jugador).username} [\`${partida.turno.ficha}\`]\n\n ${partida.tablero.string}`,
                    attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                    imageURL: 'attachment://tictactoe.gif'
                })

            if (partida && !partida.finalizado) {
                let disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
                let jugada = disponibles[Math.floor(Math.random() * disponibles.length)]
                partida.elegir(jugada)
                if (partida && !partida.finalizado) {
                    await sendEmbed({
                        channel: msg.channel,
                        description: `😆 | Turno de ${client.users.cache.get(partida.turno.jugador).username} [\`${partida.turno.ficha}\`]\n\n ${partida.tablero.string}`,
                        attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                        imageURL: 'attachment://tictactoe.gif'
                    })
                }
            }

        });
        colector.on('end', () => !partida || partida.finalizado ? null : partida.emit('finalizado', partida.jugadores, partida.tablero, partida.paso))
        return true;
    }
}