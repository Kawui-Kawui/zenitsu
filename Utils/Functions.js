// eslint-disable-next-line no-unused-vars
const Classes = require('./Classes.js');
const GIFEncoder = require('gifencoder');
/**
 * @param {Classes.embedOptions} object 
 * @param {Object} options
 * @param {Number} options.timestamp
 * @returns {Promise<Discord.Message>}
 * @example
 * sendEmbed({channel: message.channel, description: 'Hola!', color: 'RANDOM'})
 */
module.exports.sendEmbed = (object = {}, options = { timestamp: Date.now() }) => {

    let embed = new (require('discord.js')).MessageEmbed()

    let { attachFiles, titleURL, fields, description, imageURL, footerLink, footerText, color, channel, title, thumbnailURL, authorURL, authorText, authorLink } = object;

    fields && fields.length ? fields.map(a => embed.addField(a[0], a[1], a[2] ? true : false)) : false
    if (description) embed.setDescription(description)
    if (imageURL) embed.setImage(imageURL);
    if (thumbnailURL) embed.setThumbnail(thumbnailURL)
    if (footerLink && footerText) embed.setFooter(footerText, footerLink)
    else {
        if (footerText) embed.setFooter(footerText)
        if (footerLink) embed.setFooter('\u200b', footerLink)
    }
    if (authorText && authorLink && authorURL) embed.setAuthor(authorText, authorLink, authorURL)
    else if (authorText && authorLink) embed.setAuthor(authorText, authorLink)
    embed.setColor(color ? color : '#E09E36')
    if (title) embed.setTitle(title)
    if (titleURL) embed.setURL(titleURL)
    if (options.timestamp) embed.setTimestamp(options.timestamp)
    if (attachFiles) embed.attachFiles(attachFiles);
    if (!channel || !channel.send) throw new Error('No es un canal valido.');
    return channel.send({ embed: embed });

};

const Canvas = require('canvas');

/**
 * 
 * @param {String} string 
 * @param {Array} array
 * @returns {String}
 * @example
 * replace('tokenn', ['token']) //[PRIVATE]n
 */
module.exports.replace = function (string, array) {

    let res = string;

    for (let i of array) {
        res = res.split(i).join('[PRIVATE]')
    }

    return res;

}
/**
 * 
 * @param {Array<string>} mapatest 
 * @param {Boolean} win
 * @returns {Promise<Buffer>}
 * @example
 * mapaCanvas(partida.tablero.array)
 */

