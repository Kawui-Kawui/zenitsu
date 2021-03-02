const Discord = require("discord.js");
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.VoiceState} oldState 
 * @param {Discord.VoiceState} newState 
 */
module.exports = async (client, oldState, newState) => {

    const guild = newState.guild;
    let data = guild.cacheVoiceLogs || (await require('../../models/logsmember').findOne({ id: guild.id }))
    if (!data) return;
    guild.cacheVoiceLogs = data;

    if (oldState.channel && !newState.channel) {
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setAuthor(oldState?.member?.user?.tag || '\u200b', oldState.member?.user?.displayAvatarURL({ dynamic: true }) || 'https://media.discordapp.net/attachments/541473170105040931/816408806778470490/unknown.png')
            .setDescription(`Un miembro ha salido del canal de voz llamado: ${oldState.channel.name}`)

        try {
            let wbk = new Discord.WebhookClient(guild.cacheVoiceLogs.idWeb, guild.cacheVoiceLogs.tokenWeb)
            wbk.send({ embeds: [embed] }).catch(() => { })
        } catch {
            ''
        }
    }

    else if (!oldState.channel && newState.channel) {
        let embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTimestamp()
            .setAuthor(oldState?.member?.user?.tag || '\u200b', oldState.member?.user?.displayAvatarURL({ dynamic: true }) || 'https://media.discordapp.net/attachments/541473170105040931/816408806778470490/unknown.png')
            .setDescription(`Un miembro ha entrado al canal de voz llamado: ${newState.channel.name}`)

        try {
            let wbk = new Discord.WebhookClient(guild.cacheVoiceLogs.idWeb, guild.cacheVoiceLogs.tokenWeb)
            wbk.send({ embeds: [embed] }).catch(() => { })
        } catch {
            ''
        }
    }

    else if ((newState.channel && oldState.channel) && (oldState.channelID != newState.channelID)) {

        let embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp()
            .setAuthor(oldState?.member?.user?.tag || '\u200b', oldState.member?.user?.displayAvatarURL({ dynamic: true }) || 'https://media.discordapp.net/attachments/541473170105040931/816408806778470490/unknown.png')
            .setDescription(`Un miembro ha entrado al canal de voz llamado: ${newState.channel.name} y salio de ${oldState.channel.name}`)

        try {
            let wbk = new Discord.WebhookClient(guild.cacheVoiceLogs.idWeb, guild.cacheVoiceLogs.tokenWeb)
            wbk.send({ embeds: [embed] }).catch(() => { })
        } catch {
            ''
        }
    }

}