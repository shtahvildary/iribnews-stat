//import { concat } from "../../../../../../Users/shadab/Library/Caches/typescript/2.6/node_modules/@types/async";

var bot;
var channelId;

var reqHandler = require("../../tools/reqHandler");
var votesDB = require("../../Schema/votes");
var voteItemsDB = require("../../Schema/voteItems");
var surveysDB = require("../../Schema/surveys");
var contextDB = require("../../Schema/contexts");
var surveyResultsDB = require("../../Schema/surveyResults");
var surveyResults = require("../../tools/surveyResults");
var votingResults = require("../../tools/votingResults");

//types:      0:mainMenueKeys   ,   1:voteItemKeys   ,   2:scoreKeys    ,   3:surveyKeys  ,   4:voteOrCommentKeys    

///////////////////////////////////////////////////////
//TODO: these variables could be filled automaticly:
var scoreCount = 5;
///////////////////////////////////////////////////////
var voteItemTitle;

module.exports = function(mainBot) {
  bot = mainBot;
  
  //callback for mainMenueKeys
  bot.callback(function(query, next) {
    var data;
    try {
      data = JSON.parse(query.data);
    } catch (e) {
      return next();
    }
    if (data.type !== 0) return next();
    if (data.action == "channelVoting") {
      keyboards.fillChannelVoteItems(function(generatedKeys) {
        reqHandler(
          "sendMessage",
          {
            text: "لطفا کانال مورد نظر خود را انتخاب نمایید.",
            chat_id: query.from.id,
            reply_markup: {
              inline_keyboard: generatedKeys
            }
          },
          function(body) {}
        );
      });
    } else if (data.action == "programsVoting") {
      keyboards.fillProgramVoteItems(function(generatedKeys) {
        
        reqHandler(
          "sendMessage",
          {
            text: "لطفا برنامه مورد نظر خود را انتخاب نمایید.",
            chat_id: query.from.id,
            reply_markup: {
              inline_keyboard: generatedKeys
            }
          },
          function(body) {}
        );
      });
    }
  });

  


  //callback for voteItemsKeys - program voting
  bot.callback(function(query, next) {
    var data;
    try {
      data = JSON.parse(query.data);
    } catch (e) {
      return next();
    }
    if (data.type !== 1) return next();
    else {
      // var voteItemTitle;
      // keyboards.fillScoreKeys(scoreCount, data.voteItemId, function(
      //   generatedKeys
      // ) {

        
        ///////////////////////////////////////////

        voteItemsDB.findById(data.voteItemId).exec(function(err, result) {
          if (err) throw err;
          voteItemTitle = result._doc.title;
          // data.voteItemId=result._doc.title;
          var thisKeyboard=keyboards.voteOrCommentKeys
          var callbackData=JSON.parse(thisKeyboard[0][0].callback_data)
          callbackData.id=data.voteItemId;
          thisKeyboard[0][0].callback_data=JSON.stringify(callbackData)
          callbackData=JSON.parse(thisKeyboard[0][1].callback_data)
          callbackData.id=data.voteItemId;
          thisKeyboard[0][1].callback_data=JSON.stringify(callbackData)
          
          reqHandler("sendMessage",
          {text:"لطفا انتخاب کنید:",
            chat_id: query.from.id,

          reply_markup: {
            inline_keyboard: thisKeyboard}
          },function(body) {})
          
        });

        ///////////////////////////////////////////

        //("data: "+data);
      // });
    }
  });


  bot.callback(function(query, next) {
    var data;
    try {
      data = JSON.parse(query.data);
    } catch (e) {
      return next();
    }
    if (data.type !== 4) return next();
    if (data.action == "comment") {
      contextDB.update({chatId:query.from.id},{chatId:query.from.id,comment:1,destinationId:data.id},{upsert:true}).exec(function(error,result){
        if(error){
          reqHandler("sendMessage",
          {text:"لطفا دوباره انتخاب کنید:",
            chat_id: query.from.id,

          reply_markup: {
            inline_keyboard: keyboards.voteOrCommentKeys}
          },function(body) {})
        }
        else{
        reqHandler(
          "sendMessage",
          {
            text: "از اینکه نظر خود را با ما درمیان می گذارید کمال تشکر را داریم.",
            chat_id: query.from.id,
            
      },
    function(body){
    });}
  });
    }
     else if (data.action == "vote") {
      voteItemsDB.findById(data.id).exec(function(err, result) {
        if (err) throw err;
      var voteItemTitle;
      voteItemTitle = result.title;      
      keyboards.fillScoreKeys(scoreCount, data.id, function(
        generatedKeys
      ) {
        reqHandler(
          "sendMessage",
          {
            text: "به " + voteItemTitle + " از ۱ تا ۵ چه امتیازی می دهید؟",
            // text: "به " + data.voteItemId + " از ۱ تا ۵ چه امتیازی می دهید؟",
            chat_id: query.from.id,

            reply_markup: {
              inline_keyboard: generatedKeys
            }
          },
          function(body) {}
        );
      });
    })
  }
  });


  //callback for scoreKeys
  bot.callback(function(query, next) {
    var data;
    try {
      data = JSON.parse(query.data);
    } catch (e) {
      return next();
    }
    if (data.type !== 2) return next();
    else {
      var newVote = new votesDB({
        chatId: query.from.id,
        vote: {
          destinationId: data.voteItemId, //channelId or voteItemId
          score: data.score
        }
      });

      newVote.save(function(err, savedVote) {

        if (err) {
          keyboards.fillScoreKeys(scoreCount, data.voteItemId, function(
            generatedKeys
          ) {
            reqHandler(
              "sendMessage",
              {
                text: "رای شما ثبت نشد. لطفا دوباره سعی کنید.",
                chat_id: query.from.id,
                reply_markup: {
                  inline_keyboard: keyboards.scoreKeys
                }
              },
              function(body) {}
            );
          });
        } else {
          reqHandler(
            "sendMessage",
            {
              text: "رای شما با موفقیت ثبت شد.",
              chat_id: query.from.id
            },
            function(body) {}
          );
          votingResults(data.voteItemId, function(votingRes) {
            reqHandler(
              "sendMessage",
              {
                text:
                  "مجموع امتیازات ثبت شده تا کنون برابر است با:\n" +
                  votingRes.percent +
                  "%\nاز همراهی شما متشکریم.",
                chat_id: query.from.id
              },
              function(body) {}
            );
          });
        }
      });
    }
  });

  
  //callback for voteItemKeys
  bot.callback(function(query, next) {
    var data;
    try {
      data = JSON.parse(query.data);
    } catch (e) {
      return next();
    }
    if (data.type !== 2) return next();
    else {
      var newVote = new votesDB({
        chatId: query.from.id,
        vote: {
          destinationId: data.voteItemId,
          score: data.score
        }
      });
      newVote.save(function(err, savedVote) {

        if (err)
          reqHandler(
            "sendMessage",
            {
              text: "نظر شما ثبت نشد. لطفا دوباره سعی کنید.",
              chat_id: query.from.id,
              reply_markup: {
                inline_keyboard: scoreKeys
              }
            },
            function(body) {}
          );
        else {
          reqHandler(
            "sendMessage",
            {
              text: "نظر شما با موفقیت ثبت شد.",
              chat_id: query.from.id
            },
            function(body) {}
          );
          votingResults(data.voteItemId, function(votingRes) {
            reqHandler(
              "sendMessage",
              {
                text:
                  "مجموع امتیازات ثبت شده تا کنون برابر است با: " +
                  votingRes.percent +
                  "%\nاز همراهی شما متشکریم.",
                chat_id: query.from.id
              },
              function(body) {}
            );
          });
        }
      });
    }
  });

  //callback for surveyKeys
  bot.callback(function(query, next) {
    var data;
    try {
      data = JSON.parse(query.data);
    } catch (e) {
      return next();
    }
    if (data.type !== 3) return next();
    else {
      var keyIndex = data.keyIndex;
      surveysDB.findById(data.surveyId).exec(function(error, keyboard) {
        if (error) throw error;
        else {
          if (!keyboard) return;
          var keyText = keyboard.keyboard[keyIndex];

          var surveyResult = new surveyResultsDB({
            chatId: query.from.id,

            surveyId: data.surveyId, //surveyId
            text: keyText
          });
          surveyResultsDB
            .find({
              $and: [{ surveyId: data.surveyId }, { chatId: query.from.id }]
            })
            .exec(function(error, result) {
              if (error) return error;
              if(result){
              reqHandler(
                "sendMessage",
                {
                  text:
                    "شما پیش از این در این نظرسنجی شرکت کرده اید. از همراهی شما سپاسگزاریم.",
                  chat_id: query.from.id,
                  reply_markup: {
                    inline_keyboard: keyboards.surveyKeys
                  }
                },
                function(body) {}
              );
              surveyResults(
                {
                  surveyId: data.surveyId,
                  keyboard: keyboards.surveyKeys
                },
                function(survRes) {
                  var results = "";
                  for (var i = 0; i < survRes.votes.length; i++) {
                    results +=
                      '"' +
                      survRes.votes[i].title +
                      '":' +
                      survRes.votes[i].percent +
                      "%\n";
                  }

                  reqHandler(
                    "sendMessage",
                    {
                      text:
                        "نتایج این نظر سنجی:\n" +
                        results +
                        "\nاز همراهی شما متشکریم.",
                      chat_id: query.from.id
                    },
                    function(body) {}
                  );
                })
            }
                
              else {
                surveyResult.save(function(err, savedSurveyResult) {

                  if (err)
                    reqHandler(
                      "sendMessage",
                      {
                        text: "نظر شما ثبت نشد. لطفا دوباره سعی کنید.",
                        chat_id: query.from.id,
                        reply_markup: {
                          inline_keyboard: keyboards.surveyKeys
                        }
                      },
                      function(body) {}
                    );
                  else {
                    reqHandler(
                      "sendMessage",
                      {
                        text: "نظر شما با موفقیت ثبت شد.",
                        chat_id: query.from.id
                      },
                      function(body) {}
                    );
                }
                

                    //We shpuld return our result in a callback because we are doing some database stuff in `surveyResults`, we cant write something like this:
                    //survRes=surveyResults(...) [WRONG]
                    surveyResults(
                      {
                        surveyId: data.surveyId,
                        keyboard: keyboards.surveyKeys
                      },
                      function(survRes) {
                        var results = "";
                        for (var i = 0; i < survRes.votes.length; i++) {
                          results +=
                            '"' +
                            survRes.votes[i].title +
                            '":' +
                            survRes.votes[i].percent +
                            "%\n";
                        }

                        reqHandler(
                          "sendMessage",
                          {
                            text:
                              "نتایج این نظر سنجی:\n" +
                              results +
                              "\nاز همراهی شما متشکریم.",
                            chat_id: query.from.id
                          },
                          function(body) {}
                        );
                      }
                    );
                });
              } 
            });
        }
      });
    }
  });
};
