//存取文件的类
var fs = require('fs')
//处理路径的类
var path = require('path')
//存放配置文件
var config = require('./config')


//连接Mysql数据库
var mysql = require('mysql');
//创建mysql数据库连接池
var pool = mysql.createPool(
    config.mysql
);

//生成黑名单列表
var tableList = ['T_CARD_STOCK',
    'T_CARD_CIRCULATION',
    'T_CARD_PRECOD',
    'T_CARD_RECOVER',
    'T_TICKET_STOCK',
    'T_TICKET_CIRCULATION',
    'T_TICKET_TRASH_AUDIT',
    'T_RPT_BASE_ENTRY',
    'T_RPT_BASE_EXIT',
    'T_RPT_OPERATION_ENTRY',
    'T_RPT_OPERATION_EXIT',
    'T_RPT_TOLL',
    'T_BUSI_UNSHIFT_APPLY',
    'T_TABLE_VER',
    'T_TABLE_DATA_VER',
    'T_VEHICLE_BLACK_DEAL',
    'T_BUSI_SHIFT',
    'TBL_WASTE_CURRENT_ENTRY',
    'TBL_WASTE_CURRENT_EXIT'
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


//console.log(x)

var getDownLoad = function () {
    return new Promise(function (resolve, reject) {

        console.log('TableName:' + tableName)
        //获取链接
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(-1)
            }

            //查表
            var query = connection.query('select count(*) as cnt from node_user',// + tableName,
                function (err, results, fields) {
                    if (err) {
                        reject(-2)
                    }

                    console.log('Count:' + results[0].cnt)
                    //如果有待传数据
                    if (results[0].cnt > 0) {

                        //将所有待传数据设置为-1
                        var query1 = connection.query('update node_user set transtag=-1',//+ tableName,
                            function (err, results, fields) {
                                if (err) {
                                    reject(-3)
                                }

                                //当前文件名
                                var filename = './public/subcenterincome/' + tableName + '_' + config.local.node_id + '_' + (new Date().getTime()) + '.data'
                                //新文件名

                                //取出所有为1的数据
                                var sql3 = 'select * from  node_user where transtag=-1'

                                var query4 = connection.query(sql3,
                                    function (err, results, fields) {
                                        if (err) {
                                            reject(-5)
                                        }


                                        results.forEach(function(i){
                                            i.transtag=1
                                        })



                                        var result = {
                                            TABLENAME: tableName,
                                            TOTAL: results.length,
                                            DATAROUTE: '1111111',
                                            ROWS: results
                                        }




                                        //取出所有为1的数据
                                        var sql6 = 'update node_user set transtag = 1  where transtag=-1'

                                        var query6 = connection.query(sql6,
                                            function (err, results, fields) {
                                                if (err) {
                                                    reject(-5)
                                                }

                                                //写新文件
                                                fs.writeFileSync(filename, JSON.stringify(result))
                                                connection.release();
                                                resolve()

                                            })



                                    })


                            })
                    }


                }
            )
        })

    })
}

var bg = function () {
    getFirstFile().then(getDownLoad).then(function () {
        setTimeout(function () {
            bg()
        }, 3000)
    }).catch(function () {
        setTimeout(function () {
            bg()
        }, 3000)
    })
}

bg()