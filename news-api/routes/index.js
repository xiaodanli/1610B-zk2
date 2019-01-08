var express = require('express');
var router = express.Router();

var mongo = require('mymongo1610/utils/getCollection');

console.log(mongo)；

var mymongo = require('mymongo1610');

/* GET home page. */
router.get('/api/getList', function(req, res, next) {

    var params = req.query,
        searchKey = params.searchKey || '';  //一

    var searchObj = searchKey ? {title:{$regex:searchKey}} : {};  // /searchKey/

    var page = params.page || 1,   // 第几页 1
        limit = params.limit*1 || 10; //每页显示的条数  3

    mongo('newslist',function(err,db,cols){
        if(err){
            res.json({code:0,msg:err})
        }else{
            cols.find(searchObj).count(function(error,totalNum){
                if(error){
                    res.json({code:0,msg:error})
                }else{
                    var total = Math.ceil(totalNum/limit); //计算总页数
                    selectList(total);
                }
            })
        }

        function selectList(total){
            var skipNum = (page - 1)*limit;

            cols.find(searchObj).skip(skipNum).limit(limit).toArray(function(error,results){
                db.close();
                if(error){
                    res.json({code:0,msg:error})
                }else{
                    res.json({code:1,data:results,total:total})
                }
            })
        }
    })
  
});


// 删除
router.get('/api/del',function(req,res,next){
    var id = req.query.id;

    if(id){
        mymongo.delete('newslist',{_id:id} , function (err) {
            if(err){
                res.json({code:0,msg:'删除失败'})
            }else{
                res.json({code:1,msg:'删除成功'})
            }
        })
    }else{
        res.json({code:3,msg:'丢失参数'})
    }

    

    // mongo.connect('newslist',function(err,cols,db){
    //     if(err){
    //         res.json({code:0,msg:err})
    //     }else{
    //         cols.deleteOne({_id:id},function(error,results){
    //             if(error){
    //                 res.json({code:0,msg:'删除失败'})
    //             }else{
    //                 res.json({code:1,msg:'删除成功'})
    //             }
    //             db.close();
    //         })
    //     }
    // })
})

module.exports = router;
