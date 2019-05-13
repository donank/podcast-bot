
const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');

const { podcasts } = require('./podcasts.json')

const ytdl = require('ytdl-core');

const client = new Discord.Client();
const queue = new Map();

client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

var flag = false
var choice = 1
client.on('message', message => {
    console.log("triggered")
    if(!message.guild) return;
    if (message.content === `${prefix}ping`) {
        message.channel.send('pong');
    }
    if (message.content === `${prefix}join`) {
        if(message.member.voiceChannel){
            message.member.voiceChannel.join()
            .then(connection => {
                message.reply("PodcastBro connected to voice channel!");
            })
            .catch(console.log);
        }
        else{
            message.reply("You need to join a voice channel first!");
        }
    }
    if (message.content === `${prefix}list`) {
        console.log("list command triggered")
        const embed = new Discord.RichEmbed()
        .setColor('#8700a2')
        .setTitle('Topics')
        .setDescription('Select the topic by entering \"o!select <number>\"')
        .addField('1. Politics', 'Placeholder')
        .addField('2. Economics', 'PlacedHolder')
        .addField('3. Policy', 'PlaceHolder')
        .addField('4. Law', 'PlaceHolder')
        .addField('5. History', 'PLaceHolder')

        message.channel.send(embed)
        flag = true
    }
    if (message.content === `${prefix}select`) {
        console.log("Select choice command triggered")
        if(flag == true){
            switch(choice){
                case 1:{
                    console.log("1 triggered")
                    var pol_map = [];
                    var pol_map = politics.map((element, index) => (
                        {
                            name: (index+1)+ ". "+element.name, 
                            value: element.link
                        }
                    ));
                    console.log(pol_map)
                    const subEmbed = {
                        color: 0x8700a2,
                        title: 'Politics',
                        description: 'Select the audio by entering \"o!play <number>\"',
                        fields: pol_map
                    };
                    message.channel.send({embed: subEmbed})
                }
                case 2:{
                    
                }
                case 3:{
    
                }
                case 4:{
    
                }
                case 5:{
    
                }
            }
        }
    }

    if(message.content === `${prefix}add`+` `+`${topic}`){

    }
});

client.login(token);


