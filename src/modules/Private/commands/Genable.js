import { Command } from 'axoncore';

class Genable extends Command {
    constructor(module) {
        super(module);
        this.label = 'genable';

        this.infos = {
            owners: ['Null'],
            description: 'Globally Disable a command or module',
            usage: 'genable [type] [label]',
            examples: ['genable command game', 'genable module Info'],
        };

        this.options.argsMin = 2;
        this.guildOnly = true;

        this.permissions.staff.needed = this.axon.staff.admins;
        this.permissions.staff.bypass = this.axon.staff.owners;
    }

    async execute( { msg, args, guildConf } ) {
        switch (args[0] ) {
            case 'command': {
                let command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, 'Command not found!');
                if (command.enabled) return this.sendError(msg.channel, 'Command already enabled!');
                try {
                    this.axon.AxonUtils.updateGlobalStateCommand(args[1], true);
                    command = this.getCommand(args[1] );
                    if (command.enabled) {
                        return this.sendSuccess(msg.channel, 'Command enabled!');
                    }
                    return this.sendError(msg.channel, 'Something unkmown happened while enabling the command!');
                } catch (err) {
                    return this.sendError(msg.channel, `An error occured while enabling the command!\n\`\`\`js\n${err.message || err}\`\`\``);
                }
            }
            case 'module': {
                let modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, 'Module not found!');
                if (modul.enabled) return this.sendError(msg.channel, 'Module already enabled');
                try {
                    this.axon.AxonUtils.updateGlobalStateModule(args[1], false);
                    modul = this.getModule(args[1] );
                    if (modul.enabled) {
                        return this.sendSuccess(msg.channel, 'Module enabled!');
                    }
                    return this.sendError(msg.channel, 'Something unknown happened while enabling the module!');
                } catch (err) {
                    return this.sendError(msg.channel, `An error occured while enabling the module!\`\`\`js\n${err.message || err}\`\`\``);
                }
            }
            default: {
                return this.sendHelp( { msg, guildConf } );
            }
        }
    }
}

export default Genable;
