import { Command } from 'axoncore';

import Add from './Add';
import Remove from './Remove';
import List from './List'

class Cooldowns extends Command {
    constructor(module) {
        super(module);
        this.label = 'cooldowns';

        this.isSubcmd = true;
        this.hasSubcmd = true;
        this.subcmds = [
            Add,
            Remove,
            List,
        ];

        this.infos = {
            owners: ['Null'],
            usage: 'apings cooldowns',
            name: 'apings cooldowns',
            description: 'Base command for apings cooldowns',
        };
    }

    execute( { msg, guildConf } ) {
        return this.sendHelp( { msg, guildConf } );
    }
}

export default Cooldowns;
