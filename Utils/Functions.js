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
    const encoder = new GIFEncoder(300, 300);
    let fondo = 'https://cdn.discordapp.com/attachments/730181305433587744/797923952583245894/unknown.png'

    const canvas = Canvas.createCanvas(300, 300);

    const ctx = canvas.getContext('2d');

    let bck = await Canvas.loadImage(fondo)

    ctx.drawImage(bck, 0, 0, canvas.width, canvas.height)

    const img = {
        '❌': await Canvas.loadImage(`https://cdn.discordapp.com/attachments/730181305433587744/798284234598121507/X_de_tic_tac_toe.png`),
        '⭕': await Canvas.loadImage(`https://cdn.discordapp.com/attachments/730181305433587744/798284232354824222/O_de_tic_tac_toe.png`)
    }

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
            ctx.drawImage(IMAGEN, 110, 110, 85, 85)
        }
        else if (i == 5) {
            ctx.drawImage(IMAGEN, 210, 110, 85, 85)
        }
        else if (i == 6) {
            ctx.drawImage(IMAGEN, 10, 210, 85, 85)
        }
        else if (i == 7) {
            ctx.drawImage(IMAGEN, 110, 210, 85, 85)
        }
        else if (i == 8) {
            ctx.drawImage(IMAGEN, 210, 210, 85, 85)
        }
        continue;
    }

    // IZQUIERDA A DERECHA

    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 300);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 300);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 300);
    ctx.stroke();

    // IZQUIERDA A DERECHA

    // ARRIBA A ABAJO

    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(300, 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(300, 300);
    ctx.stroke();


    // ARRIBA A ABAJO

    ctx.font = '73px sans-serif'

    //ctx.fillText(mapatest.map((_, i) => i == 2 || i == 5 ? `${_}\n` : _).join(''), 0, 80)

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

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(25, 275);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(50, 250);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(75, 225);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(100, 200);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(125, 175);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(150, 150);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(175, 125);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(200, 100);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(225, 75);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(250, 50);
                ctx.lineTo(10, 290);
                ctx.strokeStyle = whowin()
                ctx.stroke();
                encoder.addFrame(ctx)

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
    if (win && stream) {
        return await require('util').promisify(module.exports.buffer)(stream)
    }
    return attachment;

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