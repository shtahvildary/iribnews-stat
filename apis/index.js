var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var surveys=require('./surveys');
var sendMessage=require('./sendMessage');

app.use(bodyParser.json());
app.use('/surveys',surveys);
app.use('/sendMessage',sendMessage);
app.listen(9002,function(err){
    if(err) return console.log('error: ',err);
    else console.log("server is listening to port 9002")
})