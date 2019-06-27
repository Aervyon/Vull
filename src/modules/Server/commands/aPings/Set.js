import { Command, Resolver } from 'axoncore';
import Show from './Set_Show';
import Guild from '../../../../../models/Guild';

class Settings extends Command {
    constructor(module) {
        super(module);
        // Handle naing
        this.label = 'settings';
        this.aliases = ['set'];

        // Handle subcommands
        this.hasSubcmd = true;
        this.subcmds = [Show];
        this.isSubcmd = true;

        // Handle information
        this.infos = {
            owners: ['Null'],
            description: 'Set apings guild settings',
            usage: 'apings settings [enable/disable] (channel)',
            examples: ['apings settings enabled', 'apings settings disabled #testing'],
            name: 'apings settings',
        };

        // Handle MISC things
        this.options.guildOnly = true;
        this.permissions.serverAdmin = true;
        this.options.argsMin = 1;
    }

    async execute( { msg, args, guildConf } ) {
        if (!Guild) {
            throw Error('Model Guild is not defined');
        }

        if (!['enable', 'disable'].includes(args[0] ) ) {
            return this.sendError(msg.channel, 'Invalid status');
        }

        if (!guildConf.apings) guildConf.apings = {};
        const { apings } = guildConf;

        let channel = apings.channel || msg.channel.id;

        if (args[1] ) {
            channel = Resolver.channel(msg.channel.guild, args[1] );
            if (!channel) return this.sendError(msg.channel, 'Channel not found!');
        }

        const users = apings.users || [];
        const status = args[0] === 'enable';
        const cooldownUsers = apings.cooldownUsers || [];

        await Guild.findOneAndUpdate( { guildID: msg.channel.guild.id }, { $set: { apings: { users, channel, status, cooldownUsers } } } );
        const guild = await Guild.findOne( { guildID: msg.channel.guild.id } );

        return this.subCommands.get('show').execute( { msg, guildConf: guild } );
    }
}

export default Settings;
