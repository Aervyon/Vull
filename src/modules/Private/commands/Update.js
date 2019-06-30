import util from 'util';
import child_process from 'child_process';
import { Command } from 'axoncore';
const exec = util.promisify(child_process.exec);

export class Update extends Command {
    constructor(module) {
        super(module);
        this.label = 'update';
        this.infos = {
            owners: ['Null'],
            description: 'Safely update Vull. It may yell at you',
        };
        this.permissions.staff.needed = this.axon.staff.owners;
    }

    async execute({ msg }) {
        let branch = await exec('git branch | grep \\* | cut -d \' \' -f2');
        branch = branch.stdout;
        branch = branch.replace('\\n');
        let vers = await exec('git log -1 --oneline');
        vers = vers.stdout;
        await exec(`git fetch origin ${branch}`);
        let upstream = await exec('git rev-parse @{u}');
        upstream = upstream.stdout;
        let local = await exec('git rev-parse @{0}');
        local = local.stdout;
        let base = await exec('git merge-base @{0} @{u}');
        base = base.stdout;
        let status = await exec('git status --porcelain=2');
        status = status.stdout;

        for (const eh of status.split('\n')) {
            if (eh.match(/^\d+ M\./))
                return this.sendError(msg.channel, 'There are modified files scheduled for committing. Cannot update.');
            if (eh.match(/^\d+ D\./))
                return this.sendError(msg.channel, 'Vull has deleted files scheduled for committing. Cannot update.');
            if (eh.match(/^\d+ R([M.])/))
                return this.sendError(msg.chnnel, 'Vull has renamed files scheduled for committing. Cannot update');
        }

        if (local === upstream) {
            return this.sendError(msg.channel, 'Up to date');
        }
        else if (base === upstream) {
            return this.sendError(msg.channel, 'Ahead of upstream');
        }
        else if (base === local) {
            // Do nothing
        }
        else {
            return this.sendError(msg.channel, 'Diverged');
        }

        let hash;
        if (vers) {
            if (vers.match(/\(\)/)) {
                const eh = vers.split(/\s\(|\)\s/);
                hash = eh[0];
            }
            else {
                const eh = vers.split(' ');
                hash = eh[0];
            }
        }

        const mess = await this.sendMessage(msg.channel, `Updating from ${hash} to ${upstream.slice(0, 7)}...`);
        const update = true;
        let updMess = 'null';

        try {
            const pull = await exec(`git pull origin ${branch}`);
            updMess = pull.stdout;
        }
        catch (err) {
            updMess = err.message || err;
        }

        return mess.edit(`${!update ? 'Update failed. Here is why:' : 'Update success! Git message:'} \`\`\`${updMess}\`\`\`${!update ? 'You will have to manually update Vull.' : 'Restart Vull to see these changes take place.'}`);
    }
}
export default Update;
