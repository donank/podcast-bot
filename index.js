
const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');

const { podcasts } = require('./podcasts.json');
const { larguments } = require('./logic.json');
const { fallacies } = require('./fallacies.json');

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

var listFlag = false
var topicFlag = false
var topicSelected = 0
var choice = 1
var topic
var sol = 0;
var quizStarted = false;

client.on('message', message => {
    console.log("triggered")
    if (!message.guild) return;
    if (message.content === `${prefix}ping`) {
        message.channel.send('pong');
    }
    if (message.content === `${prefix}join`) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    message.reply("PodcastBro connected to voice channel!");
                })
                .catch(console.log);
        }
        else {
            message.reply("You need to join a voice channel first!");
        }
    }
    if (message.content === `${prefix}list`) {
        console.log("list command triggered")

        var podMap = podcasts.map((element, index) => (
            {
                name: (index + 1) + ". " + element.name,
                value: element.description
            }
        ));
        console.log(podMap)

        const listEmbed = {
            color: 0x8700a2,
            title: 'Podcasts',
            description: 'Select the topic by entering \"o!select <number>\"',
            fields: podMap
        };

        message.channel.send({ embed: listEmbed })
        listFlag = true
    }
    var selectCommand = `${prefix}select`
    if (message.content.startsWith(selectCommand)) {
        console.log("Select choice command triggered")

        const args = message.content.slice(selectCommand.length).split();
        const command = args.shift().trim();
        console.log(command)
        if (listFlag == true) {
            if (command > 0 && command <= podcasts.length + 1) {

                var topicMap = podcasts[command - 1].podcasts.map((element, index) => (
                    {
                        name: (index + 1) + ". " + element.name,
                        value: element.link
                    }
                ));
                const topicEmbed = {
                    color: 0x8700a2,
                    title: podcasts[command - 1].name,
                    description: 'Play the podcast by entering \"o!play <number>\"',
                    fields: topicMap
                };

                message.channel.send({ embed: topicEmbed })
                topicFlag = true
                topicSelected = command - 1
            }
        }
    }

    var playCommand = `${prefix}play`
    if (message.content.startsWith(playCommand)) {
        console.log("play triggered")

        const args = message.content.slice(playCommand.length).split();
        const command = args.shift().trim();
        console.log("playing " + podcasts[topicSelected].podcasts[command - 1].link)
        if (topicFlag == true) {
            if (message.member.voiceChannel) {
                console.log("member in voice")
                message.member.voiceChannel.join()
                    .then(connection => {
                        const playEmbed = {
                            color: 0x8700a2,
                            title: 'Now Playing',
                            fields: [{
                                name: podcasts[topicSelected].podcasts[command - 1].name,
                                value: podcasts[topicSelected].podcasts[command - 1].link
                            }]
                        };
                        message.channel.send({ embed: playEmbed })
                        connection.playOpusStream(ytdl(podcasts[topicSelected].podcasts[command - 1].link))
                    })
            }
        }
    }



    var addCommand = `${prefix}add`
    if (message.content.startsWith(addCommand)) {
        console.log("topic triggered")

        const args = message.content.slice(addCommand.length).split();
        const command = args.shift().toLowerCase().trim();
        console.log(command)

        if (command) {

        }
    }

    var starLogicQuizCommand = `${prefix}logicstart`;
    if (message.content.startsWith(starLogicQuizCommand)){
        console.log("logic quiz triggered")
        quizStarted = true
        channelId = message.channelId
        selectQuestion(message);
    }
    if(message.content.startsWith("1") || message.content.startsWith("2") || message.content.startsWith("3") || message.content.startsWith("4")){
        console.log("answer triggered")
        if(quizStarted){
                if(parseInt(message.content) == sol){
                    message.channel.send("Correct Answer")
                    selectQuestion(message);
                }else{
                    message.channel.send("Wrong Answer")
                    selectQuestion(message);
                }
            }  
    }

    var stopLogicQuizCommand = `${prefix}logicstop`;
    if(message.content.startsWith(stopLogicQuizCommand)){
        quizStarted = false
        message.channel.send("Quiz Over")
    }
    
});
var rand = 0
var prevRand = 0
function selectQuestion(message){
        shuffle();
        console.log("rand: " + rand);
        sol = larguments[rand].sol;
        console.log('sol:' + sol)
        const quizEmbed = {
            color: 0x8700a2,
            title: larguments[rand].argument,
            description: `
            1. ${larguments[rand].opt1}
            2. ${larguments[rand].opt2}
            3. ${larguments[rand].opt3}
            4. ${larguments[rand].opt4}
        `,
        };
        message.channel.send({ embed: quizEmbed });
}
shuffle = () =>{
    prevRand = rand
    rand =  Math.floor(Math.random() * Math.floor(larguments.length));
    if(rand == prevRand){
        console.log("Same Question! Reshuffling")
        shuffle()
    }
}
client.login(token);


