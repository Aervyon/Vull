import { Command } from 'axoncore';
import superagent from 'superagent';
import moment from 'moment';

class Gitlab extends Command {
    constructor(module) {
        super(module);
        this.label = 'gitlab';
        this.aliases = ['gl'];
        this.enabled = this.toEnable();

        this.infos = {
            owners: ['Null'],
            description: 'Eval in a sandbox',
            usage: 'gitlab [namespace/project or project]',
            example: 'gl Evolve-X',
        };
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
        const search = args[0].split('/').length > 0 ? args[0].replace('/', '%2F') : args[0];
        let toSearch = false;
        if (!search.match('%2F') ) {
            toSearch = true;
        }
        let mssg = {};
        if (toSearch) {
            try {
                const req = await superagent(`https://gitlab.com/api/v4/search?scope=projects&search=${search}`).set('Private-Token', this.conf.glToken);
                if (!req.body) {
                    mssg = 'Repository not found!';
                } else {
                    const reg = new RegExp(`^${search}$`, 'i');
                    const repo = req.body.find(project => project.name.match(reg) );
                    if (!repo || typeof repo !== 'object') {
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
                            author: {
                                name: repo.namespace.name,
                                icon_url: `https://gitlab.com${repo.namespace.avatar_url}`,
                            },
                        };
                    }
                }
            } catch (e) {
                if (e.request.notFound) {
                    mssg = 'Repository not found!';
                } if (e.request.unauthorized) {
                    mssg = 'Private repository!';
                }
            }
        } else {
            try {
                const req = await superagent(`https://gitlab.com/api/v4/projects/${search}`).set('Private-Token', this.conf.glToken);
                if (!req.body) {
                    mssg = 'Repository not found!';
                } else {
                    const repo = req.body;
                    if (!repo || typeof repo !== 'object' || !repo.namespace || !repo.name_with_namespace || !repo.web_url || !repo.created_at) {
                        mssg = 'Repository not found!';
                    } else {
                        mssg.embed = {
                            fields: [
                                {
                                    name: 'URL',
                                    value: `[${repo.name_with_namespace}]${repo.web_url}`,
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
                            author: {
                                name: repo.namespace.name,
                                icon_url: `https://gitlab.com${repo.namespace.avatar_url}`,
                            },
                        };
                    }
                }
            } catch (e) {
                if (e.code && e.code === 'ENOTFOUND') {
                    mssg = 'Repository not found!';
                } else if (!e.response) {
                    mssg = 'Unknown Error Occurred.';
                } else if (e.response.notFound) {
                    mssg = 'Repository not found!';
                } else if (e.response.unauthorized) {
                    mssg = 'Private repository!';
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
