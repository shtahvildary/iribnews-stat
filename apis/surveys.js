var express = require("express");
var reqHandler = require("../tools/reqHandler");
var router = express.Router();
var keyboards = require("../bot/callbacks/keyboards");
var surveysDB = require("../Schema/surveys");
var chatsDB = require("../Schema/chats");
var _ = require("lodash");
var async = require("async");

router.post("/new", function(req, res) {
  surveysDB.findById(req.body.surveyId).exec(function(error, survey) {
    if (error) throw err;
    if (!survey) return res.status(400).json({ error: "surveyid is wrong." });

    chatsDB.find({ trusted: 1 }, { chatId: 1, _id: 0 }).exec((err, chatIds) => {
      chatIds = chatIds.map(i => i.chatId);
      var chunks = _.chunk(chatIds, 20);

      async.mapSeries(chunks, (chunk, callback) => {
        setTimeout(() => {
          send(chunk);
          callback();
        }, 2000);
      });
      //function send(){}
      var send = chatIds => {
        chatIds.map(id => {
          keyboards.fillSurveyKeys(survey, function(generatedKeys) {
            reqHandler(
              "sendMessage",
              {
                text: survey.text,
                chat_id: id, ////////// chatId is array?????

                reply_markup: {
                  inline_keyboard: [generatedKeys]
                }
              },
              function(body) {}
            );
          });
        });
      };
    });
  });
});
module.exports = router;
