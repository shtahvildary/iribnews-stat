var express = require('express');
var router = express.Router();
var messages_sc = require('../Schema/messages')
var _ = require("lodash")
var reqHandler = require('../tools/reqHandler')


// var replyMessage = function (req, callback) {
router.post('/reply/new', function (req, res) {

  //inputs:text of reply, user id from session,chatId,message_id
  messages_sc.findById(req.body._id).exec(function (err, result) {
    if (err) 
      return res.status(500).json({
        error: err
      })
    
    console.log("message:", result)
    console.log("req.body.reply:", req.body)
    // var reply = {
    //   text: req.body.text,
    //   //date:req.body.date,
    //   // userId: req.body.userId
    //   // userId: req.body.token
    //   userId: req.body.userId
    // }
    reqHandler("sendMessage", {

      text: req.body.text,
      chat_id: result._doc.chatId,
    }, function (response) {
      console.log(response)
      if (!response)
        res.status(500).json({
          error: "There is a problem in sending message..."
        })
      else {
        console.log('response: ', response)
        var reply = {
          userId: req.body.userId,
          text: response.result.text,
          message_id: response.result.message_id
        }
        //save reply to messages schema...
        if (result._doc.replys) {
          result._doc.replys.push(reply || result._doc.replys);
        } else {
          result._doc.replys = reply || result._doc.replys;

        }
        result.save(function (err, result) {
          if (!err) {
            res.status(200).send(result);
          } else {
            res.status(500).send(err)
          }
        })

      }

    })
  })
})

  router.post('/reply/edit', function (req, res) {
    messages_sc.findById(req.body._id).exec(function (err, result) {
      if (err) 
        return res.status(500).json({
          error: err
        })
      
      console.log("message:", result)
      console.log("req.body.reply:", req.body)
      reqHandler("editMessageText",{

        text: req.body.text,
        chat_id: result._doc.chatId,
        message_id:req.body.message_id
      },function(response){
        if (!response)
        return res.status(500).json({
          error: "There is a problem in sending edited message..."
        })
      
        console.log('response: ', response)
        var reply = {
          userId: req.body.userId,
          text: response.result.text,
          message_id: response.result.message_id
        }
        //update reply in messages schema...
        
        
        
        
        
        
        
        
        
        
        
        
        
        if (result._doc.replys) {
          var test=result._doc.replys.find(function(message_id){return message_id=response.result.message_id})
          console.log(test)
          result._doc.replys.push(reply || result._doc.replys);
        } else {
          result._doc.replys = reply || result._doc.replys;

        }
        result.save(function (err, result) {
          if (!err) {
            res.status(200).send(result);
          } else {
            res.status(500).send(err)
          }
        })
      })
  })
})
  
module.exports = router;