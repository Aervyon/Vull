import { Module } from 'axoncore';

import * as commands from './commands/index';
// const index = require('./index/index');;

class Info extends Module {
    constructor(...args) {
        super(...args);

        this.label = 'Info';

        this.enabled = true;

        this.infos = {
            name: 'Info',
            description: 'Commands that provide information',
        };

        this.init(commands);
    }
}

export default Info;
