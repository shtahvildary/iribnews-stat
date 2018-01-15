const mongoose=require("mongoose");

var botSchema=mongoose.Schema({
    botName:String,    
    botId:Number, 
    channelId:String,
   
});
module.exports=mongoose.model("bots",botSchema);
