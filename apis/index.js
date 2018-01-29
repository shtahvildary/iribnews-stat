var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var surveys=require('./surveys');

app.use(bodyParser.json());
app.use('/survey',surveys);
app.listen(9002,function(err){
    if(err) return console.log('error: ',err);
})