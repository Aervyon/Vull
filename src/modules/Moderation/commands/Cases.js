import { Command, Resolver } from 'axoncore';

class ModCases extends Command {
    constructor(module) {
        super(module);
        this.label = 'cases';

        this.infos = {
            owners: ['Null'],
            description: 'Get a users violations (cases)',
            usage: 'cases [user]',
            examples: ['cases Null'],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = ['sendMessages'];

        this.options.guildOnly = true;
        this.options.argsMin = 1;
    }

    async execute( { msg, args, guildConf } ) {
        let user = Resolver.member(msg.channel.guild, args.join(' ') ) || Resolver.user(this.axon.client, args.join(' ') );
        if (!user && args[0].match(/^\d+$/) ) {
            user = await this.axon.client.getRESTUser(args[0] ).catch( () => { /* --- */ } );
        }
        if (!user) this.sendError(msg.channel, 'User not found!');
        let modlogs = guildConf.cases.filter(mcase => mcase.user === user.id);
        if (!modlogs || modlogs.length === 0) return this.sendError(msg.channel, 'User has no cases!');
        modlogs = modlogs.sort( (a, b) => Number(b.id) - Number(a.id) );
        modlogs = modlogs.splice(0, 15);
        const mlogs = [];
        for (const modlog of modlogs) {
            let mod = Resolver.member(msg.channel.guild, modlog.mod) || Resolver.user(this.axon.client, modlog.mod);
            if (!mod) {
                mod = await this.axon.client.getRESTUser(args[0] ).catch( () => { /* --- */ } );
            }
            const type = modlog.type[0].toUpperCase() + modlog.type.slice(1);
            mod = mod.user ? mod.user.username : mod.username;
            const eh = `${type} (ID): ${modlog.id} | Mod: ${mod} | Reason: ${modlog.reason}`;
            mlogs.push(eh);
        }
        let file;
        if (mlogs.join('\n').length > 1990) {
            file = {
                file: Buffer.from(mlogs.join('\n') ),
                name: `Vull_Modlogs_${msg.channel.guild.id}_${user.id}.txt`,
            };
        }
        if (file) return msg.channel.createMessage(msg.channel.id, `Cases for ${user.user ? user.user.username : user.username}`, file);
        this.sendSuccess(msg.channel, `Cases for ${user.user ? user.user.username : user.username}`);
        return this.sendMessage(msg.channel, `\`\`\`${mlogs.join('\n')}\`\`\``);
    }
}

export default ModCases;
