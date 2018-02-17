const botgram = require("botgram");

//shmt_bot
// var bot = botgram("449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk");
//admin it
//var bot = botgram("456299862:AAGB1q_AMolsLpeE5EARolW4FHEi5-1kqjE");
// newsNovinBot
var bot = botgram("545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4");
global.bot=bot;
require("./bot/commands/index")(bot);
require("./bot/callbacks/index")(bot);
require("./apis/index")



require('dotenv').config();
var messageDB = require("./Schema/messages");
var chatDB = require("./Schema/chats");
var voteItemsDB = require("./Schema/voteItems");
var votesDB = require("./Schema/votes");
var textAnalyser = require("./tools/textAnalyser");
const db = require("./config/DBConfig");
var reqHandler = require("./tools/reqHandler");
var uploader = require("./tools/upload");



bot.text(function (msg, reply, next) {
  var AnalyseResult = textAnalyser(msg.text);
  console.log("analyseResult:", AnalyseResult);
  //var keywords=msg.hashtags().concat(AnalyseResult);
if(msg.reply) var replyTo=msg.reply.id
  var newMessage = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    // voteItemId:String, //channel or program ID
    chatType: msg.chat.type,
    message: msg.text,
    //keywords: msg.hashtags()
    keywords: AnalyseResult,
  })
  chatDB.update({
    chatId: msg.chat.id
  }, {
    $set: {
      chatId: msg.chat.id,
      chatTitle: msg.chat.title,
      chatType: msg.chat.type,
    },
    $setOnInsert: {
      trusted: 1,
    }
  }, {
    upsert: true
  }, function (error, info) {
    if (!error) {
      newMessage.save(function (err, savedMessage) {
        console.log('err: ',err)
        if (newMessage.chatType == "user") {
          if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
          else {
            reply.text('پیام شما با موفقیت ثبت شد.')
          }
        }
      });
    } else return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
  })
})

bot.video(function (msg, reply, next) {
  if (msg.caption) 
    var AnalyseResult = textAnalyser(msg.caption);
if(msg.reply) var replyTo=msg.reply.id    
  
  var newVideo = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    caption: msg.caption,

  });
  chatDB.update({
    chatId: msg.chat.id
  }, {
    $set: {
      chatId: msg.chat.id,
      chatTitle: msg.chat.title,
      chatType: msg.chat.type,
    },
    $setOnInsert: {
      trusted: 1,
    }
  }, {
    upsert: true
  }, function (error, info) {
    if (!error) {
      newVideo.save(function (err, savedMessage) {
        console.log(err)
        if (newVideo.chatType == "user") {

          if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
          reply.text('پیام شما با موفقیت ثبت شد.');
        }
      });
    } else return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
    download(msg.file);
  })
})

