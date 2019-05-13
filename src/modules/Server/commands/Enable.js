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
    }

    async execute( { msg, args, guildConf } ) {
        switch (args[0] ) {
            case 'command': {
                const command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, 'Command not found!');
                if (command.serverBypass === true) return this.sendError(msg.channel, 'Command is protected!');
                if (!guildConf.commands.includes(args[1] ) ) return this.sendError(msg.channel, 'Command already enabled!');
                try {
                    const conf = await this.axon.AxonUtils.updateGuildStateCommand(msg.channel.guild.id, args[1], true);
                    if (!conf.commands.includes(args[1] ) ) {
                        return this.sendSuccess(msg.channel, 'Command enabled!');
                    }
                    return this.sendError(msg.channel, 'Something unkmown happened while enabling the command!');
                } catch (err) {
                    return this.sendError(msg.channel, 'An error occured while enabling the command');
                }
            }
            case 'module': {
                const modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, 'Module not found!');
                if (modul.serverBypass === true) return this.sendError(msg.channel, 'Module is protected!');
                if (!guildConf.modules.includes(args[1] ) ) return this.sendError(msg.channel, 'Module already enabled');
                try {
                    const conf = await this.axon.AxonUtils.updateGuildStateModule(msg.channel.guild.id, args[1], true);
                    if (!conf.modules.includes(args[1] ) ) {
                        return this.sendSuccess(msg.channel, 'Module enabled!');
                    }
                    return this.sendError(msg.channel, 'Something unknown happened while enabling the module!');
                } catch (err) {
                    return this.sendError(msg.channel, 'An error occured while enabling the module!');
                }
            }
            default: {
                return this.sendHelp( { msg, guildConf } );
            }
        }
    }
}

export default Enable;