module.exports.mapaCanvas = async function (mapatest, win = false) {
    let modelo = require('../models/attachment.js');
    let numeros = [
        '1️⃣', '2️⃣', '3️⃣',
        '4️⃣', '5️⃣', '6️⃣',
        '7️⃣', '8️⃣', '9️⃣'
    ]

    let soniguales = mapatest.every((_, i) => _ == numeros[i]);

    if (!soniguales) {
        let check = await modelo.findOne({ mapa: mapatest });

        if (check)
            return check.Attachment.buffer;
    }
    const encoder = new GIFEncoder(300, 300);

    const canvas = Canvas.createCanvas(300, 300);

    const ctx = canvas.getContext('2d');

    let bck = await Canvas.loadImage(`/home/MARCROCK22/zenitsu/Utils/Images/inicio_tictactoe.gif`)
    ctx.drawImage(bck, 0, 0, canvas.width, canvas.height)

    const img = {
        '❌': await Canvas.loadImage(`https://cdn.discordapp.com/attachments/730181305433587744/798284234598121507/X_de_tic_tac_toe.png`),
        '⭕': await Canvas.loadImage(`https://cdn.discordapp.com/attachments/730181305433587744/798284232354824222/O_de_tic_tac_toe.png`)
    }

    if (!soniguales) {
        for (let i in mapatest) {
            let IMAGEN = img[mapatest[i]]
            if (!IMAGEN) continue;
            if (i == 0) {
                ctx.drawImage(IMAGEN, 10, 5, 85, 85)
            }
            else if (i == 1) {
                ctx.drawImage(IMAGEN, 110, 5, 85, 85)
            }
            else if (i == 2) {
                ctx.drawImage(IMAGEN, 210, 5, 85, 85)
            }
            else if (i == 3) {
                ctx.drawImage(IMAGEN, 10, 110, 85, 85)
            }
            else if (i == 4) {
                ctx.drawImage(IMAGEN, 110, 105, 85, 85)
            }
            else if (i == 5) {
                ctx.drawImage(IMAGEN, 210, 110, 85, 85)
            }
            else if (i == 6) {
                ctx.drawImage(IMAGEN, 10, 205, 85, 85)
            }
            else if (i == 7) {
                ctx.drawImage(IMAGEN, 110, 205, 85, 85)
            }
            else if (i == 8) {
                ctx.drawImage(IMAGEN, 210, 205, 85, 85)
            }
            continue;
        }
    }

    ctx.font = '73px sans-serif'

    const pos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];// posibles posiciones para ganar.

    let positions = pos.find(p => p.every(x => mapatest[x] == '❌')) || pos.find(p => p.every(x => mapatest[x] == '⭕'))//Buscando las posiciones con las cuales se gano.

    /**
     * @returns {String}
     */
    let whowin = () => {

        return pos.find(p => p.every(x => mapatest[x] == '❌')) ? '#b24443' : pos.find(p => p.every(x => mapatest[x] == '⭕')) ? '#257f9e' : '#000000';

    }

    let stream = null;
    positions = !positions && !Array.isArray(positions) ? [] : positions

    switch (positions.join('')) {

        case [0, 1, 2].join(''):

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(5, 50);
                    ctx.lineTo(i, 50);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(5, 50);
                ctx.lineTo(295, 50);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(5, 50);
            ctx.lineTo(295, 50);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;

        case [3, 4, 5].join(''):

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(5, 150);
                    ctx.lineTo(i, 150);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(5, 150);
                ctx.lineTo(295, 150);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(5, 153);
            ctx.lineTo(295, 153);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;

        case [6, 7, 8].join(''):

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(5, 250);
                    ctx.lineTo(i, 250);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(5, 250);
                ctx.lineTo(295, 250);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(5, 250);
            ctx.lineTo(295, 250);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;

        case [0, 3, 6].join(''):

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(50, 5);
                    ctx.lineTo(50, i);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(50, 5);
                ctx.lineTo(50, 295);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(50, 5);
            ctx.lineTo(50, 295);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;

        case [1, 4, 7].join(''):

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(150, 5);
                    ctx.lineTo(150, i);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(150, 5);
                ctx.lineTo(150, 295);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(152, 5);
            ctx.lineTo(152, 295);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;
        case [2, 5, 8].join(''):

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(250, 5);
                    ctx.lineTo(250, i);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(250, 5);
                ctx.lineTo(250, 295);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(250, 5);
            ctx.lineTo(250, 295);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;
        case [0, 4, 8].join(''):
            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
                for (let i = 25; i <= 275; i += 25) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(10, 10);
                    ctx.lineTo(i, i);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)
                }
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(10, 10);
                ctx.lineTo(290, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish();
                break;
            }

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(10, 5);
            ctx.lineTo(290, 285);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;
        case [2, 4, 6].join(''):

            // eslint-disable-next-line no-case-declarations
            //            const values = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275];

            if (win) {
                stream = encoder.createReadStream()
                encoder.start();
                encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(1);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.

                let values = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275]

                let ultravalues = [275, 250, 225, 200, 175, 150, 125, 100, 75, 50, 25];

                for (let i in values) {
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(values[i], ultravalues[i]);
                    ctx.lineTo(10, 290);
                    ctx.strokeStyle = whowin()
                    ctx.stroke();
                    encoder.addFrame(ctx)

                }

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(290, 10);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)
                encoder.finish()
                break;
            }
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(10, 290);
            ctx.lineTo(290, 10);
            ctx.strokeStyle = whowin()
            ctx.stroke();
            break;

        default:
            if (win) {
                ctx.font = '25px sans-serif'
                ctx.fillText('Si ves esto reportar!', 50, 110)
                break;
            }
    }

    const attachment = canvas.toBuffer()
    let final;
    if (win && stream) {
        final = await require('util').promisify(module.exports.buffer)(stream)
    }
    else {
        final = attachment
    }
    if (!soniguales) {
        await modelo.create({ mapa: mapatest, Attachment: final })
    }
    return final;

}


