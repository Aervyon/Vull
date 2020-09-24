import Bot from './Bot';
import mongoose from 'mongoose';

try {
    mongoose.connect('mongodb://localhost/Arin', {
        useCreateIndex: true,
        autoReconnect: true,
    } )
        .then( () => {
            Bot.logger.notice('Connected to Arin Database.');
        } )
        .catch( (err: Error) => {
            Bot.logger.fatal(`Could NOT connect to Arin Database.\n${err.stack}`);
        } );
} catch (e) {
    Bot.logger.fatal(`Could NOT connect to Arin Database.\n${e.stack}`);
}

console.log('Pong?');

Bot.start();

Bot.logger.notice('=== ONLINE ===');
