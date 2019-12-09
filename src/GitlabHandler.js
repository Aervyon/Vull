import superagent from 'superagent';

export default class GitLabHandler {
    constructor(token) {
        if (!token) {
            throw Error('Token missing but is required!');
        }
        this.token = token;
    }

    // eslint-disable-next-line consistent-return
    async search(scope, query, url) {
        if (!scope || !query) {
            throw Error('No query or scope provided!');
        }
        const aUrl = (url && !url.match('gitlab.com') && `${url.replace(/https?:\/\/|\//gi, '').toLowerCase()}/api/v4`) || 'gitlab.com/api/v4';
        try {
            const req = await superagent(`https://${aUrl}/search?scope=${scope}&search=${query}`).set('Private-Token', this.token);
            if (!req || !req.body || req.body.length === 0) {
                console.log('f');
                return false;
            }
            const reg = new RegExp(`^${query}$`, 'gi');
            const repo = req.body.find(p => p.name.match(reg) );
            if (!repo || typeof repo !== 'object') {
                console.log('ef');
                return false;
            }
            return repo;
        } catch (e) {
            if (e.code && e.code === 'ENOTFOUND') {
                return false;
            }
            if (!e.response) {
                return 'error';
            }
            if (e.response.notFound) {
                return false;
            }
            if (e.response.unauthorized) {
                return 'private';
            }
        }
    }

    // eslint-disable-next-line consistent-return
    async exact(query, url) {
        query = query.replace(/^\/|\/$/gi, '');
        query = query.replace('/', '%2F');
        const aUrl = (url && !url.match('gitlab.com') && `${url.replace(/https?:\/\/|\//gi, '').toLowerCase()}/api/v4`) || 'gitlab.com/api/v4';
        try {
            const req = await superagent(`https://${aUrl}/projects/${query}`);
            if (!req || !req.body || req.body.length === 0) {
                return false;
            }
            const repo = req.body;
            if (!repo || typeof repo !== 'object') {
                return false;
            }
            return repo;
        } catch (e) {
            if (e.code && e.code === 'ENOTFOUND') {
                return false;
            }
            if (!e.response) {
                return 'error';
            }
            if (e.response.notFound) {
                return false;
            }
            if (e.response.unauthorized) {
                return 'private';
            }
        }
    }
}
