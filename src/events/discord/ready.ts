import Cliente from "../../Utils/Classes/client";
import svg from 'node-svg2img'
import { promisify } from 'util'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import axios from 'axios'
import { TextChannel } from 'discord.js-light'
import snipe from '../../models/snipe';
async function get() {

    let fetch: string = await axios(`https://github.com/marcrock22/zenitsu`).then(res => res.data);
    let arr = fetch.split('js-details-container Details')
    return arr[arr.length - 1].match(/title=\"(([A-Z])|\.){1,99}\".data\-/gmi).map(item => item.slice(7).slice(0, -7)).slice(0)

}
async function event(client: Cliente) {

    const buffer = await promisify(svg)(`https://top.gg/api/widget/721080193678311554.svg`)
    const path = join(__dirname, '..', '..', '..', 'Images', 'topgg.png');
    await writeFile(path, buffer);
    await client.setPresence();
    console.log(`${client.user.tag} está listo :):):):):).`)

    setInterval(async () => {
        client.setPresence();

        //Delete snipes
        const find = await snipe.find();
        for (let data of find) {
            if (!data.date || (data.date + 432000000 < Date.now())) //5 días.
                await snipe.deleteOne({
                    id: data.id,
                    mensaje: data.mensaje,
                    avatarURL: data.avatarURL,
                    nombre: data.nombre,
                    date: data.date
                });

            //Post stats to top.gg
            await client.dbl.postStats(client.guilds.cache.size);
        }

    }, ((60 * 30) * 1000));//30m

    const webhook = await (client.channels.cache.get(`832735151309848596`) as TextChannel).fetchWebhooks().then(we => we.first())

    const preRes = await get();
    const res = [];
    const emojis = {
        Images: `📁`,
        src: `😋`,
        handler: `⛏`,
        '.eslintrc.json': `🗃️`,
        '.gitignore': `👁️`,
        'Aptfile': `❓`,
        'COMIC.TTF': `📰`,
        LICENSE: `👮‍♀️`,
        'Minecrafter.Reg.ttf': `📰`,
        'OpenSansEmoji.ttf': `📰`,
        'README.md': `👉`,
        'package.json': `🗃️`,
    };

    for (let file of preRes) {

        const papush = emojis[file] ? `${emojis[file]} ${file}` : file;

        res.push(papush);

    }

    client.editWebhookMessage({
        id: webhook.id,
        token: webhook.token,
        messageID: '834586549781135380',
        data: {
            content: '```' + res.join('\n') + '```', embeds: [{
                description: `Source code: https://github.com/marcrock22/zenitsu`
            }]
        }
    });

}

export default event;