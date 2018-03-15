var express = require("express");
var router = express.Router();
var _ = require("lodash");
var reqHandler = require("../tools/reqHandler");
var messages_sc = require("../Schema/messages");
var http=require("http");
var fs=require("fs")

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
      "sendMessage",
      {
        text: req.body.text,
        chat_id: result._doc.chatId,
        reply_to_message_id: result._doc.message_id
      },
      function(response) {
        console.log(response);
        if (!response)
          return res.status(500).json({
            error: "There is a problem in sending message..."
          });
        var reply = {
          userId: req.body.userId,
          text: response.result.text,
          message_id: response.result.message_id
        };
      
        //save reply to messages schema...
        if (result._doc.replys)
          result._doc.replys.push(reply || result._doc.replys);
        else result._doc.replys = reply || result._doc.replys;

        var {filePath}=req.body;
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
          });
        result.save(function(error, sentMsg) {
          if (!error) return res.status(200).json({ sentMessage: sentMsg});
          else return res.status(500).json({ error: error});
        });
  });
        
      }
    );
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

module.exports = router;
