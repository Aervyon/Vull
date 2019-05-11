module.exports = bot =>({
    name: 'testemoji',
    run: async (msg) => {
        let message = await msg.channel.createMessage('This is a emoji test');
        let output = await message.addReaction('rgbHoodie:564594462458773525');
        if (!output) return;
        return msg.channel.createMessage(`\`\`\`js\n${output}\`\`\``)
    },
    options: {
        description: 'Test emojis'
    }
})