var worldOldPeopleData, taiwanOldPeopleData, margin;
worldOldPeopleData = [
  {
    "key": "日本",
    "value": 26
  }, {
    "key": "義大利",
    "value": 21
  }, {
    "key": "香港",
    "value": 14
  }, {
    "key": "台灣",
    "value": 12
  }, {
    "key": "星加坡",
    "value": 11
  }, {
    "key": "中國",
    "value": 9
  }, {
    "key": "越南",
    "value": 7
  }
];
taiwanOldPeopleData = [
  {
    "key": '彰化碧峰里',
    "value": 43
  }, {
    "key": '花蓮森榮里',
    "value": 41
  }, {
    "key": '南投光明里',
    "value": 41
  }, {
    "key": '台灣平均',
    "value": 12
  }, {
    "key": '新竹東平里',
    "value": 2
  }, {
    "key": '新竹關新里',
    "value": 2
  }, {
    "key": '新竹大鵬里',
    "value": 2
  }
];
margin = {
  top: 12,
  left: 120,
  right: 36,
  bottom: 24
};

$( document ).ready(function() {
  if ( $('.old-people-chart').length != 0 ) {
    function chart_animation() {
      var waypoint = new Waypoint({
        element: $('.old-people-chart'),
        handler: function(direction) {
          barChart().data(worldOldPeopleData).container('.world-old-people-data').margin(margin).barHeight(36)();
          barChart().data(taiwanOldPeopleData).container('.taiwan-old-people-data').margin(margin).barHeight(36)();
          this.destroy();
        },
        offset: '90%'
      })
    }
    chart_animation();
  }

});