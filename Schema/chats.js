const mongoose=require("mongoose");

var chatsSchema=mongoose.Schema({
    chatId:{type:'string'},
   trusted:{type:'number',required:true,default:1},//0:NotTrusted , 1:trusted
    chatTiltle:String,
    chatType:String
})

module.exports=mongoose.model("chats",chatsSchema);



