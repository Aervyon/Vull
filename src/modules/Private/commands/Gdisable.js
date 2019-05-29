import { Command } from 'axoncore';

class Gdisable extends Command {
    constructor(module) {
        super(module);
        this.label = 'gdisable';

        this.infos = {
            owners: ['Null'],
            description: 'Globally Disable a command or module',
            usage: 'gdisable [type] [label]',
            examples: ['gdisable command game', 'gdisable module Info'],
        };

        this.options.argsMin = 2;
        this.guildOnly = true;

        this.permissions.staff.needed = this.axon.staff.admins;
        this.permissions.staff.bypass = this.axon.staff.owners;
        this.protectedCmds = [
            'diagnose',
            'disable',
            'enable',
        ];
    }

    async execute( { msg, args, guildConf } ) {
        switch (args[0] ) {
            case 'command': {
                let command = this.getCommand(args[1] );
                if (!command) return this.sendError(msg.channel, 'Command not found!');
                if (command.module.label === this.module.label) return this.sendError(msg.channel, `Commands within the \`${this.module.label}\` module cannot be disabled via command!`);
                if (this.protectedCmds.includes(command.label) ) return this.sendError(msg.channel, `Command \`${command.label}\` cannot be disabled as that is a core management command for Vull`);
                if (!command.enabled) return this.sendError(msg.channel, 'Command already disabled!');
                try {
                    this.axon.AxonUtils.updateGlobalStateCommand(args[1], false);
                    command = this.getCommand(args[1] );
                    if (!command.enabled) {
                        return this.sendSuccess(msg.channel, 'Command disabled!');
                    }
                    return this.sendError(msg.channel, 'Something unkmown happened while disabling the command!');
                } catch (err) {
                    return this.sendError(msg.channel, `An error occured while disabling the command!\n\`\`\`js\n${err.message || err}\`\`\``);
                }
            }
            case 'module': {
                let modul = this.getModule(args[1] );
                if (!modul) return this.sendError(msg.channel, 'Module not found!');
                if (modul.label === this.module.label) return this.sendError(msg.channel, `The \`${this.module.label}\` module cannot be disabled via command!`);
                if (!modul.enabled) return this.sendError(msg.channel, 'Module already disabled');
                try {
                    this.axon.AxonUtils.updateGlobalStateModule(args[1], false);
                    modul = this.getModule(args[1] );
                    if (!modul.enabled) {
                        return this.sendSuccess(msg.channel, 'Module disabled!');
                    }
                    return this.sendError(msg.channel, 'Something unknown happened while disabling the module!');
                } catch (err) {
                    return this.sendError(msg.channel, `An error occured while disabling the module!\`\`\`js\n${err.message || err}\`\`\``);
                }
            }
            default: {
                return this.sendHelp( { msg, guildConf } );
            }
        }
    }
}

export default Gdisable;
