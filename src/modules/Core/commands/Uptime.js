import { Command } from 'axoncore';
import moment from 'moment';

class Uptime extends Command {
    constructor(module) {
        super(module);
        this.label = 'uptime';
        this.aliases = ['up'];

        this.infos = {
            owner: ['Null'],
            description: 'Sends some uptime information',
        };

        this.enabled = true;
        this.serverBypass = true;
    }

    execute( { msg } ) {
        return this.sendMessage(msg.channel, {
            embed: {
                title: 'Uptime',
                description: moment.duration(this.axon.client.uptime).format('MMMM [Months,] WW [Weeks,] DD [Days,] h [Hours,] m [Minutes,] s [Seconds]'),
                fields: [
                    {
                        name: 'Online Since',
                        value: moment(this.axon.client.startTime).format('dddd MMMM Do h:m A'),
                        inline: true,
                    },
                ],
                color: this.axon.configs.template.embed.colors.help,
            },
        } );
    }
}

export default Uptime;
