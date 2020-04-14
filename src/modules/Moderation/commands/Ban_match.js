import { Command, Prompt, Resolver } from 'axoncore';

class BanMatch extends Command {
    constructor(module) {
        super(module);
        this.label = 'match';

        this.infos = {
            description: 'Ban a bunch of users via matching the message content',
            owners: ['Null'],
            usage: 'ban match [text] (| reason)',
            examples: ['ban match kys', 'banmatch kys | Stop telling people to kill themselves'],
            name: 'ban match',
        };

        this.isSubcmd = true;

        this.permissions.bot = [
            'banMembers',
            'sendMessages',
            'embedLinks',
        ];

        this.permissions.serverAdmin = true;

        this.options.guildOnly = true;
        this.options.argsMin = 1;
    }

    async execute( { msg, args, guildConf } ) {
        let query;
        let reason = 'No reason';
        if (args.includes('|') ) {
            const eh = args.join(' ').split(' | ');
            if (eh[1] ) reason = eh[1];
            query = eh[0];
        } else {
            query = args.join(' ');
        }

        const msgs = await msg.channel.getMessages();

        let message = await this.sendMessage(msg.channel, `${this.axon.configs.template.emote.loading} Searching for messages with query \`${query}\`...`);
        const messages = msgs.filter(m => m.content.includes(query) && !this.axon.AxonUtils.isAdmin(m.member) && !this.axon.AxonUtils.isMod(m.member, guildConf) && m.author.id !== this.bot.user.id);
        if (!messages || messages.length === 0) return message.edit(`${this.axon.configs.template.emote.error} No messages found!`);
        const ids = messages.map(m => m.author.id);

        const users = [];

        for (const id of ids) {
            let add = true;
            let user = Resolver.member(msg.channel.guild, id) || Resolver.user(this.axon.client, id);
            let mem;
            if (user) {
                mem = user;
                // eslint-disable-next-line prefer-destructuring
                user = user.user;
            }
            if (!user && id.match(/^\d+$/) ) {
                user = await this.axon.client.getRESTUser(id)
                    .catch( () => {
                        add = false;
                    } );
            }
            if (!user) add = false;
            if (add && mem) {
                if (mem.roles && guildConf.protectedRoles && guildConf.protectedRoles.length > 0) {
                    for (const role of guildConf.protectedRoles) {
                        const check = mem.roles.includes(role);
                        add = !check;
                    }
                }
            }
            if (users.find(u => u.id === id) ) add = false;
            if (add) users.push(user);
        }

        if (!users || !users.length) return message.edit(`${this.axon.configs.template.emote.error} No users are bannable!`);
        message.delete();

        const uNames = users.map(u => `${u.username}#${u.discriminator} (${u.id})`);
        let endPrompt;
        const prompt = new Prompt(this.axon, msg.author.id, msg.channel, {
            deletePrompt: false,
            deleteTimeoutMsg: 10000,
            timeoutTime: 60000,
        } );

        try {
            endPrompt = await prompt.run(`Users to ban\n\`\`\`${uNames.join('\n')}\`\`\` Confirm (yes/y) or deny banning (no/n).`);
        } catch (err) {
            const er = err.message || err;
            if (er.match(/TIMEOUT/i) ) return Promise.resolve();
            this.sendError(msg.channel, `Something happened interally within axoncore. See for details:\`\`\`${er}\`\`\``);
            throw Error(`Prompt Error @ MatchBan - ${er}`);
        }

        if (!endPrompt) return this.sendError(msg.channel, 'Something went wrong and i did not get an answer');

        if (endPrompt.content.match(/no|n/) ) return this.sendMessage(msg.channel, 'Ban cancelled!');
        // eslint-disable-next-line no-else-return
        else if (!endPrompt.content.match(/yes|y/) ) return this.sendMessage(msg.channel, 'Invalid option!');

        message = await this.sendMessage(msg.channel, `${this.axon.configs.template.emote.loading} Banning users...`);

        let success = 0;
        let errored = 0;
        let startID,
            modcase;
        for (const user of users) {
            const startError = errored;
            try {
                await msg.channel.guild.banMember(user.id, 7, reason);
                success++;
                message.edit(`${this.axon.configs.template.emote.loading} Banning users... (${success}/${users.length})`);
                await this.axon.Utils.sleep(1000);
            } catch (e) {
                errored++;
            }
            if (errored === startError) {
                const id = String(guildConf.cases.length + 1);
                modcase = {
                    mod: msg.member.id, user: user.id, reason, id, type: 'ban match',
                };
                guildConf.cases.push(modcase);
                if (!startID) startID = id;
            }
        }
        if (success > 0) this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        let desc = success > 0 ? `**Banned** \`${success}\` members` : 'Failed to ban any members';
        if (errored > 0 && desc !== '**Failed** to ban any members') desc += `\nFailed to ban \`${errored}\` members`;
        if (desc !== 'Failed to ban any members') desc += `\n**Out** of \`${ids.length}\` members`;

        if (guildConf.modLogStatus && success > 0) {
            modcase.id = startID !== modcase.id ? `${startID} - ${modcase.id}` : modcase.id;
            this.axon.client.emit('moderation', { modcase, guildConf } );
        }

        let color = this.axon.configs.template.embed.colors.help;
        if (msg.channel.guild.roles && msg.channel.guild.roles.size > 0) {
            let roles = msg.channel.guild.roles.filter(r => r.color !== 0);
            roles = this.axon.Utils.sortRoles(roles);
            color = roles[0].color || color;
        }

        return message.edit( {
            content: '',
            embed: {
                color,
                title: 'Match ban complete',
                description: desc,
            },
        } );
    }
}

export default BanMatch;
