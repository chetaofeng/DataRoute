/**
 * Created by apple on 2017/4/25.
 */

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


////xxxxxxxxxxxx
//////ffffffffff
/// 44444444444444
////5555555555

////6666666666666