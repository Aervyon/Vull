import { Command } from 'axoncore';

class List extends Command {
    constructor(module) {
        super(module);
        this.label = 'list';

        this.infos = {
            name: 'apings list',
            owners: ['Null'],
            description: 'List users subscribed to aPings',
            usage: 'apings list',
        };

        this.isSubcmd = true;
    }

    execute( { msg, guildConf } ) {
        if (!guildConf.apings) return this.sendError(msg.channel, 'aPings is not setup!');
        let { users } = guildConf.apings;

        if (!users || users.length === 0) return this.sendMessage(msg.channel, 'No users found!');

        if (users.join('\n').length > 1024) {
            users = users.join('\n').slice(0, 1024).split('\n');
        }

        return this.sendMessage(msg.channel, {
            embed: {
                title: 'Users subscribe to apings',
                description: users.join('\n'),
                color: this.axon.configs.template.embed.colors.help,
            },
        } );
    }
}

export default List;
