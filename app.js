/**
 * Created by apple on 2017/4/25.
 */

////////sssss

var fs = require('fs')

exports.sysCheck=function () {


    if (!fs.existsSync('./public/stationgetdownload/')) {
        console.log('不存在')
        fs.mkdirSync('./public/stationgetdownload/')
    }
    else {
        console.log('存在')
    }
}



////6666666666666
//777
