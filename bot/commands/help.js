var bot;

module.exports=function(mainBot){
keyboards=require("../callbacks/keyboards")
    bot=mainBot;
    bot.command("help", (msg, reply,next)=> {
        
            reply.text("/help  \n/start");
          });
        
   
}