import { Command } from 'axoncore';

class Prefix extends Command {
    constructor(module) {
        super(module);

        this.label = 'prefix';

        this.infos = {
            owner: ['Null'],
            description: 'Set or view server prefix',
            usage: 'prefix (new prefix)'
        };

        this.options.guildOnly = true;
    }

    async execute({ msg, args, guildConf }) {
        if (!args[0]) {
            let prefix;

            try {
                prefix = guildConf.prefix[0];
            } catch {
                prefix = this.axon.params[0]
            }

            return this.sendMessage(msg.channel, this.axon.LangClass.fetchSnippet('prefix_show', { guildConf, guild: msg.channel.guild, custom: prefix } ) );
        }

        if (!msg.member.permission.has('manageGuild' || 'administrator') && msg.member.id !== msg.channel.guild.ownerID && !this.axon.staff.admins.includes(msg.member.id) && !this.axon.staff.owners.includes(msg.member.id)) {
            return this.sendMessage(msg.channel, this.axon.LangClass.fetchSnippet('prefix_perms', { guildConf }) );
        }

        let prefix = args[0];
        if (args[0].match(/{space}$/)) {
            prefix = args[0].replace(/{space}$/, ' ');
        }

        if (prefix.length >= 6) return this.sendMessage(msg.channel, this.axon.LangClass.fetchSnippet('prefix_limit', { guildConf }) );

        this.axon.registerGuildPrefix(msg.channel.guild.id, [prefix]);
        return this.sendMessage(msg.channel, this.axon.LangClass.fetchSnippet('prefix_updated', { guildConf, custom: prefix }) );
    }
}

export default Prefix;
