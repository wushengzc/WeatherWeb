function createButton(cityname, ck){
    // 创建button
    var btn;
    btn = document.createElement("button");
    btn.innerHTML = cityname;
    btn.value = ck;
    btn.className = "ui-btn ui-shadow ui-corner-all";
    btn.onclick = function () {
        load(this.value);
        render();
    }
    $("[aria-hidden]").append(btn);
}

// 加载已添加的城市列表的按钮
function renderCitys() {
    console.log(111);
    var citystr = localStorage.getItem("citystr");
    if(citystr == undefined){
        return 0;
    }
    var citykeyarr = citystr.split(',');
    var citynamearr = [];
    for (var i = 0; i < citykeyarr.length; i++) {
        citynamearr[i] = getCityName(citykeyarr[i]);
    }

    var btn;
    for (var i = 0; i < citykeyarr.length; i++) {
        btn = document.createElement("button");
        btn.innerHTML = citynamearr[i];
        btn.value = citykeyarr[i];
        btn.className = "ui-btn ui-shadow ui-corner-all";
        btn.onclick = function () {
            load(this.value);
            render();
        }
        $("[aria-hidden]").append(btn);
    }
}

// 根据cityName从字典中获取citykey，并设置
function setCityKey(cityName) {
    for (var i in cityIdDict) {
        if (cityIdDict[i].city == cityName) {
            citykey = cityIdDict[i].id;
            break;
        }
    }
}

// 检查地点是否存在，并返回citykey
function checkCity(cityname) {
    var citykey;
    for (var i in cityIdDict) {
        if (cityIdDict[i].city == cityname) {
            citykey = cityIdDict[i].id;
            break;
        }
    }
    return citykey;
}

// 返回cityname
function getCityName(citykey) {
    var citykey;
    for (var i in cityIdDict) {
        if (cityIdDict[i].id == citykey) {
            cityname = cityIdDict[i].city;
            break;
        }
    }
    return cityname;
}

// 数据源：http://t.weather.itboy.net/api/weather/city/101280101
// 对CityWeather对象初始化一部分属性
function setValue1(data) {
    // cityinfo
    CityWeather.cityInfo.cityKey = citykey;
    CityWeather.cityInfo.city = data.cityInfo.city;
    CityWeather.cityInfo.updateTime = data.cityInfo.updateTime;
    CityWeather.cityInfo.parent = data.cityInfo.parent;

    // currentWeather
    CityWeather.currentWeather.quality = data.data.quality;
    CityWeather.currentWeather.pm25 = data.data.pm25;
    CityWeather.currentWeather.shidu = data.data.shidu;
    CityWeather.currentWeather.wendu = data.data.wendu;
    CityWeather.currentWeather.fx = data.data.forecast[0].fx;
    CityWeather.currentWeather.fl = data.data.forecast[0].fl;
    CityWeather.currentWeather.notice = data.data.forecast[0].notice;

    // future15d
    // 注意：phrase_img属性没有赋值，它从另一个API获取
    for (var i in data.data.forecast) {
        for (var key in CityWeather.future15d[i]) {
            if (key != "phrase_img") {
                CityWeather.future15d[i][key] = data.data.forecast[i][key];
            }
        }
    }
}

// 数据源：https://v0.yiketianqi.com/api/worldchina?appid=45693422&appsecret=gfk2fFT2
// 对CityWeather对象初始化另一部分属性
function setValue2(data) {
    CityWeather.currentWeather.feelsLike = data.day.feelsLike;
    CityWeather.currentWeather.altimeter = data.day.altimeter.split(".")[0];
    CityWeather.currentWeather.phrase = data.day.phrase;

    // future24h
    for (var i in data.hours) {
        for (var key in CityWeather.future24h[i]) {
            CityWeather.future24h[i][key] = data.hours[i][key];
        }
    }

    // 补充：对phrase_img属性赋值
    for (var i in data.month) {
        CityWeather.future15d[i].phrase_img = data.month[i].day.phrase_img;
    }
}

