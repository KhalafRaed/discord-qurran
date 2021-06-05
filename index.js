const { Client } = require('discord.js')
const schedule = require('node-schedule');

const client = new Client();

client.login(process.env.token);

const CRON_EVERYDAY_AT_10 = '0 10 * * *'
const DEFAULT_CHANNEL_NAME = '8ra2at'

let job;
let activePage = 176;

client.once('ready', async () => {
    const defaultChannel = client.channels.cache.find(channel => channel.name === DEFAULT_CHANNEL_NAME);
    setup(defaultChannel, CRON_EVERYDAY_AT_10)
});

client.on('message', (message) => {
    if (message.author.bot) {
        return;
    }
    if (message.content.indexOf('qurran-configure-page') !== -1) {
        const msg = message.content.replace('qurran-configure-page', '');
        try {
            const newActivePage = Number.parseInt(msg);
            if (!(newActivePage < 604 && newActivePage > 0)) {
                message.channel.send("The new page count should be within [604, 0]")
                console.error("ERROR invalid range")
            } else {
                activePage = newActivePage;
                console.log("SUCCESS")
                message.channel.send("Now the active page is " + activePage)
            }
        } catch (e) {
            console.error("ERROR")
            message.channel.send("The Page # is invalid")
        }
    } else if (message.content.indexOf('send qurran') !== -1) {
        message.channel.send(`https://www.daily-quran.com/static/pages/page-${activePage}.jpg`)
        message.channel.send(`https://www.daily-quran.com/static/pages/page-${activePage + 1}.jpg`)
        activePage = activePage + 2;
    }
});

const setup = (channel, cronExp) => {
    job = schedule.scheduleJob(cronExp, function(){
        channel.send(`https://www.daily-quran.com/static/pages/page-${activePage}.jpg`)
        channel.send(`https://www.daily-quran.com/static/pages/page-${activePage + 1}.jpg`)
        activePage = activePage + 2;
    });
};