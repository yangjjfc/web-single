/**
 * 匹配字符串
 * @param {*需要匹配的内容} content 
 * @param {*匹配的正则,数组} arrReg []
 */
export const match = (content, arrReg) => {
    let arr = [];
    arrReg = arrReg.split(',');
    arrReg.forEach(item => {
        let reg = new RegExp(item),
            res = content.match(reg)
        if (res && res.length) {
            arr.push(res[0])
        }
    })
    return arr
}

