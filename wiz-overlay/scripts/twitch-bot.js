// Simple Twitch bot for updating stats via chat commands
const tmi = require('tmi.js');
const fetch = require('node-fetch');

const channel = 'YOUR_CHANNEL_NAME'; // <-- set your channel name
const apiBase = 'http://localhost:3000/api'; // <-- set your API base URL
const allowedItems = ['ledx','gpu','bitcoin','redKeycard','blueKeycard','labsKeycard','pmcKills','totalDeaths'];

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'YOUR_BOT_USERNAME',
    password: 'oauth:YOUR_TWITCH_OAUTH_TOKEN',
  },
  channels: [ channel ]
});

client.connect();

client.on('message', async (channel, tags, message, self) => {
  if(self) return;
  if(!tags.mod && tags['user-type'] !== 'mod' && tags.username !== channel.replace('#','')) return;

  const incMatch = message.match(/^!add (\w+)$/i);
  const decMatch = message.match(/^!remove (\w+)$/i);
  if (incMatch && allowedItems.includes(incMatch[1])) {
    await fetch(`${apiBase}/inc/${incMatch[1]}`, { method: 'POST' });
    client.say(channel, `+1 ${incMatch[1]}`);
  }
  if (decMatch && allowedItems.includes(decMatch[1])) {
    await fetch(`${apiBase}/dec/${decMatch[1]}`, { method: 'POST' });
    client.say(channel, `-1 ${decMatch[1]}`);
  }
}); 