import { Command, Resolver } from 'axoncore';
import moment from 'moment';

class Game extends Command {
    constructor(module) {
        super(module);
        this.label = 'game';

        this.infos = {
            owners: ['Null'],
            description: 'Get some playing info',
            usage: 'game (user)',
            examples: ['game Null', 'game'],
        };
    }

    game(member, msg) {
        let color = this.axon.configs.template.embed.colors.help;
        if (member.roles && member.roles.length > 0) {
            let roles = msg.channel.guild.roles.filter(r => member.roles.includes(r.id) );
            roles = this.axon.Utils.sortRoles(roles);
            const ncolor = roles.find(r => r.color !== 0);
            color = (ncolor && ncolor.color) || this.axon.configs.template.embed.colors.help;
        }
        const fields = [];
        const types = {
            0: 'Playing',
            1: 'Streaming on Twitch',
            2: 'Listening to',
            3: 'Watching',
        };
        const mess = {
            embed: {
                title: 'Game',
                color,
                footer: { text: `${member.user.username}#${member.user.discriminator}`, icon_url: member.avatarURL },
            },
        };
        if (!member.game) return `${this.axon.configs.template.emote.error} ${member.user.username} is not playing any game!`;
        mess.embed.title = `${member.user.username} is ${types[member.game.type]} ${member.game.name}`;
        if (member.game.name === 'Spotify') {
            return this.spotifyGame(member, mess.embed.title);
        }
        if (member.game.state) {
            fields.push( {
                name: 'State',
                value: member.game.state,
                inline: true,
            } );
        }
        if (member.game.details) {
            fields.push( {
                name: 'Details',
                value: member.game.details,
                inline: true,
            } );
        }
        if (member.game.timestamps) {
            if (member.game.timestamps.start && !member.game.timestamps.end) {
                const elapsed = new Date() - member.game.timestamps.start;
                fields.push( {
                    name: 'Time Elapsed',
                    value: moment.duration(elapsed, 'millisecond').format('d [Days,] h [Hours,] m [Minutes, and] s [Seconds]'),
                    inline: true,
                } );
            } else if (member.game.timestamps.start && member.game.timestamps.end) {
                const left = member.game.timestamps.start - new Date();
                const total = member.game.timestamps.end - member.game.timestamps.start;
                let elapsed = new Date() - member.game.timestamps.start;
                elapsed = moment.duration(elapsed, 'milliseconds').format('d [Days,] h [Hours,] m[:]ss');
                if (!elapsed.match(/d{1,2}:/) ) {
                    elapsed = `0:${total}`;
                }
                fields.push( {
                    name: 'Time',
                    value: `Time played: ${elapsed} out of ${total}\nTime Left: ${left}`,
                    inline: true,
                } );
            }
        }
        if (member.game.assets) {
            if (member.game.assets.large_image) {
                mess.embed.thumbnail = { url: `https://cdn.discordapp.com/app-assets/${member.game.application_id}/${member.game.assets.large_image}` };
                if (member.game.assets.large_text) {
                    mess.embed.description = `${member.game.assets.large_text}`;
                }
            }
            if (member.game.assets.small_image) {
                mess.embed.author = { icon_url: `https://cdn.discordapp.com/app-assets/${member.game.application_id}/${member.game.assets.small_image}`, name: '​' };
                if (member.game.assets.small_text) {
                    mess.embed.author.name = member.game.assets.small_text;
                }
            }
        }
        if (fields.length > 0) {
            mess.embed.fields = fields;
        }
        return mess;
    }

    spotifyGame(member, title) {
        let listened = new Date() - member.game.timestamps.start;
        const total = member.game.timestamps.end - member.game.timestamps.start;
        listened = moment.duration(listened, 'milliseconds').format('m[:]ss');
        if (!listened.match(/d{1,2}:/) ) {
            listened = `0:${listened}`;
        }
        return {
            embed: {
                author: {
                    icon_url: 'https://cdn.discordapp.com/attachments/358674161566220288/496894273304920064/2000px-Spotify_logo_without_text.png',
                    name: title,
                    url: 'https://spotify.com',
                },
                description: `${listened}/${moment.duration(total, 'milliseconds').format('m[:]ss')}`,
                color: 4718471,
                fields: [
                    {
                        name: 'Song',
                        value: member.game.details,
                    },
                    {
                        name: 'Album',
                        value: member.game.assets.large_text,
                    },
                    {
                        name: 'Artist',
                        value: member.game.state,
                        inline: true,
                    },
                ],
                thumbnail: {
                    url: `https://i.scdn.co/image/${member.game.assets.large_image.slice(8)}`,
                },
                footer: { text: `${member.user.username}#${member.user.discriminator}`, icon_url: member.avatarURL },
            },
        };
    }

    execute( { msg, args } ) {
        let { member } = msg;
        if (args[0] ) {
            member = Resolver.member(msg.channel.guild, args.join(' ') );
            if (!member) {
                this.sendError(msg.channel, 'User not found!');
            }
        }

        const game = this.game(member, msg);
        return this.sendMessage(msg.channel, game);
    }
}

export default Game;
