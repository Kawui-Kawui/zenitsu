// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js")
const { replace } = require('../../Utils/Functions.js');
module.exports = {
    config: {
        name: "eval",
        alias: ['e'],
        description: "eval a code",
        usage: "z!eval return 1+1",
        category: 'developer',
        botPermissions: [],
        memberPermissions: []

    },
    // eslint-disable-next-line no-unused-vars
    run: async ({ client, message, args, embedResponse, Hora }) => {

        if (!client.devseval.includes(message.author.id))
            return;
        try {
            let code = args.join(" ");
            let evalued = await eval(`(async() => {${code}})()`);
            let asd = typeof (evalued)
            evalued = require("util").inspect(evalued, { depth: 0 });
            evalued = replace(evalued, [client.token, process.env.MONGODB, process.env.WEBHOOKID, process.env.WEBHOOKTOKEN])
            message.channel.send(`(${asd}) ${evalued}`, { code: 'js', split: { char: '', maxLength: 1900 } })
        } catch (err) {
            message.channel.send(err, { code: 'js' })
        }
    }
}