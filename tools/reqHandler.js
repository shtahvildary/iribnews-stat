var request=require("request");
//admin it-word cloud
// var url="https://api.telegram.org/bot456299862:AAGB1q_AMolsLpeE5EARolW4FHEi5-1kqjE/";
//shmt_bot
// var url="https://api.telegram.org/bot449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk/";
//iribnewsbot
var url="https://api.telegram.org/bot545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4/";

var req=function(method,reqBody,callback){
    var options = {
        url:url+method,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        
      };
      if(method=="sendDocument")options.formData=reqBody;
      else options.json= reqBody;
   
      request(options, function(err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
          (res,body);
          callback(body);
        }
        else{
          // return body
        }
      });

}
module.exports=req;