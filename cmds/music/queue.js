const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "queue", //Nombre del cmd
        alias: ['q'], //Alias
        description: "Ver la cola de reproduccion", //Descripción (OPCIONAL)
        usage: "z!queue",
        category: 'musica'
    },
    run: ({ message, client, args, embedResponse }) => {

        let seleccion = (num) => {
            if (!num || !parseInt(num) || 0 >= parseInt(num))
                return 1

            else
                return parseInt(num);

        }


        let queue = message.guild.getQueue();

        if (!queue || !queue.songs || !queue.songs[0])
            return embedResponse(`No hay canciones en cola.`)

        let num = 5;

        queue = funcionPagina(queue.songs, num);
        if (!queue[seleccion(args[0]) - 1])
            return embedResponse(`No hay canciones en la pagina ${seleccion(args[0])}.`)

        let supernp = queue;
        queue = queue[seleccion(args[0]) - 1].map((a, i) => {

            return `[${a.fromPlaylist ? `<:mc_song:786660726914678834>` : '<a:songDJ:786662120388296724>'}][${(i + 1) + num * (seleccion(args[0]) <= 0 ? 1 : seleccion(args[0]) - 1)}] [${a.name}](${a.url}) - ${a.formattedDuration} - ${a.user.toString()}`

        });

        let np = supernp[0][0];
        let embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor(`Reproduciendo ahora`)
            .setDescription(`[${np.name}](${np.url}) - ${np.formattedDuration}\n\n*\`En cola:\`*\n\n${queue.join('\n') || 'No hay ninguna cancion.'}`)
            .setTimestamp()
            .setFooter(`Pagina ${seleccion(args[0])} de ${supernp.length}.`)
            .setThumbnail('https://media1.tenor.com/images/869a5e483261d0b8e4f296b1152cba8e/tenor.gif?itemid=15940704');

        return message.channel.send({ embed: embed })

    }
}

function funcionPagina(elArray, num = 10) {
    let pagina = [];
    for (let i = 0; i < elArray.length; i += num) {
        pagina.push(elArray.slice(i, i + num))
    }
    return pagina;
}