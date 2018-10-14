<h1 align='center'>
<a><img 
  src="https://null-void.elixi.re/i/hfav.png"
  height="512"
  width="512"
  alt='Easy Rich Presence'
/>
<a/>
<h1/>

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Screenshot-bot

A simple bot to take screenshots of your device (computer).

# What you need

- Nodejs V8 or higher
- A text editor capable of editing files
- [Discord](https://discordapp.com/download)
- A Discord bot application

# Once you have the bot

Run ```sh
npm install
```
To install all dependencies required by the bot

# About the config

You need everything in the config.

- config.owner # Tells the bot who is the bots owner (So you can access owner only commands)
- config.token # Tells the bot what the token of the app your going to use is
- config.prefix # Tells the bot what prefix you want it to have
- config.status # Tells the bot what status you want it to have
- config.prompt # Tells the bot wether or not you want the bot to have a commandline prompt.

# Autoresponders

You can make new autoresponders (but then you need to restart the bot) to get them to be usable

Autoresponder info:

- wildcard # True or false (wether or not the bot searches the entire message for the trigger)
- Trigger # The trigger is what the bot searches for in the message
- Reponse # The response to the trigger

Autoresponder does not need a prefix to respond.
