const queue = new Map();

client.once("ready", () => {
    console.log("Bot je připojen!");
});

client.once("reconnecting", () => {
    console.log("Bot se znovu připojuje!");
});

client.once("disconnect", () => {
    console.log("Bot byl odpojen!");
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith('${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send("Neplatný příkaz!");
    }

    const config = require('./config.json');
    client.login(MTA5MzQ1NjI3NTc1NDQ3MTQzNQ.G3FknN.9cRsl0a7049OjA9m6wOMZCRs_Ir0_sJgAo07i8)
});

async function execute(message, serverQueue) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send("Musíte být v hlasovém kanále, abyste mohli přehrát hudbu!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send(
            "Potřebuji oprávnění k připojení se k hlasovému kanálu a mluvení v něm!'
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            const connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
        else
        serverQueue.songs.push(song);
        return message.channel.send(`**${song.title}** byla přidána do fronty!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "Musíte být v hlasovém kanálu, abyste mohli přeskočit píseň!"
        );
    if (!serverQueue)
        return message.channel.send("Nemohu přeskočit píseň, protože fronta je prázdná!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "Musíte být v hlasovém kanálu, abyste mohli zastavit přehrávání hudby!"
        );

    if (!serverQueue)
        return message.channel.send("Nemohu zastavit přehrávání, protože fronta je prázdná!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(Zacina prehravat: ** $ {song.title} **
        );
}
