var mongodb = require('mongodb');

var client = mongodb.MongoClient;

var url = 'mongodb://localhost:27017';

function connect(colsname,fn){
    client.connect(url,{useNewUrlParser:true},function(err,db){
        console.log(typeof fn)
        if(err){
            typeof fn === 'function' && fn(err)
        }else{
            var dbo = db.db('zk2');

            var collection = dbo.collection(colsname);

            typeof fn === 'function' && fn(null,collection,db);
        }
    })
}


function createObjectId(strId){
    if(strId && typeof strId === 'string'){
        return mongodb.ObjectId(strId)
    }
}

module.exports = {
    connect:connect,
    createObjectId:createObjectId
}