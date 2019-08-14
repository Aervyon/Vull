import { Command } from 'axoncore';

class Enable extends Command {
    constructor(module) {
        super(module);
        this.label = 'enable';

        this.infos = {
            owners: ['Null'],
            description: 'Enable a command or module',
            usage: 'disable [type] [label]',
            examples: ['Enable command game', 'Enable module Info'],
        };

        this.options.argsMin = 2;
        this.guildOnly = true;

        this.permissions.serverAdmin = true;

        this.serverBypass = true;
    }

    async execute( { msg, args, guildConf } ) {
        switch (args[0] ) {
            case 'command': {
                const command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('cmd_notfound', { guildConf } ) );
                if (command.serverBypass === true) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('cmd_protected', { guildConf } ) );
                if (!guildConf.commands.includes(args[1] ) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('enable_already_enabled_cmd', { guildConf } ) );
                try {
                    const conf = await this.axon.AxonUtils.updateGuildStateCommand(msg.channel.guild.id, args[1], true);
                    if (!conf.commands.includes(args[1] ) ) {
                        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('enable_enabled_cmd', { guildConf } ) );
                    }
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('enable_err_occurred_cmd', { guildConf } ) );
                } catch (err) {
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('enable_err_occurred_cmd', { guildConf } ) );
                }
            }
            case 'module': {
                const modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('module_notfound', { guildConf } ) );
                if (modul.serverBypass === true) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('module_protected', { guildConf } ) );
                if (!guildConf.modules.includes(args[1] ) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('enable_already_enabled_module', { guildConf } ) );
                try {
                    const conf = await this.axon.AxonUtils.updateGuildStateModule(msg.channel.guild.id, args[1], true);
                    if (!conf.modules.includes(args[1] ) ) {
                        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('enable_enabled_module', { guildConf } ) );
                    }
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('enable_err_occurred_module', { guildConf } ) );
                } catch (err) {
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('enable_err_occurred_module', { guildConf } ) );
                }
            }
            default: {
                return this.sendHelp( { msg, guildConf } );
            }
        }
    }
}

export default Enable;
