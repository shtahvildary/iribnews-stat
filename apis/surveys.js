var express = require('express');
var callSurvey=require('./callback')

var router=express.Router();
router.post('/new',function(req,res){
    callSurvey.fillSurveyKeys(req.surveyId);

})
module.exports=router;