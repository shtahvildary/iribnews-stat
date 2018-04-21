var express = require("express");
var router = express.Router();
var _ = require("lodash");
var reqHandler = require("../tools/reqHandler");
var messages_sc = require("../Schema/messages");
var http=require("http");
var fs=require("fs");
var async=require("async")

// var replyMessage = function (req, callback) {
router.post("/reply/new", function(req, res) {
  //inputs:text of reply, user id from session,chatId,message_id
  /**example:
  {
	"_id":"5a62fea1ba1ee7221416779f",
	"chatId":98445056,
	"text":"just 4 test",
	"userId":"5a509716513a501c9cce24c6"
}
   */
  console.log(req.body)
  messages_sc.findById(req.body._id).exec(function(err, result) {
    if (err)
      return res.status(500).json({
        error: err
      });
    if (!result)
      return res.status(500).json({
        error: "There is no message with _id=" + req.body._id
      });
      async.parallel([(callback)=>{
        if(!req.body.text)return callback(null,null)

        reqHandler(
          "sendMessage",
          {
            text: req.body.text,
            chat_id: result._doc.chatId,
            reply_to_message_id: result._doc.message_id
          },
          function(response) {
            console.log(response);
            if (!response)
              return callback("There is a problem in sending message...");
            var reply = {
              userId: req.body.userId,
              text: response.result.text,
              message_id: response.result.message_id
            };
            callback(null,reply)
          })
      },(callback)=>{
        var {filePath}=req.body
        if(!filePath) return callback(null,null)
        //create a stream to write file on our storage
        var file = fs.createWriteStream("tmp" + filePath);
        //get file
        var request = http.get("http://localhost:9000"+filePath, function(response) {
          //store it with created write stream
          response.pipe(file);
      
              reqHandler(
                "sendDocument",
                {
                  document: fs.createReadStream(file.path),
                  chat_id: result._doc.chatId,
                  reply_to_message_id: result._doc.message_id
                },
                function(response) {

                  console.log("tg res file",response)
                  if(response.error) return callback(response.error,null)
                  var reply = {
                    userId: req.body.userId,
                    filePath,
                    message_id: response.result.message_id
                  };
                  callback(null,reply)
                  
                });
              })
                

      }],(err,replys)=>{
        if(err) return res.status(500).json({error:err})
        var replysArray=result.replys
        replys.map(r=>{
          if(!r) return
        if (replysArray)
        replysArray.push(r || replysArray);
        else replysArray = r || replysArray;
      })
      messages_sc.update({_id:result._id},{replys:replysArray},function(error, sentMsg) {
          if (!error) return res.status(200).json({ sentMessage: sentMsg});
          else return res.status(500).json({ error: error});
        });
        
      })
  });
});

/*exmaple:
{
	"_id":"5a62fea1ba1ee7221416779f",
	"message_id":224,
	"chatId":98445056,
	"text":"just 4 test!!",
	"userId":"5a509716513a501c9cce24c6"
}
example home:
{"_id":"5a61ab39b6def3171ee9992d",
	"text":"dear7",
	"message_id":"227"
	
}
*/
router.post("/reply/edit", function(req, res) {
  messages_sc.findById(req.body._id).exec(function(err, result) {
    if (err)
      return res.status(500).json({
        error: err
      });
    if (!result)
      return res.status(500).json({
        error: "There is no message with _id=" + req.body._id
      });

    reqHandler(
      "editMessageText",
      {
        text: req.body.text,
        chat_id: result._doc.chatId,
        message_id: req.body.message_id,
        reply_to_message_id: result._doc.message_id
      },
      function(response) {
        if (!response)
          return res.status(500).json({
            error: "There is a problem in sending edited message..."
          });

        var reply = {
          text: response.result.text,
          message_id: response.result.message_id
        };
        //update reply in messages schema...

        messages_sc.findOneAndUpdate(
          {
            "replys.message_id": reply.message_id
          },
          {
            "replys.$.text": reply.text
          },
          {
            new: true
          },
          function(err, updated) {
            if (err)
              return res.status(500).json({
                error: err
              });
            if (!updated)
              return res.status(404).json({
                error: "reply was not found."
              });
            return res.status(200).json({
              updatedMessage: updated
            });
          }
        );
      }
    );
  });
});

//send file
bot.command("send_drawing", function (msg, reply, next) {
  var stream = fs.createReadStream("./drawing.jpg");
  reply.action("upload_photo");
  reply.photo(stream, "My drawing");
});

module.exports = router;
