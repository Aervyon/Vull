import { Module } from 'axoncore';

import * as commands from './commands/index';
// const index = require('./index/index');;

class Private extends Module {
    constructor(...args) {
        super(...args);

        this.label = 'Private';

        this.enabled = true;
        this.serverBypass = true;

        this.infos = {
            name: 'Private',
            description: 'Development commands.',
        };

        this.init(commands);
    }
}

export default Private;
