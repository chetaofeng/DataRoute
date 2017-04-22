/**
 * Created by qiang on 2017/4/16.
 */
require("babel-core/register")
var getRawBody =  require('raw-body')
var exec = require('child_process').exec

exec('forever start test.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});


//require('./test')

/*
*Node.js 服务端配置
 服务端使用 Babel，最简单的方式是通过requirehook。

 首先安装 Babel：

 $ npm install babel-core --save
 安装 async/await 支持：

 $ npm install babel-preset-stage-3 --save
 在服务端代码的根目录中配置 .babelrc 文件，内容为：

 {
 "presets": ["stage-3"] }
 在顶层代码文件（server.js 或 app.js 等）中引入 Babel 模块：

 require("babel-core/register");
 在这句后面引入的模块，都将会自动通过 babel 编译，但当前文件不会被 babel 编译。另外，需要注意 Node.js 的版本，如果是 4.0 以上的版本则默认支持绝大部分 ES6，可以直接启动。但是如果是 0.12 左右的版本，就需要通过node —harmory来启动才能够支持。因为 stage-3 模式，Babel 不会编译基本的 ES6 代码，环境既然支持又何必要编译为 ES5？这样做也是为了提高性能和编译效率。
* */