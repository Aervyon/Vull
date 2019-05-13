import { Command } from 'axoncore';

import Settings from './Set';
import Add from './Add';
import Remove from './Remove';
import List from './List';
import Cooldowns from './Cooldowns/Cooldowns';

class Apings extends Command {
    constructor(module) {
        super(module);
        this.label = 'apings';

        this.hasSubcmd = true;
        this.subcmds = [
            Settings,
            Add,
            Remove,
            List,
            Cooldowns,
        ];

        this.infos = {
            name: 'apings',
            owners: ['Null'],
            description: 'Commands for cat#3890 adventure command',
        };
    }

    execute( { msg, guildConf } ) {
        return this.sendHelp( { msg, guildConf } );
    }
}

export default Apings;
