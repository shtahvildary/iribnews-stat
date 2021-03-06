var express = require("express");
var reqHandler = require("../tools/reqHandler");
var router = express.Router();
var keyboards = require("../bot/callbacks/keyboards");
var competitionsDB = require("../Schema/competitions");
var chatsDB = require("../Schema/chats");
var departmentsDB = require("../Schema/departments");
var _ = require("lodash");
var async = require("async");

router.post("/new", function(req, res) {
  competitionsDB.findById(req.body.competitionId).populate({path:'voteItemId',select:'title'}).exec(function(error, competition) {
    if (error) throw err;
    if (!competition) return res.status(400).json({ error: "competitionId is wrong." });

    var departmentId;

departmentsDB
  .findOne({ bot: bot.authToken }, { _id: 1 })
  .exec(function(err, result) {
    if (!err) {
      if (result) departmentId = result;
    } else return err;
    
      chatsDB.find({ $and: [ {trusted: 1  }, {departmentId} ] }, { chatId: 1, _id: 0 }).exec((err, chatIds) => {
        // chatsDB.find({ $and: [ {'trusted': 1  }, {'departmentId':{$in:[departmentId]}} ] }, { chatId: 1, _id: 0 }).exec((err, chatIds) => {
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
          reqHandler("sendMessage",{
            text:"همراه گرامی، برای شرکت در مسابقه "+competition.voteItemId.title+" با عنوان "+competition.title+" به پرسش زیر پاسخ دهید:",
            chat_id:id,
          },
          function(body) {
          keyboards.fillCompetitionKeys(competition, function(generatedKeys) {
            reqHandler(
              "sendMessage",
              {
                text: competition.question,
                chat_id: id, 

                reply_markup: {
                  inline_keyboard: [generatedKeys]
                }
              },
              function(body) {}
            );
          });

        })
        });
      };
    });
  });
  });
});
module.exports = router;
