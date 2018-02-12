var express = require('express');
var router = express.Router();
var messages_sc = require('../Schema/messages')
var _ = require("lodash")
var reqHandler = require('../tools/reqHandler')


// var replyMessage = function (req, callback) {
  router.post('/new', function (req, res) {

  //inputs:text of reply, user id from session,chatId,message_id
  message_sc.findById(req.body._id).exec(function (err, result) {
    // if (!err) {
      console.log("message:", result)
      console.log("req.body.reply:", req.body)
      var reply = {
        text: req.body.text,
        //date:req.body.date,
        // userId: req.body.userId
        // userId: req.body.token
        userId: req.session.userId
      }
      reqHandler("sendMessage", {

        text: req.text,
        chat_id: req.chatId,
      },  function (err, d) {})})
    //     console.log(err, d)
    //     if (err) {
    //         res.status(500).json({
    //             error: err
    //         })
    //     } else {

    //         if (result._doc.replys) {
    //             result._doc.replys.push(reply || result._doc.replys);
    //         } else {
    //             result._doc.replys = reply || result._doc.replys;

    //         }
    //         // Save the updated document back to the database
    //         result.save(function (err, result) {
    //             if (!err) {
    //                 res.status(200).send(result);
    //             } else {
    //                 res.status(500).send(err)
    //             }
    //         })
    //     }

     
    //    ) })} }else {
    //   res.status(500).json({
    //     error: err
//       });
//     }

// }
// })

// var editReply=function (req,callback){
//     var replyId=req.replyId;

//   messages_sc.findById(req.messageId,{_id:0,chatId:1,replys:1}).exec(function(error,result){

//     if (!error) {
//         console.log('result: ',result)

//         var totalCount=result.length;
//         var count={}
//         if (result) {
//           //this will loop in result. 
//           result.map(item=>{
//             console.log(item.text)
//             //item is one item of result array. its like this:
//             /**
//              * {
//              *  text:"fine"
//              * }
//              */
//                 if(!count[item.text]) count[item.text]=1;
//                 else count[item.text]++;
//             })
//             //now count is a json like this:
//             /**
//              * {
//              * "fine":3,
//              * "not bad":2
//              * }
//              */

//             console.log(count)
//             //we have to make it beauty to make our result more readable.
//             var votes=[];
//             //This will loop in keys of a json(count)
//             /**
//              * in first loop >> value is 3, key is "fine"
//              * in second loop >> value is 2,key is "not bad"
//              */
//             _.mapKeys(count,(value,key)=>{
//               //I'm just make a more readable result here, votes is an array of jsons with title key and count key.
//                 votes.push({title:key,count:value,percent:Math.round(value*100/totalCount)});
//             });

//             //We have to return the result with callback function(it's not our robot's callback stuff... it's the callback that will be called when a function has been done it's process.)
//             callback({votes,totalCount})
//             // keys=result.map(item=>result._doc.text)

//         } else {
//           res.json({
//             error: 'There is no user to select...'
//           });
//         }
//       } else {
//         res.status(500).json({
//           error: error
//         })
//       }

// }
    })
module.exports = router;
