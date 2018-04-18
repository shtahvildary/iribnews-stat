var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var surveys=require('./surveys');
var competitions=require('./competitions');
var sendMessage=require('./sendMessage');
var departmentsDB = require("../Schema/departments");

//shmt_bot
// var bot = botgram("449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk");
//admin it-word cloud
// var bot = botgram("456299862:AAGB1q_AMolsLpeE5EARolW4FHEi5-1kqjE");

// newsNovinBot
// var bot = botgram("545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4");

//pr162bot
//var bot = botgram(580739412:AAEVJ5zrs2RD0L97cthIVNSP6Mxkz0MYb3g);

// var port;
// departmentsDB.findOne({ 'bot': process.env.BOT_TOKEN }, { _id: 0 ,'port':1}).exec(function(err, result) {
//   if (!err) {
//     if (result) 
//     port=result.port
//   } else return err;
// });

app.use(bodyParser.json());
app.use('/surveys',surveys);
app.use('/sendMessage',sendMessage);
app.use('/competitions',competitions);
app.listen(9002,function(err){
    // app.listen(port,function(err){
    if(err) return ('error: ',err);
    else ("server is listening to port 9002")
})