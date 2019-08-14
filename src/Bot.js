import VullClient from './VullClient';
import VullUtils from './VullUtils';
import { Client } from 'eris';

import axonConf from './configs/customConf.json';
import tokenConf from './configs/tokenConf.json';
import templateConf from './configs/templateConf.json';

import Guild from '../models/Guild';

const AxonOptions = {
    axonConf,
    templateConf,
    tokenConf,

    guildSchema: Guild,
    utils: VullUtils,
};

const client = new Client(
    tokenConf.bot.token,
    {
        autoreconnect: true,
        defaultImageFormat: 'png',
        defaultImageSize: 512,
        disableEveryone: true,
        getAllUsers: true,
        messageLimit: 100,
        restMode: true,
    }
);
const Bot = new VullClient(
    client,
    AxonOptions
);

export default Bot;
