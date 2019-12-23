import fs from 'fs';
import { join } from 'path';
import { Member } from 'eris';
export class LangClass {
    constructor(defaultLang) {
        this.default = defaultLang || 'en';
    }

    async init() {
        if (!fs.existsSync(join(__dirname, '../languages.json') ) ) {
            throw new Error('Languages JSON file not found...');
        }
        const langs = require('../languages.json');
        this.langs = langs;
        this.initiated = true;
        if (!langs[this.default] ) {
            this._default = this.default;
            this.default = 'en';
            throw Error(`Language ${this._default} not found. Defaulting to EN - LangClass`);
        }
    }

    pickLang(lang) {
        if (!this.langs || !this.initiated) {
            throw new Error('Not initiated - LangClass');
        }
        let nLang = this.default;
        if (this.langs[lang] ) {
            nLang = lang;
        }
        return nLang;
    }

    parse(snip, options) {
        const {
            msg, member, guild, custom, user,
        } = options;
        let parse = snip;
        const usr = user || (msg && (msg.member || msg.author) );
        if (usr && (snip.match(/{user}/) || snip.match(/\{user\.[A-Za-z]+\}/) ) ) {
            parse = parse.replace(/{user}/gi, usr.mention);
            const userExts = parse.match(/\{user\.[A-Za-z]+\}/gi);
            if (userExts) {
                if (userExts.includes('{user.name}') ) {
                    parse = parse.replace(/{user.name}/gi, `${usr.username}#${usr.discriminator}`);
                }
                if (userExts.includes('{user.avatar}') ) {
                    parse = parse.replace(/{user.avatar}/gi, usr.avatarURL);
                }
                if (userExts.includes('{user.id}') ) {
                    parse = parse.replace(/{user.id}/gi, usr.id);
                }
            }
        } else if (!usr && (snip.match('{user}') || snip.match(/{user.[A-Za-z]+}/) ) ) {
            throw new Error(`Snippet requires user, and user is not given! - LangClass`);
        }
        if (member && (snip.match(/{member}/) || snip.match(/\{member\.[A-Za-z]\}+/) ) ) {
            parse = parse.replace(/{member}/gi, member.mention);
            const userExts = parse.match(/\{member\.[A-Za-z]+\}/gi);
            if (userExts) {
                if (userExts.includes('{member.name}') ) {
                    parse = parse.replace(/{member.name}/gi, member instanceof Member ? `${member.user.username}#${member.user.discriminator}` : `${member.username}#${member.discriminator}`);
                }
                if (userExts.includes('{member.avatar}') ) {
                    parse = parse.replace(/{member.avatar}/gi, member.avatarURL);
                }
                if (userExts.includes('{member.id}') ) {
                    parse = parse.replace(/{member.id}/gi, member.id);
                }
            }
        } else if (!member && (snip.match('{member}') || snip.match(/{member.[A-Za-z]+}/) ) ) {
            throw new Error(`Snippet requires member, and member is not given! - LangClass`);
        }
        if (guild && (snip.match('{guild}') || snip.match(/{guild.[A-Za-z]+}/) ) ) {
            parse = parse.replace(/{guild}/gi, `${guild.name} (${guild.id})`);
            const guildExts = parse.match(/\{guild\.[A-Za-z]+\}/gi);
            if (guildExts) {
                if (guildExts.includes('{guild.name}') ) {
                    parse = parse.replace(/{guild.name}/gi, guild.name);
                }
                if (guildExts.includes('{guild.icon}') ) {
                    parse = parse.replace(/{guild.icon}/gi, guild.iconURL);
                }
                if (guildExts.includes('{guild.id}') ) {
                    parse = parse.replace(/{guild.id}/gi, guild.id);
                }
            }
        } else if (!guild && (snip.match('{guild}') || snip.match(/{guild.[A-Za-z]+}/) ) ) {
            throw new Error(`Snippet requires guild, and guild is not given! - LangClass`);
        }
        if (custom && parse.match('{custom}') ) {
            const match = parse.match(/{custom}/gi);
            if (Array.isArray(custom) ) {
                let i = 0;
                if (custom.length < match.length) {
                    throw new Error(`Snippet requires ${match.length} customs, you supplied ${custom.length} - LangClass`);
                }
                while (i < match.length) {
                    parse = parse.replace('{custom}', custom[i] );
                    i++;
                }
            } else {
                parse = parse.replace(/{custom}/gi, custom);
            }
        } else if (parse.match('{custom}') && !custom) {
            throw new Error('Snippet requires custom, and custom is not given! - LangClass');
        }
        return parse;
    }

    fetchSnippet(snippet, options) {
        if (!this.langs || !this.initiated) {
            throw new Error('Not initiated - LangClass');
        }
        const {
            guildConf, msg, member, guild, custom, user,
        } = options || {};
        const type = guildConf ? this.pickLang(guildConf.lang) : this.default;
        if (!this.langs || !this.initiated) {
            throw new Error('Not initiated - LangClass');
        }
        const lang = this.langs[type];
        let snip = lang[snippet];
        if (!snip) {
            snip = this.langs.en[snippet];
        }
        if (!snip) {
            throw new Error(`Snippet "${snippet}" not found!`);
        }
        return this.parse(snip, {
            msg, member, guild, custom, user,
        } );
    }
}
export default LangClass;
