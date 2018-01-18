var request=require("request");
//shmt_bot
var url="https://api.telegram.org/bot449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk/";
//iribnewsbot
// var url="https://api.telegram.org/bot545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4/";

var req=function(method,reqBody,callback){
  console.log(method)
    var options = {
        url:url+method,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        json: reqBody
      };
   
      // request('http://google.com')
      request(options, function(err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
          console.log(res,body);
          callback(body);
        }
        else{
          console.log(body)
        }
      });

}
module.exports=req;