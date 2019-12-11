
const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');

const { podcasts } = require('./podcasts.json');
const { larguments } = require('./logic.json');
const { fallacies } = require('./fallacies.json');


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
var sol = 0;
var quizStarted = false;
var scores = []
client.on('message', message => {
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

    /* Critical thinking and logical reasoning Quiz*/

    var starLogicQuizCommand = `${prefix}logix`;
    var channel
    if (message.content.startsWith(starLogicQuizCommand)) {
        console.log("logic quiz triggered")
        const args = message.content.slice(starLogicQuizCommand.length).split();
        const command = args.shift().trim();
        console.log(command)
        if (command == "start") {
            channel = message.channelId
            quizStarted = true
            selectQuestion(message)
        }
        if (command == "stop" && channel == message.channelId) {
            quizStarted = false
            var descriptionText = "💠 Scores 💠 \n\n" + scores.map((s, i) => "" + " `" + s.name + "` **→** **" + s.score + "**\n")
            descriptionText = descriptionText.replace(",", "")
            var stopEmbed = {
                color: 0xA7CEE4,
                title: "Trivia Over",
                description: descriptionText
            }
            message.channel.send({ embed: stopEmbed })
            scores = []
        }
    }

    if (message.content.startsWith("1") || message.content.startsWith("2") || message.content.startsWith("3") || message.content.startsWith("4")) {
        console.log("answer triggered")
        var userExists = false
        if (quizStarted && channel == message.channelId) {
            scores.forEach(s => {
                if (s.name == message.member.displayName.toString()) {
                    userExists = true
                }
            })
            console.log("userExists: " + userExists)
            if (!userExists) {
                scores.push({
                    name: message.member.displayName.toString(),
                    score: 0
                })
            }
            if (parseInt(message.content) == sol) {
                scores.forEach(s => {
                    if (s.name == message.member.displayName.toString()) {
                        s.score = s.score + 1
                    }
                })
            }
        }
    }

    var fallaciesCommand = `${prefix}fallacies`
    if (message.content.startsWith(fallaciesCommand)) {
        console.log("fallacies command triggered")
        var fallaciesMap
        var i = 0
        while (i < fallacies.length) {
            fallaciesMap = fallaciesMap + "**" + fallacies[i].name + "**\n" + fallacies[i].fallacies.map((f, index) => (i + 1).toString() + "." + (index + 1).toString() + ": " + f.name).join('\n') + "\n\n"
            i = i + 1
        }

        fallaciesMap = fallaciesMap.replace("undefined", "")
        var fallaciesEmbed = {
            color: 0xA7CEE4,
            title: "Different Types of Fallacies",
            description: fallaciesMap
        }
        message.channel.send({ embed: fallaciesEmbed })
    }

    var fallacyCommand = `${prefix}fallacy`
    if (message.content.startsWith(fallacyCommand)) {
        console.log("fallacy command triggered")
        const args = message.content.slice(fallacyCommand.length).split();
        const command = args.shift().trim();
        console.log(command);
        var splitCommand = command.split(".")
        console.log(fallacies[splitCommand[0] - 1].fallacies[splitCommand[1] - 1].name)
        var fallacyEmbed = {
            color: 0xA7CEE4,
            title: fallacies[splitCommand[0] - 1].fallacies[splitCommand[1] - 1].name,
            description: `
                **Description:** ${fallacies[splitCommand[0] - 1].fallacies[splitCommand[1] - 1].description} 
                
                **Example:** *${fallacies[splitCommand[0] - 1].fallacies[splitCommand[1] - 1].example}*
            `
        }

        message.channel.send({ embed: fallacyEmbed })
    }

    var helpCommand = `${prefix}help`
    if (message.content.startsWith(helpCommand)) {
        console.log("help command triggered")
        var helpEmbed = {
            color: 0xA7CEE4,
            title: "Commands",
            description: `
                **Trivia Start** : -logix start
                **Trivia Stop** : -logix stop
                **List all fallacies** : -fallacies
                **Selected Fallacy description** : -fallacy <base type number.fallacy number>
                for ex: -fallacy 1.1
            `
        }

        message.channel.send({ embed: helpEmbed })
    }

    if(message.author.id == 219044642354626562){
        let msg = message.toString().split("")
        var msg1 = ""

        msg.forEach((char, index) => {
            if(index % 2 == 0){
                char = char.toUpperCase();
            }
            console.log(char)
            msg1 += char
        })
        console.log(msg1)
        message.channel.send(msg1)
    }

});
var rand = 0
var prevRand = 0
var timeup = false
async function selectQuestion(message) {
    while (quizStarted) {
        shuffle();
        console.log("rand: " + rand);
        sol = larguments[rand].sol;
        console.log('sol:' + sol)
        var timerValue = countWords(larguments[rand].argument)
        const quizEmbed = {
            color: 0xA7CEE4,
            title: "`Argument`",
            description: `

        **${larguments[rand].argument}**

            *Select your answer*
            1. ${larguments[rand].opt1}
            2. ${larguments[rand].opt2}
            3. ${larguments[rand].opt3}
            4. ${larguments[rand].opt4}

        \`Wait Time : ${timerValue} seconds\`
        `,
        };
        
        message.channel.send({ embed: quizEmbed });
        await timer(timerValue*1000)
        message.channel.send()
        var descriptionText = "`Answer`: "+"**"+ sol +"** \n\n 💠 Scores 💠 \n\n" + scores.map((s, i) => "" + " `" + s.name + "` **→** **" + s.score + "**\n")
        descriptionText = descriptionText.replace(",", "")
        var nextEmbed = {
            color: 0xA7CEE4,
            title: "Status",
            description: descriptionText
        }
        if(quizStarted){
            message.channel.send({ embed: nextEmbed })
        }
    }
}

countWords = (str) => {
    return str.trim().split(/\s+/).length
}

timer = (ms) => {
    return new Promise(res => setTimeout(res, ms))
}
shuffle = () => {
    prevRand = rand
    rand = Math.floor(Math.random() * Math.floor(larguments.length));
    if (rand == prevRand) {
        console.log("Same Question! Reshuffling")
        shuffle()
    }
}
client.login(token);


