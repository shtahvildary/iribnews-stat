var mongoose=require('mongoose');
var url;
if(process.env.DB_HOST=='localhost'||process.env.DB_AUTH==0){
    url=process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;
}
else{
    url='mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME+'?authSource='+process.env.DB_AUTH_SOURCE;
}

mongoose.connect(url);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error!'));
db.once('open',function(){
});

module.exports=db;