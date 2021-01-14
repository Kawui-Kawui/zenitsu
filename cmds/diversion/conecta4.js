const Connect4 = require('connect4-ai/lib/Connect4');
const { MessageAttachment } = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { sendEmbed, displayConnectFourBoard, awaitMessage } = require('../../Utils/Functions');
module.exports = {
    config: {
        name: "conecta4", //Nombre del cmd
        alias: [`connect4`, 'fourinrow', '4enlinea'], //Alias
        description: "Jugar el famoso juego conecta 4", //Descripción (OPCIONAL)
        usage: "z!channel",
        category: 'utiles'
    },

    /**
    * @param { Object } obj
    * @param { Discord.Message } obj.message
    */

    run: async (obj) => {

        const { message } = obj;

        if (message.guild.game)
            return sendEmbed({ channel: message.channel, description: ':x: | Hay otra persona jugando en este servidor!' })

        let usuario = message.mentions.users.first();

        if (!usuario || usuario.id == message.author.id || usuario.bot)
            return sendEmbed({
                channel: message.channel,
                description: `<:cancel:779536630041280522> | Menciona a un miembro para jugar!`
            });

        message.guild.game = new Connect4();

        await sendEmbed({
            channel: message.channel,
            description: `<a:amongushappy:798373703880278016> | ${usuario} tienes 1 minuto para responder...\n¿Quieres jugar?: ~~responde "s"~~\n¿No quieres?: ~~responde "n"~~`
        });

        let respuesta = await awaitMessage({ channel: message.channel, filter: (m) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), time: (1 * 60) * 1000, max: 1 }).catch(() => { })

        if (!respuesta) {
            message.guild.game = undefined;
            return sendEmbed({
                channel: message.channel,
                description: `😔 | ${usuario} no respondió...`
            })
        }

        if (respuesta.first().content == 'n') {
            message.guild.game = undefined;
            return sendEmbed({
                channel: message.channel,
                description: '😔 | Rechazó la invitación...'
            })
        }

        usuario.TURNO = Math.floor(Math.random() * 2) + 1;
        message.author.TURNO = usuario.TURNO == 2 ? 1 : 2;
        let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game);
        let att = new MessageAttachment(res, '4enraya.gif')
        sendEmbed({
            attachFiles: att,
            channel: message.channel,
            imageURL: 'attachment://4enraya.gif',
            description: `🤔 | Empieza ${message.author.TURNO == 1 ? message.author.tag : usuario.tag}, elige un numero del 1 al 7. [\`🔴\`]`
        })
        const colector = message.channel.createMessageCollector(msg => msg.author.TURNO === msg.guild.game.gameStatus().currentPlayer && !isNaN(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 7) && message.guild.game.canPlay(parseInt(msg.content) - 1) && !message.guild.game.gameStatus().gameOver, { time: (10 * 60) * 1000 });

        colector.on('collect', async (msg) => {

            msg.guild.game.play(parseInt(msg.content) - 1)
            if (msg.guild.game.gameStatus().gameOver && msg.guild.game.gameStatus().solution) {
                let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game);
                let att = new MessageAttachment(res, '4enraya.gif')
                sendEmbed({
                    description: `<:zsUHHHHHH:649036589195853836> | ${msg.author.tag} ha ganado la partida!`,
                    channel: msg.channel,
                    attachFiles: att,
                    imageURL: 'attachment://4enraya.gif'
                })
                msg.guild.game = undefined;
                return colector.stop();
            }

            else if (msg.guild.game.gameStatus().gameOver) {
                let res = await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), msg.guild.game);
                let att = new MessageAttachment(res, '4enraya.gif')
                sendEmbed({
                    channel: msg.channel,
                    description: `<:wtfDuddd:797933539454091305> | Un empate entre ${usuario.tag} y ${message.author.tag}!`,
                    attachFiles: att,
                    imageURL: 'attachment://4enraya.gif'
                })
                msg.guild.game = undefined;
                return colector.stop();
            }

            let res = await displayConnectFourBoard(displayBoard(msg.guild.game.ascii()), msg.guild.game);
            let att = new MessageAttachment(res, '4enraya.gif')

            await sendEmbed({
                channel: msg.channel,
                attachFiles: att,
                description: `😆 | Turno de ${message.author.TURNO == msg.author.TURNO ? usuario.tag : message.author.tag} [${msg.author.TURNO == 2 ? "`🔴`" : "`🟡`"}]`,
                imageURL: 'attachment://4enraya.gif'
            })
        })
        colector.on('end', async () => {
            if (message.guild.game) {
                sendEmbed({
                    channel: message.channel,
                    description: `<:wtfDuddd:797933539454091305> | Tiempo excedido!`,
                    attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(message.guild.game.ascii()), message.guild.game), '4enraya.gif'),
                    imageURL: 'attachment://4enraya.gif'
                })
                return message.guild.game = undefined;
            }
        })
    }
}
/**
 * 
 * @param {String} board 
 * @returns {Array<Array<String>>}
 */

function displayBoard(board) {
    /*
        RegEx: https://portalmybot.com/code/D519u4BFb0
    */
    let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    let res = board
        .split('1').join('🟢')
        .split('2').join('🟡')
        .split(' - ').join('⬛')
        .split('---------------------')
        .join('')
        .split('[0]')[0]
        .split(' ').join('')
        .split('\n')
        .filter(item => item.length)
        .map(a => a.match(regex))
    return res;

}