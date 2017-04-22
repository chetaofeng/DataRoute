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


var tableName
//tableName='node_user'
var index = -1

//Promise函数，用来获取第一个待传文件名称
var getFirstFile = function () {
    return new Promise(function (resolve, reject) {
        index = index + 1
        if (index == tableList.length) {
            index = 0
        }
        tableName = tableList[index]
        resolve()
    })
}




var getDownLoadVer = function (fileName) {
    var kk = fs.readdirSync('./public/centerdownload')
    var rt = '100'
    for (var item in kk) {
        if (kk[item].indexOf(fileName) > -1) {
            rt = kk[item].split('.')[1]
        }
    }
    return rt
}


//console.log(x)

var getDownLoad = function () {
    return new Promise(function (resolve, reject) {

        console.log('TableName:'+tableName)
        //获取链接
        pool.getConnection(function (err, connection) {
            if(err)
            {
                reject(-1)
            }
            //查表
            var query = connection.query('select count(*) as cnt from node_user',// + tableName,
                function (err, results, fields) {
                    if(err)
                    {
                        reject(-2)
                    }

                    console.log('Count:'+results[0].cnt)
                    //如果有待传数据
                    if (results[0].cnt > 0) {
                        //获取所有数据
                        var query1 = connection.query('select * from node_user' ,//+ tableName,
                            function (err, results, fields) {
                                if(err)
                                {
                                    reject(-3)
                                }
                                console.log('Result:'+JSON.stringify(results))
                                //获取当前版本号
                                var ver = getDownLoadVer(tableName)
                                //当前文件名
                                var oldname = './public/centerdownload/' + tableName + '.' + ver
                                //新文件名
                                var newname = './public/centerdownload/' + tableName + '.' + (parseInt(ver) + 1)
                                //删除旧文件

                                console.log('Old:'+oldname)
                                console.log('New:'+newname)

                                //获取当前版本号
                                if (fs.existsSync(oldname)) {
                                    fs.unlinkSync(oldname)
                                }
                                //写新文件
                                fs.writeFileSync(newname, JSON.stringify(results))
                                //修改Oracle版本信息
                                var sql = 'update t_down_table_ver set ver_no=' + (parseInt(ver) + 1) + ',rows_count=' + results.length + ',update_time=now()'
                                console.log(sql)
                                connection.release();
                                resolve()

                            })
                    }
                })
        })

    })
}

var bg = function () {
    getFirstFile().then(getDownLoad).then(function () {
        setTimeout(function () {
          bg()
        },3000)
    }).catch(function () {
        setTimeout(function () {
            bg()
        },3000)
    })
}

bg()