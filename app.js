
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
        collector.on('collect', msg => {
            if (!isNaN(msg)) {
                choice = msg;
                message.channel.send(`You have selected \`${choice} . ${books[choice - 1].name} by ${books[choice - 1].author}\`.`);
                collector.stop();
                message.channel.send("Enter page number!");
                const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                collector2.on('collect', m => {
                    if (!isNaN(m)) {
                        readBook(choice, message, m);
                    }
                })
            }
        })
    }

    var readBook = function (choice, message, count) {
        console.log("readBook called " + count);
        message.channel.send("\`Press 'n' to read current/next page | 'p' for previous page\`")
        var pageText = ""
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', msg => {
            if (msg = 'n') {
                console.log("n pressed " + count)
                var loadingTask = pdfjs.getDocument(books[choice - 1].pdf_url);

                loadingTask.promise.then((pdf) => {
                    var maxPages = pdf.numPages;
                    var page = pdf.getPage(count);
                    page.then((page) => {
                        var textContent = page.getTextContent();
                        textContent.then((text) => {
                            pageText = text.items.map(s => s.str).join('')
                            var splitPage1 = pageText.substring(0, (pageText.length) / 2)
                            var splitPage2 = pageText.substring((pageText.length) / 2, pageText.length)
                            message.channel.send(splitPage1)
                            message.channel.send(splitPage2)

                        }, reason => {
                            console.error(reason);
                        })
                    }, reason => {
                        console.error(reason);
                    });
                }, reason => {
                    console.error(reason);
                });

                collector.stop();
                readBook(choice, message, parseInt(count) + 1)
            } else if (msg = 'p' && count > 1) {
                console.log("p pressed " + count)
                readBook(choice, message, parseInt(count) - 1)
            }
        })
    }

    var addCommand = `${prefix}add`
    if (message.content.startsWith(addCommand)) {
        message.channel.send("Enter the name of the book").then(() => {
            message.channel.awaitMessages(filter, { max})
        })
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
        collector.on('collect', m => {
            collector.stop();
        })
        collector.on('end', collected => {
            console.log("collector stopped")
        })


    }

    var bmiCommand = `${prefix}bmi`
    if (message.content.startsWith(bmiCommand)) {
        const args = message.content.slice(bmiCommand.length).split();
        const command = args.shift().trim();
        console.log(command)

        var splitCommand = command.split(".")
    }

    /*if (message){
        console.log(`${message.createdAt} \: ${message.channel.name} \: [${message.channel.id}] \: ${message.author.username} \: ${message.content} `)
    }*/
});
client.login(token);