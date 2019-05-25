import { Module } from 'axoncore';

import * as commands from './commands/index';
import * as events from './events/index';

class Moderation extends Module {
    constructor(...args) {
        super(...args);
        this.label = 'Moderation';

        this.infos = {
            name: 'Moderation',
            description: 'Moderator commands used to moderate the server',
        };

        this.init(commands, events);
    }
}

export default Moderation;
