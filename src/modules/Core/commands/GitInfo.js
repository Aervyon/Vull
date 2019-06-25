import util from 'util';
// eslint-disable-next-line camelcase
import child_process from 'child_process';
import { Command } from 'axoncore';

const exec = util.promisify(child_process.exec);

class LatestCommit extends Command {
    constructor(module) {
        super(module);
        this.label = 'gitinfo';
        this.aliases = ['gi'];

        this.infos = {
            owners: ['Null'],
            description: 'Show the branch and latest commit Vull is on, as well as its status',
        };
    }

    async execute( { msg } ) {
        let branch = await exec('git branch | grep \\* | cut -d \' \' -f2');
        branch = branch.stdout;
        branch = branch.replace('\\n');
        let vers = await exec('git log -1 --oneline');
        vers = vers.stdout;
        // Handle git status
        await exec(`git fetch origin ${branch}`);
        let upstream = await exec('git rev-parse @{u}');
        upstream = upstream.stdout;
        let local = await exec('git rev-parse @{0}');
        local = local.stdout;
        let base = await exec('git merge-base @{0} @{u}');
        base = base.stdout;
        let status = await exec('git status --porcelain=2');
        status = status.stdout;
        let arr = [];
        for (const eh of status.split('\n') ) {
            if (eh.match(/^\d+ \.M/) && !arr.includes('Vull has modifed files not scheduled for commiting') ) arr.push('Vull has modifed files not scheduled for commiting');
            if (eh.match(/^\d+ M\./) && !arr.includes('Vull has modifed files scheduled for commiting') ) arr.push('Vull has modifed files scheduled for commiting');
            if (eh.match(/^\? /) && !arr.includes('Vull has untracked files') ) arr.push('Vull has untracked files');
            if (eh.match(/^\d+ \.D/) && !arr.includes('Vull has deleted files not scheduled for commiting') ) arr.push('Vull has deleted files not scheduled for commiting');
            if (eh.match(/^\d+ D\./) && !arr.includes('Vull has deleted files scheduled for commiting') ) arr.push('Vull has deleted files scheduled for commiting');
            if (eh.match(/^\d+ R(M|\.)/) && !arr.includes('Vull has renamed files scheduled for commiting') ) arr.push('Vull has renamed files scheduled for commiting');
        }

        let uh = 'Up to date';
        if (local === upstream) uh = 'Up to date';
        else if (base === local) uh = 'Out of date';
        else if (base === upstream) uh = 'Ahead of upstream';
        else uh = 'Diverged';

        // Back to handling versions/branchs
        let hash,
            title;
        const desc = [];
        if (vers) {
            if (vers.match(/\(\)/) ) {
                const eh = vers.split(/\s\(|\)\s/);
                hash = eh[0];
                title = eh[2];
            } else {
                const eh = vers.split(' ');
                hash = eh[0];
                title = eh.slice(1).join(' ');
            }
        }
        if (branch) desc.push( { name: 'Branch', value: branch, inline: true } );
        if (hash) desc.push( { name: 'Commit', value: hash, inline: true } );
        if (title) desc.push( { name: 'Commit title', value: title, inline: true } );
        if (arr.length > 0) desc.push( { name: 'File status', value: arr.join('\n'), inline: true } );
        if (desc && desc.length > 0) return this.sendMessage(msg.channel, {
            embed: {
                color: this.axon.configs.template.embed.colors.help,
                title: 'Git Info',
                fields: desc,
                description: uh === 'Diverged' ? `Vull has diverged from upstream branch` : `Vull is ${uh}`, // Handle if the branchs have diverged
            },
        } );
        return this.sendError(msg.channel, 'No data avaliable');
    }
}

export default LatestCommit;
