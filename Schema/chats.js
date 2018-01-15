const mongoose=require("mongoose");

var chatsSchema=mongoose.Schema({
    chatId:String,
    chatTiltle:String,
    chatType:String
})

module.exports=mongoose.model("chats",chatsSchema);