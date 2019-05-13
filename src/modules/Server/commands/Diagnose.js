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
    }

    execute( { msg, args, guildConf } ) {
        switch (args[0] ) {
            case 'command': {
                const command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, 'Command not found!');
                let output = guildConf.commands.includes(args[1] ) ? 'Command is disabled' : 'Command is enabled';
                if (command.enabled === false) output = 'Command is globally disabled';
                const color = ['Command is disabled', 'Command is globally disable'].includes(output) ? this.axon.template.embed.colors.error : this.axon.template.embed.colors.success;

                return this.sendMessage(msg.channel, {
                    embed: {
                        fields: [
                            {
                                name: 'Command Status',
                                value: output,
                            },
                        ],
                        color,
                    },
                } );
            }
            case 'module': {
                const modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, 'Module not found!');
                let output = guildConf.commands.includes(args[1] ) ? 'Module is disabled' : 'Module is enabled';
                if (modul.enabled === false) output = 'Module is globally disabled';
                const color = ['Module is disabled', 'Module is globally disabled'].includes(output) ? this.axon.template.embed.colors.error : this.axon.template.embed.colors.success;

                return this.sendMessage(msg.channel, {
                    embed: {
                        fields: [
                            {
                                name: 'Module Status',
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
