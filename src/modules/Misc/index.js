import { Module } from 'axoncore';

import * as commands from './commands/index';

class Misc extends Module {
    constructor(...args) {
        super(...args);
        this.label = 'Misc';

        this.enabled = true;

        this.infos = {
            name: 'Misc',
            description: 'Misc commands that did not fit anywhere else.'
        };

        this.init(commands);
    }
}

export default Misc;