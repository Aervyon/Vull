import {
    AxonClient, AxonOptions, GuildConfig, Command, CommandEnvironment,
} from 'axoncore';

import * as modules from '../modules/index';
import * as eris from 'eris';

/**
 * Example - Client constructor
 *
 * @author KhaaZ
 *
 * @class Client
 * @extends AxonClient
 */
class Client extends AxonClient {
    constructor(client: eris.Client, axonOptions: AxonOptions) {
        super(client, axonOptions, modules);
    }

    onInit(): true {
        this.staff.contributors = [];
        return true;
    }

    onStart(): Promise<true> {
        return Promise.resolve(true);
    }

    onReady(): Promise<true> {
        return Promise.resolve(true);
    }

    initStatus(): void {
        // called after ready event
        // overrides default editStatus
        // used to setup custom status
        this.botClient.editStatus('online', {
            name: `ARIN Moderation | ${this.settings.prefixes[0]}help`,
            type: 0,
        } );
    }

    // disabled
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $sendFullHelp(msg: eris.Message, guildConfig: GuildConfig): Promise<unknown> {
        // override sendFullHelp method
        return this.axonUtils.sendMessage(msg.channel, 'Full Help override');
    }

    // disabled
    // eslint-disable-next-line no-unused-vars
    $sendHelp(command: Command, env: CommandEnvironment): Promise<unknown> {
        // override sendHelp method
        return this.axonUtils.sendMessage(env.msg.channel, `Help override for ${command.label}`);
    }
}

export default Client;
