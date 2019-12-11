
const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');
const { books } = require('./books.json');
const pdfjs = require('pdfjs-dist');
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

client.on('message', message => {
    if (!message.guild) return;
    if (message.content === `${prefix}ping`) {
        message.channel.send('pong');
    }

    if (message.content === `${prefix}start`) {
        console.log("Start triggered")
        var descriptionText = "Alright Let's start"
        var stopEmbed = {
            color: 0xA7CEE4,
            title: "Trivia Over",
            description: descriptionText
        }
        var start = new Discord.RichEmbed()
            .setTitle()
            .attachFile('./assets/political/raga_smile.jpg')
        message.channel.sendEmbed(start);
    }

    var choice = 0
    if (message.content === `${prefix}books`) {

        console.log("Books triggered")

        var bookMap = books.map((element, index) => ({
            name: `${index + 1}` + ". " + element.name,
            value: element.author
        }));
        console.log(bookMap);

        const bookEmbed = {
            color: 0xa7cee4,
            title: 'Books',
            description: 'Select a book',
            fields: bookMap
        };

        message.channel.send({ embed: bookEmbed })
        listFlag = true;

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        console.log(collector);
        collector.on('collect', msg => {
            if (!isNaN(msg)) {
                choice = msg;
                message.channel.send(`You have selected \`${choice} . ${books[choice - 1].name} by ${books[choice - 1].author}\`.`);
                readBook(choice, message, 1);
            }
        })
    }

    var readBook = function (choice, message, count) {
        console.log("readBook called");
        message.channel.send("Press 'n' to read text!")

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', msg => {
            if (msg = 'n') {
                console.log("n pressed")
                var loadingTask = pdfjs.getDocument(books[choice - 1].pdf_url);
                loadingTask.promise.then(function (pdf) {
                    var maxPages = pdf.numPages;
                    console.log(maxPages);
                    var page = pdf.getPage(count);
                    var txt = ""
                    page.then(function (page) {
                        var textContent = page.getTextContent();
                        textContent.then(function (text) {
                            text.items.map(function (s) {
                                message.channel.send(s.str)
                            })
                        })
                    })
                });
                readBook(choice, message, count + 1)
            } else {

            }
        })
    }

    function postText(pdf, message) {
        console.log("postText called")


    }

    var addCommand = `${prefix}add`
    if (message.content.startsWith(addCommand)) {
        const args = message.content.slice(addCommand.length).split();
        const command = args.shift().trim();
        console.log(command);

        var splitCommand = command.split(".")


    }

    var bmiCommand = `${prefix}bmi`
    if (message.content.startsWith(bmiCommand)) {
        const args = message.content.slice(bmiCommand.length).split();
        const command = args.shift().trim();
        console.log(command)

        var splitCommand = command.split(".")
    }
});
client.login(token);
