var bot;
var channelId;
module.exports = function (mainBot,mainChannelId) {
    bot = mainBot;
    channelId=mainChannelId
    require("./callbacks")(bot,channelId);
}