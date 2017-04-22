//存取文件的类
var fs = require('fs')
//处理路径的类
var path = require('path')
//存放配置文件
var config = require('./config')
//var oracledb = require('oracledb');

//oracledb.autoCommit = true


//连接Mysql数据库
var mysql = require('mysql');

//创建mysql数据库连接池
var pool = mysql.createPool(
    config.mysql
);


//获取Post数据
var data
var pathfrom


//生成黑名单列表
var tableList = ['T_SECU_ROLE',
    'T_SECU_FUNCTIONS',
    'T_CARD_DISCOUNT_INFOR',
    'T_COMM_NODE',
    'T_COMM_ORGAN',
    'T_COMM_ROAD',
    'T_DICT_VEHICLE_CASE',
    'T_SPEED_LIMIT',
    'T_WEIGHT_PARAM',
    'TBL_VEHICLE_BLACK'
]



//console.log(tableList[1])

//Promise函数，用来获取第一个待传文件名称
// var getFirstFile = function () {
//     for(var o in tableList){
//         console.log(tableList[o])
//
//     }
// }
//
// getFirstFile()


var getDownLoadVer=function(fileName)
{
    var kk = fs.readdirSync('./public/centerdownload')
    var rt ='100'
    for(var item in kk) {
        if(kk[item].indexOf(fileName) >-1 )
        {
            rt = kk[item].split('.')[1]
        }
        //console.log(kk[item]+",");
    }
    return rt
}



//console.log(x)

var getDownLoad = function (tableName) {

    //获取链接
    pool.getConnection(function (err, connection) {

        //查表
        var query = connection.query('select count(*) as cnt from ' + tableName,
            function (error, results, fields) {
                console.log(results[0].cnt)
                //如果有待传数据
                if (results[0].cnt > 0) {

                    //获取所有数据
                    var query1 = connection.query('select * from ' + tableName,
                        function (error, results, fields) {
                            console.log(JSON.stringify(results))
                            //获取当前版本号
                            var ver = getDownLoadVer(tableName)
                            //当前文件名
                            var oldname ='./public/centerdownload/' + tableName+'.'+ ver
                            //新文件名
                            var newname ='./public/centerdownload/' + tableName+'.'+ (parseInt(ver)+1)
                            //删除旧文件
                            //fs.unlinkSync(oldname)
                            //写新文件
                            fs.writeFileSync(newname,JSON.stringify(results))

                            //修改Oracle版本信息
                            console.log('Oracle DataVer:'+tableName+'  '+newname)




                        })
                }

            })
    })

}

getDownLoad('node_user')

/*
 pool.getConnection(function (err, connection) {
 if (err) {
 return
 }
 else {

 var query = connection.query('DELETE FROM t_table_data_ver WHERE NODE_ID=? AND TABLE_NAME=?', [data.ROWS[0].NODE_ID, data.ROWS[0].TABLE_NAME],
 function (error, results, fields) {
 console.log('删除SQL语句:' + query.sql)
 if (error) {
 console.log('删除错误:' + error)
 connection.release();
 reject(-32)
 return
 }

 */

/*
 var getDownloadVersion = function () {


 var doconnect = function (cb) {
 oracledb.getConnection(
 config.oracle
 ,
 cb);
 };

 var dorelease = function (conn) {
 conn.close(function (err) {
 if (err)
 console.error(err.message);
 });
 };

 var doupdate = function (conn, cb) {
 let sql = 'update t_down_table_ver set select table_name,ver'
 conn.execute(
 insert // Bind values
 , {autoCommit: true},
 function (err, result) {
 if (err) {
 return cb(err, conn);
 } else {
 console.log("Rows inserted: " + result.rowsAffected);  // 1
 return cb(null, conn);
 }
 });
 };


 }





 var readFileData = function () {

 return new Promise(function (resolve, reject) {
 var fileName = pathfrom
 fs.readFile(fileName, {flag: 'r+', encoding: 'utf8'}, function (err, da) {

 if (err) {
 reject(-2)
 return
 }

 //设置数据内容
 data = JSON.parse(da)
 //休眠后发送
 // data = JSON.parse(data)


 //console.log(data)

 //模拟无数据文件
 resolve()


 }
 )
 }
 )
 }


 //接收车道传输过来的数据
 var InsertIntoOra = function () {
 return new Promise(function (resolve, reject) {
 //获取Post数据
 var insert = 'INSERT INTO ' + data.TABLENAME + convertsql(data.ROWS[0])
 var del = 'DELETE FROM T_TABLE_DATA_VER WHERE NODE_ID=' + data.ROWS[0].NODE_ID + ' AND TABLE_NAME=\'' + data.ROWS[0].TABLE_NAME + '\''

 var doconnect = function (cb) {
 oracledb.getConnection(
 config.oracle
 ,
 cb);
 };

 var dorelease = function (conn) {
 conn.close(function (err) {
 if (err)
 console.error(err.message);
 });
 };

 var doinsert = function (conn, cb) {
 console.log(insert)
 conn.execute(
 insert // Bind values
 , {autoCommit: true},
 function (err, result) {
 if (err) {
 return cb(err, conn);
 } else {
 console.log("Rows inserted: " + result.rowsAffected);  // 1
 return cb(null, conn);
 }
 });
 };

 var dodelete = function (conn, cb) {

 console.log(del)
 if (data.TABLENAME == 'T_TABLE_DATA_VER') {
 conn.execute(
 del // Bind values
 , {autoCommit: true},
 function (err, result) {
 if (err) {
 return cb(err, conn);
 } else {
 //console.log("Rows inserted: " + result.rowsAffected);  // 1
 return cb(null, conn);
 }
 });
 }
 else {
 return cb(null, conn);
 }
 }


 async.waterfall(
 [
 doconnect,
 dodelete,
 doinsert
 ],
 function (err, conn) {
 if (err) {
 console.error("In waterfall error cb: ==>", err, "<==")
 reject()
 return
 }
 else {
 conn.commit()
 if (conn)
 dorelease(conn)
 resolve()
 return
 }
 });

 }
 )
 }

 var search = function () {
 getFirstFile().then(readFileData).then(InsertIntoOra).then(function () {
 console.log('继续')
 fs.unlinkSync(pathfrom);
 search()
 }).catch(function () {
 console.log('没有')
 setInterval(function () {
 search()
 }, 10000)
 })
 }

 //exports.processData = function () {
 search()
 //}

 */