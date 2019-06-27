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

            return this.sendMessage(msg.channel, `The prefix for ${msg.channel.guild.name} is: \`${prefix}\`.`);
        }

        if (!msg.member.permission.has('manageGuild' || 'administrator') && msg.member.id !== msg.channel.guild.ownerID && !this.axon.staff.admins.includes(msg.member.id) && !this.axon.staff.owners.includes(msg.member.id)) return this.sendMessage(msg.channel, 'You do not have the permissions to execute this command! You need either: `manage server`, `administrator`, or you need to be a bot owner/admin');

        let prefix = args[0];
        if (args[0].match(/{space}$/)) {
            prefix = args[0].replace(/{space}$/, ' ');
        }

        if (prefix.length >= 6) return this.sendMessage(msg.channel, 'Prefixes can have no more than 6 characters');

        this.axon.registerGuildPrefix(msg.channel.guild.id, [prefix]);
        return this.sendMessage(msg.channel, `Updated your prefix to \`${prefix}\`.`)
    }
}

export default Prefix;
