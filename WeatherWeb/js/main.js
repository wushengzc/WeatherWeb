// 城市citykey，用以获取天气数据
var citykey;

// 显示城市的步骤：1、关注城市；2、GPS（异步，重新渲染即可）；3、从城市列表选择首个城市；4、北京市
if (window.localStorage) {
    var following = localStorage.getItem("following");

    // 如果关注了某个城市，就显示它的天气情况
    if (following == 1) {
        citykey = localStorage.getItem("citykey");

        // 如果没有关注或没有following键，就先通过GPS获取地理位置（异步）
    } else {
        getLocation();

        var citystr = localStorage.getItem("citystr");

        // 从城市列表中获取第一个城市的citykey
        if (citystr != undefined) {
            citykey = citystr.split(',')[0];
        }

        // 如果citykey仍没定义，就默认选择北京市的id
        if (citykey == undefined) {
            citykey = "101010100";
        }
    }

} else {
    alert("浏览器不支持本地存储");
};
// 初步加载数据
load(citykey);


$(document).ready(function () {

    renderCitys();

    // 1、搜索功能
    $("#sear_btn").click(function () {
        var cityname = $("input#search").val();
        if (checkCity(cityname) != undefined) {
            citykey = checkCity(cityname);
            load(citykey);
            render();
        } else {
            alert("地点不存在");
            $("input#search").val("");
        }
    })

    // 2、关注功能
    var following = localStorage.getItem("following");
    if (following == 1) {
        $("input#following")[0].checked = true;
        $(".fcity")[0].readOnly = true

        var cityname = "";
        citykey = localStorage.getItem("citykey");
        for (var i in cityIdDict) {
            if (cityIdDict[i].id == citykey) {
                cityname = cityIdDict[i].city;
                break;
            }
        }
        load(citykey);
        render();
        console.log(cityname);
        $(".fcity")[0].value = cityname;

    } else if (following == 0 || following == undefined) {
        $("input#following")[0].checked = false;
        $(".fcity")[0].readOnly = false
    }

    // 监听开关按钮点击事件
    $("input#following").change(function () {
        if ($("input#following")[0].checked) {
            var cityname = $(".fcity")[0].value;
            var flag = 0;
            for (var i in cityIdDict) {
                if (cityIdDict[i].city == cityname) {
                    citykey = cityIdDict[i].id;
                    flag = 1;
                    break;
                }
            }
            if (flag == 1) {
                $(".fcity")[0].readOnly = true
                localStorage.setItem("following", 1);
                localStorage.setItem("citykey", citykey);
                load(citykey);
                render();
            } else {
                alert("地点不存在");
                localStorage.setItem("following", 0);
                $(".fcity")[0].readOnly = false
                $("input#following")[0].checked = false;
            }
        } else {
            localStorage.setItem("following", 0);
            $(".fcity")[0].readOnly = false
        }
    })

    // 3、添加城市
    $("#addCity").click(function () {
        var cityname = $(".acity").val();
        var ck = checkCity(cityname);
        if (ck != undefined) {
            var citystr = localStorage.getItem("citystr");
            if (citystr == undefined) {
                localStorage.setItem("citystr", ck);
                createButton(cityname, ck);
            } else {
                if (citystr.indexOf(ck + '') < 0) {
                    localStorage.setItem("citystr", citystr + "," + ck);

                    createButton(cityname, ck);
                }
            }
        } else {
            alert("地点不存在");
            $(".acity").val("");
        }
    })

    // 删除城市
    $("#delCity").click(function () {
        var cityname = $(".dcity").val();
        var ck = checkCity(cityname);
        if (ck != undefined) {
            var citystr = localStorage.getItem("citystr");
            if (citystr == undefined) {
                alert("还没有添加过地点");
            } else {
                var cityarr = citystr.split(",");
                var cityarr2 = [];
                for(var i = 0, j = 0; i < cityarr.length; i++){
                    if(cityarr[i] != ck){
                        cityarr2[j++] = cityarr[i];
                    }
                }
                cityarr.length == cityarr2.length ? alert("还没有添加这个地点") : alert("删除成功")
                if(cityarr2.length == 0){
                    localStorage.removeItem("citystr");
                    $("[value=" + ck + "]").remove();
                } else {
                    citystr = cityarr2.join(',');
                    localStorage.setItem("citystr", citystr);
                    $("[value=" + ck + "]").remove();
                }
            }
        } else {
            alert("地点不存在");
            $(".dcity").val("");
        }
    })
})