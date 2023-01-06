/**
 * 日期处理模块
 * 用于格式化日期
 * @param time
 * @returns {string}
 */

export function formatDate(time){
    if(time) return '' //如果获取时间为空的话返回一个空串
    let date = new Date(time)
    let year = date.getFullYear() //获取年份
    let month = date.getMonth()+1  //获取月份
    let day = date.getDate()  //获取日期
    let hour = date.getHours() //获取时
    let minute = date.getMinutes() //获取分
    let second = date.getSeconds() //获取秒
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return year + '-' + month + '-' + day + " " + hour + ':' + minute + ':' + second;
}