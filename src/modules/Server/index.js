import { Module } from 'axoncore';

import * as commands from './commands/index';

class Serrver extends Module {
    constructor(...args) {
        super(...args);

        this.label = 'Server';

        this.enabled = true;

        this.infos = {
            name: 'Server',
            description: 'Server commands',
        };

        this.init(commands);
    }
}

export default Serrver;
