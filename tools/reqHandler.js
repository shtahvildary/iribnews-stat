var request=require("request");
var url="https://api.telegram.org/bot449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk/";

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