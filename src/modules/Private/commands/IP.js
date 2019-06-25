import { Command } from 'axoncore';
import superagent from 'superagent';

class IP extends Command {
    constructor(module) {
        super(module);
        this.label = 'ip';

        this.infos = {
            owners: ['Null'],
            description: 'Get the IP of the machine Vull is on',
        };

        this.serverBypass = true;

        this.permissions.staff.needed = this.axon.staff.owners;
    }

    async execute( { msg } ) {
        const seconds = 4000;
        const ip = await superagent.get('bot.whatismyipaddress.com');

        const messg = await this.sendMessage(msg.channel, ip.text);
        await this.axon.Utils.sleep(seconds);
        messg.delete();
        return Promise.resolve();
    }
}

export default IP;
