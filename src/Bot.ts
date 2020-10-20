// Node things here
import path from 'path';

import Eris from 'eris';
import { MongoProvider } from './Structures/Database/MongoProvider';
import { AxonOptions } from 'axoncore';

import Client from './Structures/Client';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import botConfig from '../configs/config.json'; // @ts-ignore
import secret from '../configs/secret.json'; // Hi yes TS I know this doesn't always exist just shut up
// This a pre-production version of Vull V3. This error pertains more to the user.
import lang from '../configs/lang.json';

import MyUtils from './MyUtils';

const axonOptions = new AxonOptions( {
    prefixes: botConfig.prefixes,
    settings: botConfig.settings,
    lang,
    logo: null,

    info: botConfig.info,
    staff: botConfig.staff,
    template: botConfig.template,
    custom: { },
},
// webhooks
secret.webhooks,
{
    utils: MyUtils, // use own Utils added to the ones provided by AxonCore
    DBProvider: MongoProvider, // custom DB Service
    DBLocation: path.join(__dirname, '../database/'), // Temp fix until the afformentioned DBProvider works.

} );

/**
 * new AxonClient(token, erisOptions, AxonOptions, modules)
 *
 * new Client(token, erisOptions, AxonOptions) => Modules imported in Client
 */
const client = new Eris.Client(
    secret.bot.token,
    {
        autoreconnect: true,
        defaultImageFormat: 'png',
        defaultImageSize: 512,
        getAllUsers: false,
        messageLimit: 1000,
        restMode: true,
        disableEvents: {
            TYPING_START: true,
        },
    },
);

const Bot = new Client(
    client,
    axonOptions,
);

export default Bot;
