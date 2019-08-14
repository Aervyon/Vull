import { Command } from 'axoncore';

class Diagnose extends Command {
    constructor(module) {
        super(module);
        this.label = 'diagnose';

        this.infos = {
            owners: ['Null'],
            description: 'Diagnose a command/module',
            usage: 'diagnose [type] [label]',
            examples: ['diagnose module Server', 'diagnose command game'],
        };

        this.permissions.serverMod = true;

        this.serverBypass = true;
    }

    execute( { msg, args, guildConf } ) {
        let prefix;

        try {
            prefix = guildConf.prefix[0];
        } catch {
            prefix = this.axon.params[0]
        }
        switch (args[0] ) {
            case 'command': {
                const command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('cmd_notfound', { guildConf } ) );
                const cDisabled = this.axon.LangClass.fetchSnippet('diagnose_cmd_disabled', { guildConf } );
                const cGDisabled = this.axon.LangClass.fetchSnippet('diagnose_cmd_g_disabled', { guildConf } );
                let output = guildConf.commands.includes(args[1] ) ? cDisabled : this.axon.LangClass.fetchSnippet('diagnose_cmd_enabled', { guildConf } );
                if (command.enabled === false) output = cGDisabled;
                let color = [cDisabled, cGDisabled].includes(output) ? this.axon.template.embed.colors.error : this.axon.template.embed.colors.success;
                const modul = command._module;
                if (guildConf.modules.includes(modul.label) || modul.enabled === false) {
                    output += '\n' + this.axon.LangClass.fetchSnippet(!modul.enabled ? 'diagnose_parent_module_g_disabled' : 'diagnose_parent_module_disabled', { guildConf, custom: modul.label } );
                    color = this.axon.template.embed.colors.error;
                }

                output += `\n` + this.axon.LangClass.fetchSnippet('prefix_show', { guildConf, guild: msg.channel.guild, custom: prefix } );

                return this.sendMessage(msg.channel, {
                    embed: {
                        fields: [
                            {
                                name: this.axon.LangClass.fetchSnippet('diagnose_cmd_status', { guildConf, custom: command.label } ),
                                value: output,
                            },
                        ],
                        color,
                    },
                } );
            }
            case 'module': {
                const modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('module_notfound', { guildConf } ) );
                const mDisabled = this.axon.LangClass.fetchSnippet('diagnose_module_disabled', { guildConf } );
                const mGDisabled = this.axon.LangClass.fetchSnippet('diagnose_module_g_disabled', { guildConf } );
                let output = guildConf.modules.includes(args[1] ) ? mDisabled : this.axon.LangClass.fetchSnippet('diagnose_module_enabled', { guildConf } );
                if (modul.enabled === false) output = mGDisabled;
                const color = output.match('disabled') ? this.axon.template.embed.colors.error : this.axon.template.embed.colors.success;

                output += `\n` + this.axon.LangClass.fetchSnippet('prefix_show', { guildConf, guild: msg.channel.guild, custom: prefix } );

                return this.sendMessage(msg.channel, {
                    embed: {
                        fields: [
                            {
                                name: this.axon.LangClass.fetchSnippet('diagnose_module_status', { guildConf, custom: modul.label } ),
                                value: output,
                            },
                        ],
                        color,
                    },
                } );
            }
            default: {
                return this.sendHelp( { msg, guildConf } );
            }
        }
    }
}

export default Diagnose;
