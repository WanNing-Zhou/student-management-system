import jsonp from "jsonp";


export function reqWeather(city) {
    const url =
        `https://tianqiapi.com/free/day?appid=52179899&appsecret=vzxZ9n31& unescape=1&city=${city}`;
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            // console.log(response.data);
            if (!error && response.cityid) {
                const {
                    tem_day,
                    tem_night,
                    wea,
                    wea_img
                } = response;
                resolve({
                    tem_day,
                    tem_night,
                    wea,
                    wea_img
                });

            } else {
                alert('获取天气失败');
            }
        })
    })
}