function load(citykey) {
    console.log(citykey);

    // 拿第一批数据
    var url1 = atob("aHR0cDovLzE4Mi4yNTQuMTM1LjIzOTo4MDgwL2NoYW8ucGhwP2NpdHlrZXk9") + citykey;
    $.get(url1, function (data, status) {
        if (status == "success") {
            setValue1(data);
        }

        // 拿第二批
        var url2 = "https://v0.yiketianqi.com/api/worldchina?appid=45693422&appsecret=gfk2fFT2&cityid=" + citykey;
        $.get(url2, function (data, status) {
            if (status == "success") {
                setValue2(data);
            }

            // 拿完数据，开始将数据加载到页面中
            render();
        })
    })
}

function renderOne(className) {
    var length = document.getElementsByClassName(className).length;
    for (var i = 0; i < length; i++) {
        document.getElementsByClassName(className)[i].innerHTML = CityWeather.currentWeather[className];
    }
}

function renderCommon(classes, len, key1) {
    key2 = [];
    for (var i = 0; i < classes.length; i++) {
        key2[i] = classes[i].substring(0, classes[i].length - (len + '').length);
    }
    for (var i = 0; i < len; i++) {
        for (var j in classes) {
            document.getElementsByClassName(classes[j])[i].innerHTML = CityWeather[key1][i][key2[j]];
        }
    }
}

function swapBigIcon() {
    var bigicon = document.getElementsByClassName("bigicon")[0];

}

function renderImage(imgclass, len, key1) {
    var imgs = document.getElementsByClassName(imgclass);
    for (var i = 0; i < len; i++) {
        imgs[i].src = "img/" + CityWeather[key1][i][imgclass] + ".png";
    }
}

// 加载数据到页面中
function render() {
    // 主页
    var cityh1 = document.getElementsByClassName("city");
    for (var i = 0; i < cityh1.length; i++) {
        cityh1[i].innerHTML = CityWeather.cityInfo.city;
    }

    // 当天的天气数据
    var classNames = [
        "wendu",
        "phrase",
        "pm25",
        "fl",
        "fx",
        "shidu",
        "feelsLike",
        "altimeter"
    ];
    for (var i in classNames) {
        renderOne(classNames[i]);
    }


    // 未来3天的天气数据
    var days_3 = [
        "type3",
        "high3",
        "low3"
    ];
    renderCommon(days_3, 3, "future15d");

    // 未来24小时的天气数据
    var hours_24 = [
        "time24",
        "tem24",
        "windSpeed24"
    ]
    renderCommon(hours_24, 24, "future24h")
    // document.getElementsByClassName("time24")[0].innerHTML = "现在";

    // 未来15天的天气数据
    var days_15 = [
        "ymd15",
        "high15",
        "low15",
    ];
    renderCommon(days_15, 15, "future15d");

    // 修改数据细节
    lows = document.getElementsByClassName("low15");
    for (var i = 0; i < lows.length; i++) {
        lows[i].innerHTML = lows[i].innerHTML.split(" ")[1];
    }
    highs = document.getElementsByClassName("high15");
    for (var i = 0; i < highs.length; i++) {
        highs[i].innerHTML = highs[i].innerHTML.split(" ")[1];
    }
    ymd15 = document.getElementsByClassName("ymd15");
    for (var i = 0; i < ymd15.length; i++) {
        ymd15[i].innerHTML = ymd15[i].innerHTML.split("-")[1] + "月" + ymd15[i].innerHTML.split("-")[2] + "日";
    }

    // 图片更换
    renderImage("wea_img", 24, "future24h");
    renderImage("phrase_img", 15, "future15d");
}

// GPS获取地址位置是异步进行的，因此如果在这里获取成功，那就重新渲染一次页面。
// 如果没有成功获取到，则不影响往下执行
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "该浏览器不支持获取地理位置";
    }
}

// 获取地理位置
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var cityName;
    // 利用api和坐标获取城市ID
    var url = "https://restapi.amap.com/v3/geocode/regeo?output=xml&location=" + longitude + "," + latitude + "&key=80b368e3987c1b342868a4ce780dda7c&radius=1000&extensions=all";
    $.get(url, function (data, status) {
        if (status === "success") {
            cityName = data.getElementsByTagName("city")[0].childNodes[0].nodeValue;

            setCityKey(cityName);

            load(citykey);
            // render(CityWeather);
        } else {
            alert("获取经纬度失败，检查请求地址是否有效");
        }
    })
}
