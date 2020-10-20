import Bot from './Bot';
import { settings } from '../configs/config.json';
import mongoose from 'mongoose';


try {
    if (settings.db !== 3) {
        throw Error('Database not set to custom!'); // This just stops the whole db from trying to connect
    }
    mongoose.connect('mongodb://localhost/Arin', {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    } )
        .then( () => {
            Bot.logger.notice('Connected to Vull Arin Database.');
        } )
        .catch( (err: Error) => {
            Bot.logger.fatal(`Could NOT connect to Vull Arin Database.\n${err.stack}`);
        } );
} catch (e) {
    Bot.logger.fatal(`Could NOT connect to Vull Arin Database.\n${e.stack}`);
}

Bot.start();

Bot.logger.notice('Vull Arin online');
