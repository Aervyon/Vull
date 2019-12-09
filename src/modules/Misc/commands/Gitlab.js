import { Command } from 'axoncore';
import moment from 'moment';
import GitlabHandler from '../../../GitlabHandler';

class Gitlab extends Command {
    constructor(module) {
        super(module);
        this.label = 'gitlab';
        this.aliases = ['gl'];
        this.enabled = !!this.axon.GitLabHandler;

        this.infos = {
            owners: ['Null'],
            description: 'Eval in a sandbox',
            usage: 'gitlab [namespace/project or project]',
            example: 'gl Evolve-X',
        };
        this.toEnable();
    }

    toEnable() {
        try {
            this.conf = require(`${process.cwd().replace('src', '')}src/configs/cTokenConf.json`);
            if (!this.conf || !this.conf.glToken) {
                throw Error('hi');
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async execute( { msg, args } ) {
        if (!args[0] ) {
            return this.sendError(msg.channel, 'Invalid command usage! Provide either namespace/project or project!');
        }
        let search = args[0].split('/').length > 0 ? args[0].split('/') : args[0];
        const toSearch = !Array.isArray(search);
        search = search.join('/');
        const aUrl = (args[1] && `https://${args[1].replace(/https?:\/\/|\//gi, '').toLowerCase()}`) || (this.axon.conf.glURL && `https://${this.axon.conf.glURL.replace(/https?:\/\/|\//gi, '').toLowerCase()}`) || 'https://gitlab.com/';
        let mssg = {};
        if (toSearch) {
            if ( (args[1] && this.axon.conf.glURL && args[1] !== this.axon.conf.glURL) || (args[1] && !args[1].match('gitlab.com') ) ) {
                return this.sendError(msg.channel, 'Using search and a third party URL is NOT allowed.');
            }
            const repo = await this.axon.GitLabHandler.search('projects', search, aUrl);
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
            } else {
                mssg.embed = {
                    fields: [
                        {
                            name: 'URL',
                            value: `[${repo.name_with_namespace}](${repo.web_url})`,
                        },
                        {
                            name: 'Stars',
                            value: repo.star_count,
                        },
                        {
                            name: 'Forks',
                            value: repo.forks_count,
                        },
                        {
                            name: 'Last Activity',
                            value: moment(repo.last_activity_at).format('DD/MM/YYYY HH:mm'),
                        },
                        {
                            name: 'Created',
                            value: moment(repo.created_at).format('DD/MM/YYYY HH:mm'),
                        },
                    ],
                    description: repo.description,
                    thumbnail: { url: repo.avatar_url },
                };
                if (repo.namespace) {
                    mssg.embed.author = {
                        name: repo.namespace.name,
                        icon_url: `${aUrl.replace(/\/$/gi, '')}${repo.namespace.avatar_url}`,
                    };
                }
            }
        } else {
            const repo = await this.axon.GitLabHandler.exact(search, aUrl);
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
            } else {
                mssg.embed = {
                    fields: [
                        {
                            name: 'URL',
                            value: `[${repo.name_with_namespace}](${repo.web_url})`,
                        },
                        {
                            name: 'Stars',
                            value: repo.star_count,
                        },
                        {
                            name: 'Forks',
                            value: repo.forks_count,
                        },
                        {
                            name: 'Last Activity',
                            value: moment(repo.last_activity_at).format('DD/MM/YYYY HH:mm'),
                        },
                        {
                            name: 'Created',
                            value: moment(repo.created_at).format('DD/MM/YYYY HH:mm'),
                        },
                    ],
                    description: repo.description,
                    thumbnail: { url: repo.avatar_url },
                };
                if (repo.namespace) {
                    mssg.embed.author = {
                        name: repo.namespace.name,
                        icon_url: `${aUrl.replace(/\/$/gi, '')}${repo.namespace.avatar_url}`,
                    };
                }
            }
        }
        if (typeof mssg === 'string') {
            return this.sendError(msg.channel, mssg);
        }
        return this.sendMessage(msg.channel, mssg);
    }
}

export default Gitlab;
