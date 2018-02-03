//import { concat } from "../../../../../../Users/shadab/Library/Caches/typescript/2.6/node_modules/@types/async";

var bot;
var channelId;

var reqHandler = require("../../tools/reqHandler");
var votesDB = require("../../Schema/votes");
var voteItemsDB = require("../../Schema/voteItems");
var surveysDB = require("../../Schema/surveys");
var surveyResultsDB = require("../../Schema/surveyResults");



//types:      0:mainMenueKeys   ,   1:voteItemKeys   ,   2:scoreKeys    ,   3:surveyKeys

///////////////////////////////////////////////////////
//TODO: these variables could be filled automaticly:
var scoreCount = 5;
///////////////////////////////////////////////////////
var voteItemTitle;



module.exports = function (mainBot) {
    bot = mainBot;
    //callback for mainMenueKeys
    bot.callback(function (query, next) {
        var data;
        try {
            data = JSON.parse(query.data);
        } catch (e) {
            return next();
        }
        if (data.type !== 0)
            return next();
        if (data.action == "channelVoting") {

            keyboards.fillChannelVoteItems(function (generatedKeys) {
                console.log(generatedKeys)
                reqHandler("sendMessage", {
                    text: "لطفا کانال مورد نظر خود را انتخاب نمایید.",
                    chat_id: query.from.id,
                    reply_markup: {
                        inline_keyboard: generatedKeys
                    }
                }, function (body) {})
            });
        } else if (data.action == "programsVoting") {
            keyboards.fillProgramVoteItems(function (generatedKeys) {
                console.log(generatedKeys)
                reqHandler("sendMessage", {
                    text: "لطفا برنامه مورد نظر خود را انتخاب نمایید.",
                    chat_id: query.from.id,
                    reply_markup: {
                        inline_keyboard: generatedKeys
                    }
                }, function (body) {})
            });
        }
    });
    //callback for voteItemsKeys - program voting
    bot.callback(function (query, next) {
        var data;
        try {
            data = JSON.parse(query.data);
        } catch (e) {
            return next()
        }
        if (data.type !== 1) {
            return next();
        } else {
            // var voteItemTitle;
            keyboards.fillScoreKeys(scoreCount, data.voteItemId, function (generatedKeys) {

                ///////////////////////////////////////////

                voteItemsDB.findById(data.voteItemId).exec(function (err, result) {

                    if (err) throw err;
                    console.log(result);
                    voteItemTitle = result._doc.title;
                    // data.voteItemId=result._doc.title;
                    reqHandler("sendMessage", {

                        text: "به " + voteItemTitle + " از ۱ تا ۵ چه امتیازی می دهید؟",
                        // text: "به " + data.voteItemId + " از ۱ تا ۵ چه امتیازی می دهید؟",
                        chat_id: query.from.id,

                        reply_markup: {
                            inline_keyboard: generatedKeys
                        }
                    }, function (body) {})
                });
                console.log(voteItemTitle);

                ///////////////////////////////////////////

                //console.log("data: "+data);
            })
        }
    })

    //callback for scoreKeys
    bot.callback(function (query, next) {
        var data;
        try {
            data = JSON.parse(query.data);
        } catch (e) {
            return next();
        }
        if (data.type !== 2)
            return next();
        else {

            var newVote = new votesDB({
                chatId: query.from.id,
                vote: {
                    destinationId: data.voteItemId, //channelId or voteItemId
                    score: data.score
                }
            })

            newVote.save(function (err, savedVote) {
                console.log(err)

                if (err) {
                    keyboards.fillScoreKeys(scoreCount, data.voteItemId, function (generatedKeys) {

                        reqHandler("sendMessage", {
                            text: 'نظر شما ثبت نشد. لطفا دوباره سعی کنید.',
                            chat_id: query.from.id,
                            reply_markup: {
                                inline_keyboard: keyboards.scoreKeys
                            }
                        }, function (body) {});
                    })
                } else {
                    reqHandler("sendMessage", {
                        text: 'نظر شما با موفقیت ثبت شد.',
                        chat_id: query.from.id,
                    }, function (body) {});
                }
            });
        }
    });
    //callback for voteItemKeys
    bot.callback(function (query, next) {
        var data;
        try {
            data = JSON.parse(query.data);
        } catch (e) {
            return next();
        }
        if (data.type !== 2)
            return next();
        else {
            var newVote = new votesDB({
                chatId: query.from.id,
                vote: {
                    destinationId: data.voteItemId,
                    score: data.score
                }
            })
            newVote.save(function (err, savedVote) {
                console.log(err)

                if (err)
                    reqHandler("sendMessage", {
                        text: 'نظر شما ثبت نشد. لطفا دوباره سعی کنید.',
                        chat_id: query.from.id,
                        reply_markup: {
                            inline_keyboard: scoreKeys
                        }
                    }, function (body) {});
                else {

                    reqHandler("sendMessage", {
                        text: 'نظر شما با موفقیت ثبت شد.',
                        chat_id: query.from.id,
                    }, function (body) {});

                }
            });
        }
    });

    //callback for surveyKeys
    bot.callback(function (query, next) {

        var data;
        try {
            data = JSON.parse(query.data);
        } catch (e) {
            return next();
        }
        if (data.type !== 3)
            return next();
        else {
            var keyIndex = data.keyIndex;
            surveysDB.findById(data.surveyId).exec(function (error, keyboard) {
                if (error) throw error;

                else {
                    var keyText = keyboard._doc.keyboard[keyIndex]
                    console.log(keyText)

                    var surveyResult = new surveyResultsDB({
                        chatId: query.from.id,
                        
                            surveyId: data.surveyId, //surveyId
                            text: keyText
                        
                    })
                    surveyResult.save(function (err, savedSurveyResult) {
                        console.log(err)

                        if (err)
                            reqHandler("sendMessage", {
                                text: 'نظر شما ثبت نشد. لطفا دوباره سعی کنید.',
                                chat_id: query.from.id,
                                reply_markup: {
                                    inline_keyboard: keyboards.surveyKeys
                                }
                            }, function (body) {});
                        else {

                            reqHandler("sendMessage", {
                                text: 'نظر شما با موفقیت ثبت شد.',
                                chat_id: query.from.id,
                            }, function (body) {});

                        }
                    })

                }
            })
        }

    })
}
// module.exports=callSurvey;