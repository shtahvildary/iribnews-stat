var bot;

module.exports=function(mainBot){
keyboards=require("../callbacks/keyboards")
    bot=mainBot;
    bot.command("start", function (msg, reply) {
        reply.inlineKeyboard(keyboards.mainMenueKeys).text("سلام، خوش آمدید. پیشاپیش از شما که از این طریق  با ما در ارتباطید  و نظرات خود را در مورد برنامه های مختلف شبکه و نیز کانال تلگرامی شبکه با ما در میان می گذارید متشکریم.");  
        
    })
}