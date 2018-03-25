var voteItemsDB = require("../../Schema/voteItems");
var surveysDB = require("../../Schema/surveys");
var competitionsDB = require("../../Schema/competitions");

var keyboards = {}
//types:      0:mainMenueKeys   ,   1:voteItemKeys   ,   2:scoreKeys    , 3:surveyKeys      ,       4:voteOrCommentKeys ,   5:competitionKeys    
keyboards.mainMenueKeys = [
    [{
            text: "ثبت نظر درمورد کانال",
            callback_data: JSON.stringify({
                type: 0,
                action: "channelVoting"
            })
        },
        {
            text: "ثبت نظر درمورد برنامه ها",
            callback_data: JSON.stringify({
                type: 0, //mainMenueKeys
                action: "programsVoting"
            })
        }
    ]
];

keyboards.voteOrCommentKeys = [
    [{
            text: "ثبت نظر",
            callback_data: JSON.stringify({
                type: 4, //voteOrSCommentKeys
                action: "comment",
                
            })
        },
        {
            text: "ثبت امتیاز",
            callback_data: JSON.stringify({
                type: 4, //voteOrCommentKeys
                action: "vote"
            })
        }
    ]
];



keyboards.fillProgramVoteItems = function (callback) {
    voteItemsDB.find({
        'type': 1
    }).exec(function (err, result) {
        var voteItemKeys = []
        if (err) throw err;

        result.forEach(function (item) {
            voteItemKeys.push([{
                text: item.title,
                callback_data: JSON.stringify({
                    type: 1, //voteItemKeys
                    //voteItemId: 1,
                    voteItemId: item._id,
                    //voteItemName: item.title
                })
            }]);
        })
        callback(voteItemKeys)
    });
}
keyboards.fillChannelVoteItems = function (callback) {
    voteItemsDB.find({
        'type': 0
    }).exec(function (err, result) {
        var voteItemKeys = []
        if (err) throw err;

        result.forEach(function (item) {
            voteItemKeys.push([{
                text: item.title,
                callback_data: JSON.stringify({
                    type: 1, //voteItemKeys
                    //voteItemId: 1,
                    voteItemId: item._id,
                    //voteItemName: item.title
                })
            }]);
        })
        callback(voteItemKeys)
    });
}
keyboards.fillScoreKeys = function (scoreCount, voteItemId, callback) {
    var scoreKeys = [];
    for (var i = 1; i < scoreCount + 1; i++) {
        scoreKeys.push(
            [{
                text: i,
                callback_data: JSON.stringify({
                    type: 2, //scoreKeys
                    score: i,
                    voteItemId: voteItemId
                })
            }]

        );
    }
    callback(scoreKeys);
}
keyboards.fillSurveyKeys = function (survey, callback) {
    var surveyKeys = []
    var surveyKeyboard=survey.keyboard;
    surveyKeys = surveyKeyboard.map(function (item) {
        // var {type}=result;//=> var type=result.type

        return {
            text: item,
            callback_data: JSON.stringify({
                type: 3,
               // action: 'survey',
                keyIndex:surveyKeyboard.indexOf(item),
                surveyId:survey._id,
            })
        };
    });
    callback(surveyKeys)
}

keyboards.fillCompetitionKeys = function (competition, callback) {
    var competitionKeys = []
    var competitionKeyboard=competition.keyboard;
    competitionKeys = competitionKeyboard.map(function (item) {
        // var {type}=result;//=> var type=result.type

        return {
            text: item,
            callback_data: JSON.stringify({
                type: 3,
               // action: 'competition',
                keyIndex:competitionKeyboard.indexOf(item),
                competitionId:competition._id,
            })
        };
    });
    callback(competitionKeys)
}

module.exports = keyboards;