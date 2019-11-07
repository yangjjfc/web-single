/**
 * 修改packjson中的name
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const project = require('../project.json');

const resove = (dir) => path.resolve(__dirname, '../', dir);
// 待优化 递归 try url
const getFile = (url) => {
    try {
        return JSON.parse(fs.readFileSync(resove(url)));
    } catch (error) {
        console.error('解析文件错误', error)
        process.exit(1)
    }
}

let packjson = require('../package.json');
let times = crypto.createHash('sha1').update(new Date() + '').digest('hex').substr(0, 8); //生成hash
//模块名
let moduleName = project.name;
packjson.name = moduleName + '.' + times;
//把生成的时间戳记录下来
let projectJson = getFile('project.json');
projectJson[moduleName] = `/${moduleName}/${packjson.name}.umd.min.js`;

fs.writeFileSync(resove('package.json'), JSON.stringify(packjson, null, 4));
fs.writeFileSync(resove('project.json'), JSON.stringify(projectJson, null, 4));