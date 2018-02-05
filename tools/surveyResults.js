var surveyResults_sc=require('../Schema/surveyResults');
var surveys_sc=require('../Schema/surveys');

var surveyResults=function (req,res){
    var surveyId=req.surveyId;
    var surveyKeyboard=req.keyboard;

// surveyResults_sc.find({'surveyId':surveyId}).populate({path:'surveyId',select:'keyboard'}).exec(function(error,result){
var keys=surveys_sc.findById(surveyId,{_id:0,keyboard:1}).exec(function(err,res){
    console.log(keys)
})    
surveyResults_sc.find({'surveyId':surveyId},{_id:0,text:1}).exec(function(error,result){
    
    if (!error) {
        console.log('result: ',result)

        var totalCount=result.length;
        var count=[]
        if (result) {
            result._doc.text.map(item=>{
                if(!count[item]) count[item]=1;
                else count[item]++;
            })
            console.log(count)
            keys = result.text.map(function (item) {
                console.log(item)
                // var {type}=result;//=> var type=result.type
        
        
            });
            // keys=result.map(item=>result._doc.text)

          res.status(200).json({
            surveyResultsArray: result
          });
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
