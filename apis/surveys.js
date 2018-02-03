var express = require('express');
var reqHandler = require('../tools/reqHandler')
var router = express.Router();
var keyboards = require('../bot/callbacks/keyboards')
var surveysDB = require("../Schema/surveys");



router.post('/new', function (req, res) {
            
             surveysDB.findById(req.body.surveyId).exec(function (error,result) {
                if (error) throw err;
                console.log(result);
                if(!result) return res.status(400).json({error:"surveyid is wrong."})
                var survey=result;
                var {chatIds}=survey;
                chatIds.map(id=>{

                keyboards.fillSurveyKeys(survey, function (generatedKeys) {

                    reqHandler("sendMessage", {

                        text: survey.text,
                        chat_id: id, ////////// chatId is array?????

                        reply_markup: {
                            inline_keyboard: [generatedKeys]
                        }
                    }, function (body) {})
                })
            })
                


            })
        })
            module.exports = router;