/**
 * @async
 * @param {Object} obj
 * @param {import('discord.js').CollectorFilter} obj.filter
 * @param {import("discord.js").TextChannel} obj.channel
 * @param {Number} obj.max
 * @param {Number} obj.time
 * @returns {Promise<import('discord.js').Collection<import('discord.js').Snowflake, import('discord.js').Message>>}
 */

function awaitMessage(obj) {
    const { filter, channel, max, time } = obj;
    if (!channel || !channel.awaitMessages) throw new Error('Canal invalido')
    return new Promise((resolve, reject) => {
        channel.awaitMessages(filter, { max: max ? max : 1, time: time ? time : require('ms')('60s'), errors: ['time'] })
            .then(collected => resolve(collected))
            .catch((c) => c.size ? resolve(c) : reject('TIME'))
    });
}

module.exports.awaitMessage = awaitMessage;


exports.array = toArray
exports.buffer = toBuffer

function toArray(stream, callback) {
    let arr = []

    stream.on('data', onData)
    stream.once('end', onEnd)
    stream.once('error', callback)
    stream.once('error', cleanup)
    stream.once('close', cleanup)

    function onData(doc) {
        arr.push(doc)
    }

    function onEnd() {
        callback(null, arr)
        cleanup()
    }

    function cleanup() {
        arr = null
        stream.removeListener('data', onData)
        stream.removeListener('end', onEnd)
        stream.removeListener('error', callback)
        stream.removeListener('error', cleanup)
        stream.removeListener('close', cleanup)
    }

    return stream
}

function toBuffer(stream, callback) {
    toArray(stream, function (err, arr) {
        if (err || !arr)
            callback(err)
        else
            callback(null, Buffer.concat(arr))
    })

    return stream
}


/**
 * @async
 * @param {Array<Array<String>>} mapa
 * @param {import('connect4-ai/lib/Connect4')} game
 * @returns {Promise<Buffer>}
 */

async function displayConnectFourBoard(mapa, game) {
    const toBuffer = require('util').promisify(module.exports.buffer);
    const encoder = new GIFEncoder(700, 600);
    const stream = encoder.createReadStream()
    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(200);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.
    mapa = mapa.map(a => a.map(e => e.replace('⬛', '⚪')))
    const win = await Canvas.loadImage('/home/MARCROCK22/zenitsu/Utils/Images/morado_de_4.png')
    const bck = await Canvas.loadImage('/home/MARCROCK22/zenitsu/Utils/Images/4enraya.png')
    const imgs = {
        "🟢": await Canvas.loadImage('/home/MARCROCK22/zenitsu/Utils/Images/rojo_de_cuatro.png'),
        "🟡": await Canvas.loadImage('/home/MARCROCK22/zenitsu/Utils/Images/amarillo_de_cuatro.png')
    }
    const canvas = Canvas.createCanvas(700, 600)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bck, 0, 0, 700, 600)
    const columna = {
        "0": 10,
        "1": 110,
        "2": 210,
        "3": 310,
        "4": 410,
        "5": 510,
        "6": 610,
    },
        fila = {
            "0": 10,
            "1": 110,
            "2": 210,
            "3": 310,
            "4": 410,
            "5": 510
        },
        filaR = {
            "0": 510,
            "1": 410,
            "2": 310,
            "3": 210,
            "4": 110,
            "5": 10
        }

    ctx.font = '25px sans-serif';

    for (let i of [0, 1, 2, 3, 4, 5, 6]) {
        ctx.fillText(i + 1, columna[i] + 25, 590)
    }

    let numero = 0;
    for (let i of mapa) {
        let lugar = 0;
        for (let j of i) {
            if (imgs[j]) {
                ctx.drawImage(imgs[j], columna[lugar] + 10, fila[numero] + 10, 50, 50)
            } lugar++
        }
        numero++
    }

    encoder.addFrame(ctx)

    if (game.solution) {
        for (let i of game.solution) {
            ctx.drawImage(win, columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
        for (let i of game.solution) {
            ctx.drawImage(game.winner == 1 ? imgs['🟢'] : imgs['🟡'], columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
        for (let i of game.solution) {
            ctx.drawImage(win, columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
    }
    encoder.finish();
    return await toBuffer(stream);

}

module.exports.displayConnectFourBoard = displayConnectFourBoard;