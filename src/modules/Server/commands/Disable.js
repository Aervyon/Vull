import { Command } from 'axoncore';

class Disable extends Command {
    constructor(module) {
        super(module);
        this.label = 'disable';

        this.infos = {
            owners: ['Null'],
            description: 'Disable a command or module',
            usage: 'disable [type] [label]',
            examples: ['disable command game', 'disable module Info'],
        };

        this.options.argsMin = 2;
        this.guildOnly = true;

        this.serverBypass = true;

        this.permissions.serverAdmin = true;
    }

    async execute( { msg, args, guildConf } ) {
        switch (args[0] ) {
            case 'command': {
                const command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('cmd_notfound', { guildConf } ) );
                if (command.serverBypass === true) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('cmd_protected', { guildConf } ) );
                if (guildConf.commands.includes(args[1] ) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('disable_already_disabled_cmd', { guildConf } ) );
                try {
                    const conf = await this.axon.AxonUtils.updateGuildStateCommand(msg.channel.guild.id, args[1], false);
                    if (conf.commands.includes(args[1] ) ) {
                        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('disable_disabled_cmd', { guildConf } ) );
                    }
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('disable_err_occurred_cmd', { guildConf } ) );
                } catch (err) {
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('disable_err_occurred_cmd', { guildConf } ) );
                }
            }
            case 'module': {
                const modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('module_notfound', { guildConf } ) );
                if (modul.serverBypass === true) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('module_protected', { guildConf } ) );
                if (guildConf.modules.includes(args[1] ) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('disable_already_disabled_module', { guildConf } ) );
                try {
                    const conf = await this.axon.AxonUtils.updateGuildStateModule(msg.channel.guild.id, args[1], false);
                    if (conf.modules.includes(args[1] ) ) {
                        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('disable_disabled_module', { guildConf } ) );
                    }
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('disable_err_occurred_cmd', { guildConf } ) );
                } catch (err) {
                    return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('disable_err_occurred_cmd', { guildConf } ) );
                }
            }
            default: {
                return this.sendHelp( { msg, guildConf } );
            }
        }
    }
}

export default Disable;
