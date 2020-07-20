import { Command } from 'axoncore';
import moment from 'moment';
import superagent from 'superagent';
import momentDurationFormat from 'moment-duration-format';
momentDurationFormat(moment);

class Github extends Command {
    constructor(module) {
        super(module);
        this.label = 'github';
        this.aliases = ['gh'];
        this.enabled = true;

        this.infos = {
            owners: ['Null'],
            description: 'Find a repo on github',
            usage: 'github [namespace/project or project]',
            example: 'gh AxonCore',
        };
        this.waitUntil = new Date();
    }

    async execute( { msg, args } ) {
        if (!args[0] ) {
            return this.sendError(msg.channel, 'Invalid command usage! Provide either namespace/project or project!');
        }
        if (this.waitUntil > new Date() ) {
            console.log(this.waitUntil - new Date() );
            return this.sendError(msg.channel, `Ratelimited from GitHub. Wait ${moment.duration(this.waitUntil - new Date() ).format('H [hours] m [minutes], s [seconds]')}`);
        }
        let mssg = {};
        let repo = await superagent.get(`api.github.com/search/repositories?q=${args[0].replace(' ', '+')}`);
        if (!repo) {
            mssg = 'Repository not found!';
        } else if (typeof repo === 'string') {
            if (repo === 'private') {
                mssg = 'Private repository or not found';
            } else {
                mssg = 'An Unknown Error Occurred';
            }
        } else if (typeof repo !== 'object') {
            mssg = 'Repository not found!';
        } else if (repo.body.private) {
            mssg = 'Private repository';
        } else {
            if (Number(repo.headers['x-ratelimit-remaining'] ) < 2) {
                this.waitUntil = new Date(Number(repo.headers['x-ratelimit-reset'] * 1000) );
            }
            repo = repo.body.items[0];
            mssg.embed = {
                fields: [
                    {
                        name: 'Language',
                        value: repo.language || 'N/A',
                        inline: true,
                    },
                    {
                        name: 'URL',
                        value: `[${repo.full_name}](${repo.html_url})`,
                        inline: true,
                    },
                    {
                        name: 'Default Branch',
                        value: repo.default_branch,
                        inline: true,
                    },
                    {
                        name: 'Stars',
                        value: repo.stargazers_count > 0 ? `[${repo.forks_count}](${repo.html_url}/stargazers)` : repo.stargazers_count,
                        inline: true,
                    },
                    {
                        name: 'Forks',
                        value: repo.forks_count > 0 ? `[${repo.forks_count}](${repo.html_url}/network/members)` : repo.forks_count,
                        inline: true,
                    },
                    {
                        name: 'License',
                        value: (repo.license && repo.license.name) || 'N/A',
                        inline: true,
                    },
                    {
                        name: 'Open Issues',
                        value: repo.open_issues,
                        inline: true,
                    },
                    {
                        name: 'Last Push',
                        value: moment(repo.pushed_at).format('DD/MM/YYYY HH:mm'),
                        inline: true,
                    },
                    {
                        name: 'Created',
                        value: moment(repo.created_at).format('DD/MM/YYYY HH:mm'),
                        inline: true,
                    },
                ],
                description: repo.homepage ? `**Description:** ${repo.description}\n**Homepage:** ${repo.homepage}` : repo.description,
                author: {
                    name: repo.owner.login,
                    icon_url: repo.owner.avatar_url,
                },
                title: repo.name,
            };
            if (repo.archived && !repo.homepage) {
                mssg.embed.title = `**Notice: Archived Repository**\n**Description:** ${repo.description}`;
            } else if (repo.archived && repo.homepage) {
                mssg.embed.title = `**Notice: Archived Repository**\n${mssg.description}`;
            }
        }
        if (typeof mssg === 'string') {
            return this.sendError(msg.channel, mssg);
        }
        return this.sendMessage(msg.channel, mssg);
    }
}

export default Github;
