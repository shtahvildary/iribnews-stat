var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var surveys=require('./surveys');
var sendMessage=require('./sendMessage');
var departmentsDB = require("../Schema/departments");


var port;

departmentsDB.findOne({ 'bot': "545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4" }, { _id: 0 ,'port':1}).exec(function(err, result) {
  if (!err) {
    if (result) 
    port=result.port
  } else return err;
});

app.use(bodyParser.json());
app.use('/surveys',surveys);
app.use('/sendMessage',sendMessage);
app.listen(9002,function(err){
    // app.listen(port,function(err){
    if(err) return console.log('error: ',err);
    else console.log("server is listening to port 9002")
})