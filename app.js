const botgram = require("botgram");

//shmt_bot
// var bot = botgram("449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk");
//admin it
//var bot = botgram("456299862:AAGB1q_AMolsLpeE5EARolW4FHEi5-1kqjE");
// newsNovinBot
var bot = botgram("545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b814");

require("./bot/commands/index")(bot);
require("./bot/callbacks/index")(bot);










require('dotenv').config();
var messageDB = require("./Schema/Messages");
var voteItemsDB = require("./Schema/voteItems");
var votesDB = require("./Schema/votes");
var textAnalyser = require("./tools/textAnalyser");
const db = require("./config/DBConfig");
var reqHandler = require("./tools/reqHandler");






bot.text(function (msg, reply, next) {
  var AnalyseResult = textAnalyser(msg.text);
  console.log("analyseResult:", AnalyseResult);
  //var keywords=msg.hashtags().concat(AnalyseResult);

  var newMessage = new messageDB({
    type: msg.type,
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    chatTitle: msg.chat.title,
    message: msg.text,
    //keywords: msg.hashtags()
    keywords: AnalyseResult
  })
  newMessage.save(function (err, savedMessage) {
    console.log(err)
    if (newMessage.chatType == "user") {
      if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
      else {
        reply.text('پیام شما با موفقیت ارسال شد.')
      }
    }

  });
  // var keys = [
  //   [{
  //       text: "1",

  //     },
  //     {
  //       text: "2",

  //     }, {
  //       text: '3'
  //     }
  //   ],
  //   [{
  //     text: '4'
  //   }]
  // ];
  // reply.keyboard(keys, true)
})
bot.video(function (msg, reply, next) {
  var newVideo = new messageDB({
    type: msg.type,
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    chatTitle: msg.chat.title,

    fileId: msg.file.id,
    mime: msg.file.mime,
    VideoCaption: msg.caption

  });
  newVideo.save(function (err, savedMessage) {
    console.log(err)
    if (newVideo.chatType == "user") {

      if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
      reply.text('پیام شما با موفقیت ارسال شد.');
    }

  });
  download(msg.file);

})

bot.audio(function (msg, reply, next) {
  var newAudio = new messageDB({
    type: msg.type,
    chatType: msg.chat.type,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,

    fileId: msg.file.id,
    mime: msg.file.mime,
    AudioTitle: msg.title

  });
  newAudio.save(function (err, savedMessage) {
    console.log(err);
    if (newAudio.chatType == "user") {

      if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
      reply.text('پیام شما با موفقیت ارسال شد.');
    }

  });

  download(msg.file);

})
bot.voice(function (msg, reply, next) {
  var newVoice = new messageDB({
    type: msg.type,
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    chatTitle: msg.chat.title,

    fileId: msg.file.id,
    mime: msg.file.mime

  });
  newVoice.save(function (err, savedMessage) {
    console.log(err)
    if (newVoice.chatType == "user") {

      if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
      reply.text('پیام شما با موفقیت ارسال شد.');
    }
  });
  download(msg.file);
})
//bot.contact(function (msg, reply, next) {
//
//})
bot.photo(function (msg, reply, next) {
  var newPhoto = new messageDB({
    type: msg.type,
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    chatTitle: msg.chat.title,

    fileId: msg.image.file.id,
    //mime: msg.file.mime,

    //image:msg.image,
    caption: msg.caption
  });
  newPhoto.save(function (err, savedMessage) {
    console.log(err)
    if (newPhoto.chatType == "user") {

      if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
      reply.text('پیام شما با موفقیت ارسال شد.');
    }

  });
console.log(msg);
  download(msg.image.file);


})
bot.document(function (msg, reply, next) {
  var newDocument = new messageDB({
    type: msg.type,
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    chatTitle: msg.chat.title,

    fileId: msg.file.id,
    mime: msg.file.mime,
    fileName: msg.filename

  });
  newDocument.save(function (err, savedMessage) {
    console.log(err);
    if (newDocument.chatType == "user") {

      if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
      reply.text('پیام شما با موفقیت ارسال شد.');
    }
  });

  download(msg.file);
})

bot.sticker(function (msg, reply, next) {
  var newSticker = new messageDB({
    type: msg.type,
    chatId: msg.chat.id,
    chatType: msg.chat.type,
    chatTitle: msg.chat.title,

    fileId: msg.file.id,

    emoji: msg.emoji

  });
  // newSticker.save(function(err,savedMessage){
  //     console.log(err)
  //     if(err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
  //     reply.text('پیام شما با موفقیت ارسال شد.');

  //   });

})
// bot.videoNote(function (msg, reply, next) {
//     var newVideoNote = new messageDB({
//         type: msg.type,
//         chatId: msg.chat.id,
//         chatTitle: msg.chat.title,

//         fileId: msg.file.id,
//     });
//     newVideoNote.save();
// })
function download(msgFile) {
  var link;

  bot.fileGet(msgFile, function (err, info) {
    if (err) throw err;
    console.log(msgFile.type);
    link = bot.fileLink(info);
    console.log("We got the link:", bot.fileLink(info));
  });
  bot.fileLoad(msgFile, function (err, buffer) {
    
    //VOICE:
    // var fileIndex=msgFile.mime.slice(msgFile.mime.lastIndexOf("/")+1,msgFile.mime.lenght);
    // var fileName = "./public/files/"+msgFile.path;

    /////////////////////////////////
    //photo and audio and video and document
    var fileName = "./public/files/"+msgFile.path;
    ////////////////////////////////

    
    console.log(link);
    console.log('file name:' + fileName);

    if (err) throw err;
    console.log("Downloaded! Writing to disk...");
    
    //voice:
    // require("fs").writeFile(fileName+"."+fileIndex, buffer);

    //photo and audio and video and document
    require("fs").writeFile(fileName, buffer);
    
  });
}