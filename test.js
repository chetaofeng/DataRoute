/*
const http = require('http');
async function ab() {
  //这里的关键是await后面要跟一个Promise
  await new Promise(function(resolve) {
    http.get('http://www.baidu.com/', (res) => {
      console.log(res);
    resolve();
  })
  });
  console.log('2');
  console.log('3');
}

ab();
*/


console.log( new Date().getTime())
//().toLocaleTimeString()
//
// setInterval(function(){
// 	console.log('haha')
// },1000)