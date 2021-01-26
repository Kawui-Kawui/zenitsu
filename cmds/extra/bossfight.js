const statusA = new Map();
const Discord = require('discord.js');
const Command = require('../../Utils/Classes').Command;
module.exports = class Comando extends Command {
    constructor() {
        super()
        this.name = "bossfight"
        this.category = 'extra'
    }
    async run({ client, message, embedResponse }) {

        let data = await client.getData({ id: message.author.id }, 'demonios')
        let { cooldown } = data;

        let prob = Math.floor(Math.random() * 99) + 1;

        if (cooldown > Date.now())
            return embedResponse('No puedo ir a la batalla ahora.\n\nTiempo restante: ' + require('ms')(cooldown - Date.now()))

        if (!statusA.get(message.author.id)) {

            statusA.set(message.author.id, { status: true });

        }

        else {
            return embedResponse('Ya estas peleando contra el jefe!')
        }

        embedResponse('Estas peleando contra el jefe!');

        await Discord.Util.delayFor(5000);

        if (prob >= 60) {

            statusA.delete(message.author.id);
            let datazo = await client.updateData({ id: message.author.id }, { $inc: { jefes: 1 } }, 'demonios')
            embedResponse(`Le has ganado al Jefe!\n\nJefes derrotados: ${datazo.jefes}`)

        }
        else {

            statusA.delete(message.author.id);
            return embedResponse(`Has perdido contra el enemigo.`)
        }
    }
}