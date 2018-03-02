const mongoose = require("mongoose");


var contextSchema = mongoose.Schema({
    chatId: String,
    
    date: {
        type: Date,
        default: Date.now
    },
   
    
    comment:Boolean,
    destinationId:{ type:mongoose.SchemaTypes.ObjectId, ref:"voteItems"}, //channelId or programId
    
})
module.exports = mongoose.model("contexts", contextSchema);