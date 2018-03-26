// JavaScript source code
var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Bot Setup
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.BOTFRAMEWORK_APPID,
    appPassword: process.env.BOTFRAMEWORK_APPSECRET
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//luis
const LuisModelUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/62f42522-1522-4ead-a4ab-69712ca40dd8?subscription-key=7aeea59a16a5467aacff93989cd145f5&timezoneOffset=0&q=";
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//=========================================================
// Bots Dialogs
//=========================================================
intents.matches('Capital', function (session, args) {
    // Resolve and store entity passed from LUIS.
    var country = builder.EntityRecognizer.findEntity(args.entities, 'country');

    if (country) {
        country = country.entity;
        request("https://restcountries.eu/rest/v1/name/" + country, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                var info = body[0];

                //In case of mulitple results, check for exact matching of country requested. If not found, then go with the first one 
                //because the state will already be in the loop and if result not found then it may case an error.
                for (var i = 0; i < body.length; ++i) {
                    if (body[i].name.toLowerCase() == country) {
                        info = body[i];
                        i = body.length;
                    }
                }

                if (info.capital) {
                    session.endDialog(info.name + "'s capital is " + info.capital + " :)");
                } else {
                    session.endDialog("Sorry, an error occurred. Please try again! :)");
                }
            } else {
                session.endDialog("Sorry, an error occurred. Please try again! :)");
            }
        });
    } else {
        session.endDialog("Sorry, I don\'t think there is any country by that name. Please make sure you've entered the name of the country correctly.");
    }
})

    .matches('Currency', function (session, args) {
        // Resolve and store entity passed from LUIS.
        var country = builder.EntityRecognizer.findEntity(args.entities, 'country');

        if (country) {
            country = country.entity;
            request("https://restcountries.eu/rest/v1/name/" + country, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    var info = body[0];

                //In case of mulitple results, check for exact matching of country requested. If not found, then go with the first one 
                //because the state will already be in the loop and if result not found then it may case an error.
                    for (var i = 0; i < body.length; ++i) {
                        if (body[i].name.toLowerCase() == country) {
                            info = body[i];
                            i = body.length;
                        }
                    }

                    if (info.currencies[0]) {
                        session.endDialog(info.name + "\'s currency is " + info.currencies[0] + " :)");
                    } else {
                        session.endDialog("Sorry, an error occurred. Please try again! :)");
                    }
                } else {
                    session.endDialog("Sorry, an error occurred. Please try again! :)");
                }
            });
        } else {
            session.endDialog("Sorry, I don\'t think there is any country by that name.");
        }
    })

    .matches('Population', function (session, args) {
        // Resolve and store entity passed from LUIS.
        var country = builder.EntityRecognizer.findEntity(args.entities, 'country');

        if (country) {
            country = country.entity;
            request("https://restcountries.eu/rest/v1/name/" + country, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    var info = body[0];

                //In case of mulitple results, check for exact matching of country requested. If not found, then go with the first one 
                //because the state will already be in the loop and if result not found then it may case an error.
                    for (var i = 0; i < body.length; ++i) {
                        if (body[i].name.toLowerCase() == country) {
                            info = body[i];
                            i = body.length;
                        }
                    }

                    if (info.capital) {
                        session.endDialog(info.name + "'s population is " + info.population + " :)");
                    } else {
                        session.endDialog("Sorry, an error occurred. Please try again! :)");
                    }
                } else {
                    session.endDialog("Sorry, an error occurred. Please try again! :)");
                }
            });
        } else {
            session.endDialog("Sorry, I don\'t think there is any country by that name.");
        }
    })

intents.matches('Sports', function (session, args) {

    request("https://newsapi.org/v2/everything?sources=fox-sports&apiKey=b62795c8841d4e06bd96290ab866a986", function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);

                //giving news in loop because the number is unknown
                session.send("Here is some of latest sports related news :)").endDialog;
                for (var i = 0; i < (body.articles).length; ++i) {
                        info = body.articles[i];
                        session.send("Title: " + info.title + "\n" + "Description: " + info.description + "\n" + "For More information: " + info.url).endDialog; 
                }
            } else {
                session.send("Sorry, an error occurredd and I am not able to process the news. Please try again! :)").endDialog;
            }
        });
})


intents.matches('Technology', function (session, args) {

    request("https://newsapi.org/v2/top-headlines?sources=ars-technica&apiKey=b62795c8841d4e06bd96290ab866a986", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

           //giving news in loop because the number is unknown
            session.send("Here is some of latest technology related news :)").endDialog;
            for (var i = 0; i < (body.articles).length; ++i) {
                info = body.articles[i];
                session.send("Title: " + info.title + "\n" + "Description: " + info.description + "\n" + "For More information: " + info.url).endDialog;
            }
        } else {
            session.endDialog("Sorry, an error occurredd and I am not able to process the news. Please try again! :)");
        }
    });
})



    .matches('None', function (session) {
        session.endDialog("I'm sorry I don't understand. I can only find capitals, currencies and population, sports news and technology news.");
    });