bot.audio(function (msg, reply, next) {
  if (msg.title) {
    var AnalyseResult = textAnalyser(msg.title);
  }
if(msg.reply) var replyTo=msg.reply.id
  
  var newAudio = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    audioTitle: msg.title,

  });
  chatDB.update({
    chatId: msg.chat.id
  }, {
    $set: {
      chatId: msg.chat.id,
      chatTitle: msg.chat.title,
      chatType: msg.chat.type,
    },
    $setOnInsert: {
      trusted: 1,
    }
  }, {
    upsert: true
  }, function (error, info) {
    if (!error) {
      newAudio.save(function (err, savedMessage) {
        console.log(err);
        if (newAudio.chatType == "user") {

          if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
          reply.text('پیام شما با موفقیت ثبت شد.');
        }

      });
    } else return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');


    download(msg.file);

  })
})
bot.voice(function (msg, reply, next) {
  if (msg.caption) {
    var AnalyseResult = textAnalyser(msg.title);
  }
if(msg.reply) var replyTo=msg.reply.id
  
  var newVoice = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    mime: msg.file.mime,
    audioTitle: msg.file.title,
    filePath: msg.file.path
    // ||(msg.path+msgFile.mime.slice(msgFile.mime.lastIndexOf("/")+1,msgFile.mime.lenght)),
    // var fileIndex=msgFile.mime.slice(msgFile.mime.lastIndexOf("/")+1,msgFile.mime.lenght);
    // var fileName = "./public/files/"+msgFile.path;

  });
  chatDB.update({
    chatId: msg.chat.id
  }, {
    $set: {
      chatId: msg.chat.id,
      chatTitle: msg.chat.title,
      chatType: msg.chat.type,
    },
    $setOnInsert: {
      trusted: 1,
    }
  }, {
    upsert: true
  }, function (error, info) {
    if (!error) {
      newVoice.save(function (err, savedMessage) {
        console.log(err)
        if (newVoice.chatType == "user") {

          if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
          reply.text('پیام شما با موفقیت ثبت شد.');
        }
      });
    } else return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');

    download(msg.file);
  })
})
//bot.contact(function (msg, reply, next) {
//
//})
bot.photo(function (msg, reply, next) {
  if (msg.caption) {
    var AnalyseResult = textAnalyser(msg.caption);
  }
if(msg.reply) var replyTo=msg.reply.id  
  var newPhoto = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.image.file.id,
    filePath: msg.image.file.path,
    // mime: msg.file.mime,

    //image:msg.image,
    caption: msg.caption
  });
  chatDB.update({
    chatId: msg.chat.id
  }, {
    $set: {
      chatId: msg.chat.id,
      chatTitle: msg.chat.title,
      chatType: msg.chat.type,
    },
    $setOnInsert: {
      trusted: 1,
    }
  }, {
    upsert: true
  }, function (error, info) {
    if (!error) {
      newPhoto.save(function (err, savedMessage) {
        console.log(err)
        if (newPhoto.chatType == "user") {

          if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
          reply.text('پیام شما با موفقیت ثبت شد.');
        }
      });
    } else return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');

    console.log(msg);
    download(msg.image.file);


  })
})
bot.document(function (msg, reply, next) {
  var AnalyseResult = textAnalyser(msg.filename);
  if(msg.reply) var replyTo=msg.reply.id

  var newDocument = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    // voteItemId:String, //channel or program ID
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    fileName: msg.filename,

  });
  chatDB.update({
    chatId: msg.chat.id
  }, {
    $set: {
      chatId: msg.chat.id,
      chatTitle: msg.chat.title,
      chatType: msg.chat.type,
    },
    $setOnInsert: {
      trusted: 1,
    }
  }, {
    upsert: true
  }, function (error, info) {
    if (!error) {
      newDocument.save(function (err, savedMessage) {
        console.log(err);
        if (newDocument.chatType == "user") {

          if (err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
          reply.text('پیام شما با موفقیت ثبت شد.');
        }
      });
    } else return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');


    download(msg.file);
  })
})

bot.sticker(function (msg, reply, next) {
  // var AnalyseResult = textAnalyser(msg.caption);
  if(msg.reply) var replyTo=msg.reply.id

  var newSticker = new messageDB({
    type: msg.type,
    message_id:msg.id,
    replyTo:replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    // voteItemId:String, //channel or program ID
    chatType: msg.chat.type,
    // keywords:AnalyseResult,

    fileId: msg.file.id,
    // filePath:
    emoji: msg.emoji
  });
  // newSticker.save(function(err,savedMessage){
  //     console.log(err)
  //     if(err) return reply.text('پیام شما ثبت نشد. لطفا دوباره سعی کنید.');
  //     reply.text('پیام شما با موفقیت ثبت شد.');

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
    var path = msgFile.path;
    console.log('fileType: ', msgFile.type);
    link = bot.fileLink(info);
    console.log("We got the link:", bot.fileLink(info));
    uploader(link, function (err, body, response) {
      if (!err) {
        var filename = body.filename;
      }
    });
  });
  // bot.fileLoad(msgFile, function (err, buffer) {

  //VOICE:
  // var fileIndex=msgFile.mime.slice(msgFile.mime.lastIndexOf("/")+1,msgFile.mime.lenght);
  // var fileName = "./public/files/"+msgFile.path;

  /////////////////////////////////
  //photo and audio and video and document
  // var fileName = "./public/files/"+msgFile.path;
  ////////////////////////////////


  // console.log(link);
  // console.log('file name:' + fileName);

  // if (err) throw err;
  // console.log("Downloaded! Writing to disk...");

  //voice:
  // require("fs").writeFile(fileName+"."+fileIndex, buffer);

  //photo and audio and video and document
  // require("fs").writeFile(fileName, buffer);

  // });
}