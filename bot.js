const queue = new Map();

client.once('ready', () => {
  console.log('Bot je připojen!');
});

client.once('reconnecting', () => {
  console.log('Bot se znovu připojuje!');
});

client.once('disconnect', () => {
  console.log('Bot byl odpojen!');
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send('Neplatný příkaz!');
  }
  
client.login(process.env.MTA5MzQ1NjI3NTc1NDQ3MTQzNQ.Gf3jMV.8JGqMLdJ3BnKxzgNifPVMHjgnsQLG9e3Wb_IUg)
});
