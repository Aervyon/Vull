import { Module, AxonClient, ModuleData } from 'axoncore';

import * as commands from './commands/index';

class Core extends Module {
    constructor(client: AxonClient, data: ModuleData = {} ) {
        super(client, data);

        this.label = 'Core';

        this.enabled = true;
        this.serverBypass = true;

        this.info = {
            name: 'Core',
            description: 'The main module with most basic commands.',
        };
    }

    init(): Record<string, unknown> {
        return { commands };
    }
}

export default Core;
