const botgram = require("botgram");

//shmt_bot
//  var bot = botgram("449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk");
//admin it-word cloud
// var bot = botgram("456299862:AAGB1q_AMolsLpeE5EARolW4FHEi5-1kqjE");
// newsNovinBot

var bot = botgram("545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4");
global.bot = bot;

require("./bot/commands/index")(bot);
require("./bot/callbacks/index")(bot);
require("./apis/index");

require("dotenv").config();
var messageDB = require("./Schema/messages");
var chatDB = require("./Schema/chats");
var voteItemsDB = require("./Schema/voteItems");
var votesDB = require("./Schema/votes");
var textAnalyser = require("./tools/textAnalyser");
const db = require("./config/DBConfig");
var reqHandler = require("./tools/reqHandler");
var uploader = require("./tools/upload");
var departmentsDB = require("./Schema/departments");
var contextDB = require("./Schema/contexts");


var departmentId;

departmentsDB
  .findOne({ bot: bot.authToken }, { _id: 1 })
  .exec(function(err, result) {
    if (!err) {
      if (result) departmentId = result;
    } else return err;
  });

bot.text(function(msg, reply, next) {
  contextDB.findOne({$and:[{chatId:msg.chat.id},{comment:true}]}).exec(function(error,result){
    if(result){
      var comment={
        destinationId:result.destinationId,
        text:msg.text,

      }
      var vote=new votesDB({chatId:msg.chat.id,chatTitle:msg.chat.title,comment})
      vote.save(function(err,res){
        if(err){
          reply.text("ثبت پیام با خظا مواجه شد. لطفا دوباره اقدام فرمایید.")
        }
        else{
  contextDB.update({chatId:msg.chat.id},{comment:0,destinationId:null}).exec(function(err,context){
          if(!err)
          reply.text("پیام شما با موفقیت ثبت شد. با تشکر") 
      })
    }
  })
}
  else{
  
  var AnalyseResult = textAnalyser(msg.text);
  //var keywords=msg.hashtags().concat(AnalyseResult);
  // var departmentId=findDepartment(bot.authToken);
  if (msg.reply) var replyTo = msg.reply.id;
  var newMessage = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    // voteItemId:String, //channel or program ID
    chatType: msg.chat.type,
    message: msg.text,
    //keywords: msg.hashtags()
    keywords: AnalyseResult,
    departmentId: departmentId
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },
      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newMessage.save(function(err, savedMessage) {
          if (newMessage.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            else {
              reply.text("پیام شما با موفقیت ثبت شد.");
            }
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
    }
  );
}
});
})
    

bot.video(function(msg, reply, next) {
  if (msg.caption) var AnalyseResult = textAnalyser(msg.caption);
  if (msg.reply) var replyTo = msg.reply.id;

  var newVideo = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    caption: msg.caption,
    departmentId: departmentId
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },
      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newVideo.save(function(err, savedMessage) {
          if (newVideo.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
      download(msg.file);
    }
  );
});

bot.audio(function(msg, reply, next) {
  if (msg.title) {
    var AnalyseResult = textAnalyser(msg.title);
  }
  if (msg.reply) var replyTo = msg.reply.id;

  var newAudio = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    audioTitle: msg.title,
    departmentId: departmentId
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },

      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newAudio.save(function(err, savedMessage) {
          if (newAudio.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");

      download(msg.file);
    }
  );
});
bot.voice(function(msg, reply, next) {
  if (msg.caption) {
    var AnalyseResult = textAnalyser(msg.title);
  }
  if (msg.reply) var replyTo = msg.reply.id;

  var newVoice = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    mime: msg.file.mime,
    audioTitle: msg.file.title,
    filePath: msg.file.path,
    departmentId: departmentId

    // ||(msg.path+msgFile.mime.slice(msgFile.mime.lastIndexOf("/")+1,msgFile.mime.lenght)),
    // var fileIndex=msgFile.mime.slice(msgFile.mime.lastIndexOf("/")+1,msgFile.mime.lenght);
    // var fileName = "./public/files/"+msgFile.path;
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },

      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newVoice.save(function(err, savedMessage) {
          if (newVoice.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");

      download(msg.file);
    }
  );
});
//bot.contact(function (msg, reply, next) {
//
//})
bot.photo(function(msg, reply, next) {
  if (msg.caption) {
    var AnalyseResult = textAnalyser(msg.caption);
  }
  if (msg.reply) var replyTo = msg.reply.id;
  var newPhoto = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.image.file.id,
    filePath: msg.image.file.path,
    departmentId: departmentId,

    // mime: msg.file.mime,

    //image:msg.image,
    caption: msg.caption
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },

      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newPhoto.save(function(err, savedMessage) {
          if (newPhoto.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");

      download(msg.image.file);
    }
  );
});
bot.document(function(msg, reply, next) {
  var AnalyseResult = textAnalyser(msg.filename);
  if (msg.reply) var replyTo = msg.reply.id;

  var newDocument = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    // voteItemId:String, //channel or program ID
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    fileName: msg.filename,
    departmentId: departmentId
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },

      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newDocument.save(function(err, savedMessage) {
          if (newDocument.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");

      download(msg.file);
    }
  );
});

bot.sticker(function(msg, reply, next) {
  // var AnalyseResult = textAnalyser(msg.caption);
  if (msg.reply) var replyTo = msg.reply.id;

  var newSticker = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    // voteItemId:String, //channel or program ID
    chatType: msg.chat.type,
    // keywords:AnalyseResult,

    fileId: msg.file.id,
    // filePath:
    emoji: msg.emoji,
    departmentId: departmentId
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },

      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newSticker.save(function(err, savedMessage) {
          if (newSticker.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
    }
  );
});

bot.video_note(function(msg, reply, next) {
  if (msg.caption) var AnalyseResult = textAnalyser(msg.caption);
  if (msg.reply) var replyTo = msg.reply.id;
  var newVideoNote = new messageDB({
    type: msg.type,
    message_id: msg.id,
    replyTo: replyTo,
    chatId: msg.chat.id,
    chatTitle: msg.chat.title,
    chatType: msg.chat.type,
    keywords: AnalyseResult,

    fileId: msg.file.id,
    filePath: msg.file.path,
    mime: msg.file.mime,
    caption: msg.caption,
    departmentId: departmentId
  });
  chatDB.update(
    {
      chatId: msg.chat.id
    },
    {
      $set: {
        chatId: msg.chat.id,
        chatTitle: msg.chat.title,
        chatType: msg.chat.type
      },
      $addToSet: { departmentId: departmentId },
      $setOnInsert: {
        trusted: 1
      }
    },
    {
      upsert: true
    },
    function(error, info) {
      if (!error) {
        newVideoNote.save(function(err, savedMessage) {
          if (newVideoNote.chatType == "user") {
            if (err)
              return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
            reply.text("پیام شما با موفقیت ثبت شد.");
          }
        });
      } else return reply.text("پیام شما ثبت نشد. لطفا دوباره سعی کنید.");
      download(msg.file);
    }
  );
});


function download(msgFile) {
  var link;

  bot.fileGet(msgFile, function(err, info) {
    if (err) throw err;
    var path = msgFile.path;
    link = bot.fileLink(info);
    uploader(link, function(err, body, response) {
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
