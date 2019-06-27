import { Command } from 'axoncore';
import superagent from 'superagent';

class YouTube extends Command {
    constructor(module) {
        super(module);

        this.label = 'youtube';
        this.aliases = ['yt'];

        this.isSubcmd = false;

        this.infos = {
            owners: ['Null'],
            description: 'Search for a youtube video',
            usage: 'youtube [query]',
            examples: ['youtube NF - The Search'],
        };

        this.permissions.bot = ['sendMessages', 'embedLinks'];
        this.options.argsMin = 1;
    }

    async execute( { msg, args } ) {
        const query = args.join('+');
        if (!this.axon.configs._tokens.yt.key) {
            this.sendError(msg.channel, 'YouTube API has not been setup. Can not execute');
            throw Error('No YT API key or token!');
        }

        const finale = await superagent.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${query}&key=${this.axon.configs._tokens.yt.key}`);

        if (!finale.ok) return this.sendError(msg.channel, 'Something went wrong while requesting from youtube. :(');

        let f = JSON.parse(finale.text);
        if (!f.items || f.items.length === 0) return this.sendError(msg.channel, 'Nothing found! :(');
        f = f.items[0];
        return this.sendSuccess(msg.channel, `**https://www.youtube.com/watch?v=${f.id.videoId}**`);
    }
}

export default YouTube;
