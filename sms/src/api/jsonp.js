import jsonp from "jsonp";

export function getWeather(city) {
    const url = `https://tianqiapi.com/free/day?appid=52179899&appsecret=vzxZ9n31& unescape=1&city=${city}`;

    //返回一个promise对象
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback',
        }), (error, response) => {
            if (!error && response.cityid) {
                const {
                    tem_day,//白天温度
                    tem_night,//夜晚温度
                    wea,//天气
                    wea_img//天气土拍你
                } = response; //解构赋值将属性从对象中取出
                resolve({
                    tem_day,
                    tem_night,
                    wea,
                    wea_img
                });//成功的话,将成功的对象返回
            } else {
                console.log('获取天气失败');
            }
        }
    })

}