var surveyResults_sc=require('../Schema/surveyResults');
var surveys_sc=require('../Schema/surveys');
var _ =require("lodash")

var surveyResults=function (req,callback){
    var surveyId=req.surveyId;
    

// surveyResults_sc.find({'surveyId':surveyId}).populate({path:'surveyId',select:'keyboard'}).exec(function(error,result){
var keys=surveys_sc.findById(surveyId,{_id:0,keyboard:1}).exec(function(err,res){
})    
surveyResults_sc.find({'surveyId':surveyId},{_id:0,text:1}).exec(function(error,result){
    //result is an array of jsons. its like this:
    /**
     * [
     *  {text:"fine"},
     *  {text:"fine"},
     *  {text:"not bad"},
     * ...
     * ]
     */
    if (!error) {

        var totalCount=result.length;
        var count={}
        if (result) {
          //this will loop in result. 
          result.map(item=>{
            //item is one item of result array. its like this:
            /**
             * {
             *  text:"fine"
             * }
             */
                if(!count[item.text]) count[item.text]=1;
                else count[item.text]++;
            })
            //now count is a json like this:
            /**
             * {
             * "fine":3,
             * "not bad":2
             * }
             */

            //we have to make it beauty to make our result more readable.
            var votes=[];
            //This will loop in keys of a json(count)
            /**
             * in first loop >> value is 3, key is "fine"
             * in second loop >> value is 2,key is "not bad"
             */
            _.mapKeys(count,(value,key)=>{
              //I'm just make a more readable result here, votes is an array of jsons with title key and count key.
                votes.push({title:key,count:value,percent:Math.round(value*100/totalCount)});
            });

            //We have to return the result with callback function(it's not our robot's callback stuff... it's the callback that will be called when a function has been done it's process.)
            callback({votes,totalCount})
            // keys=result.map(item=>result._doc.text)

        } else {
          res.json({
            error: 'There is no user to select...'
          });
        }
      } else {
        res.status(500).json({
          error: error
        })
      }

})}
module.exports=surveyResults;
