var votes_sc=require('../Schema/votes');
var voteItems_sc=require('../Schema/voteItems');
var _ =require("lodash")

var votingResults=function (voteItemId,callback){
    // var voteItemId=req.body;
    
votes_sc.find({'vote.destinationId':voteItemId},{_id:0,vote:1}).exec(function(err,res){
  if(!err){
    if(res){
    console.log(res)

    var totalCount=res.length
    var totalScore=0;
    for(var i=0;i<totalCount;i++){
      totalScore+=res[i]._doc.vote.score;
    }
    console.log('totalScores: ',totalScore)
    var percent=Math.round((totalScore*100)/(totalCount*5))
 
            //We have to return the result with callback function(it's not our robot's callback stuff... it's the callback that will be called when a function has been done it's process.)
            callback({totalScore,percent,totalCount})

        } else {
          res.json({
            error: 'There is no vote to select...'
          });
        }
      } else {
        res.status(500).json({
          error: error
        })
      }

})}
module.exports=votingResults;
