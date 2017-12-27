$(function() {
    initMap();
});
var map, driving, walking;

function initMap() {
    // 百度地图API功能
    map = new BMap.Map("l-map");
    map.centerAndZoom(new BMap.Point(113.645663, 34.748264), 16);

    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
        mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]
    }));
    //声明一个查询驾车路线的变量
    driving = new BMap.DrivingRoute(map, {
         renderOptions: {
             map: map,
             panel: "r-result",
             selectFirstResult: true,
             autoViewport: true,
             highlightMode: BMAP_HIGHLIGHT_ROUTE
         }
     });
    //声明一个查询步行路线的变量
    /*walking = new BMap.WalkingRoute(map, {
        renderOptions: {
            map: map,
            panel: "r-result",
            selectFirstResult: true,
            autoViewport: true,
            highlightMode: BMAP_HIGHLIGHT_ROUTE
        }
    });*/
    search();
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
}

function search() {
    //获取浏览器的经纬度坐标
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            //声明一个marker点
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            //查询驾车路线
            driving.search(r.point, $('#address').val());
            //查询步行路线
            /*walking.search("郑州大学南校区", $('#address').val());*/
        } else {
            alert('failed' + this.getStatus());
        }
    }, { enableHighAccuracy: true })
}

var ac = new BMap.Autocomplete( //建立一个自动完成的对象
    {
        "input": "address",
        "location": map
    });

ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    /*G("searchResultPanel").innerHTML = str;*/
});

var myValue;
ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
    var _value = e.item.value;
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    /*G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;*/

    setPlace();
});

function setPlace() {
    map.clearOverlays(); //清除地图上所有覆盖物
    function myFun() {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp)); //添加标注
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}