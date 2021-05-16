CityId.json 是一个中国所有城市的名称与ID。

某城市未来15天的天气数据API：
http://t.weather.itboy.net/api/weather/city/101280101

当天基础天气数据：
http://www.weather.com.cn/data/sk/101280101.html


天气小图标的做法：
big.n01 {
    background-position: -240px -480px;    // 每 +/- 80px就切换一个图标
}
big.jpg80 {
    // 下面是大图标，小图标：https://i.tq121.com.cn/i/weather2015/png/blue30.png
    background-image: url(https://i.tq121.com.cn/i/weather2015/png/blue80.png);
    height: 80px;
    width: 80px;
}
<big class="jpg80 n01"></big>


摄氏度：℃
