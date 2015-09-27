var worldOldPeopleData, taiwanOldPeopleData, worldOldPeopleChart, taiwanOldPeopleChart, margin, defaultColor;
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
defaultColor = function(it){
  return it.style({
    "fill": 'url(#themeGradient)'
  });
};
worldOldPeopleChart = barChart().data(worldOldPeopleData).container('.world-old-people-data').margin(margin).barHeight(36).barStyle(defaultColor);
taiwanOldPeopleChart = barChart().data(taiwanOldPeopleData).container('.taiwan-old-people-data').margin(margin).barHeight(36).barStyle(defaultColor);



$( document ).ready(function() {
  if ( $('.old-people-chart').length != 0 ) {
    worldOldPeopleChart();
    taiwanOldPeopleChart();
    function gc_barchart_animation() {
      var waypoint = new Waypoint({
        element: $('.old-people-chart'),
        handler: function(direction) {
          worldOldPeopleChart.draw();
          taiwanOldPeopleChart.draw();
          this.destroy();
        },
        offset: '90%'
      })
    }
    gc_barchart_animation();
  }

  if ( $('.people-pp-chart').length != 0 ) {
    d3.tsv("gc_linechart_data.tsv", function(err, data){
      var ratio, population, average, thousand, drawRatio, drawAverage, drawPopulation;
      ratio = _.map(function(it){
        return {
          "key": +it.year,
          "value": +it.ratio
        };
      })(
      data);
      population = _.map(function(it){
        return {
          "key": +it.year,
          "value": +it.population
        };
      })(
      data);
      average = _.map(function(it){
        return {
          "key": +it.year,
          "value": +it.average
        };
      })(
      data);
      thousand = d3.format("0,000");
      drawRatio = lineChart().data([ratio]).container('.people-ratio-data').numberFormat(function(it){
        return function(it){
          return it + "%";
        }(
        function(it){
          return it.toFixed(0);
        }(
        it * 100));
      });
      drawAverage = lineChart().data([average]).container('.people-average-data').numberFormat(function(it){
        return it.toFixed(0) + "歲";
      });
      drawPopulation = lineChart().data([population]).container('.people-population-data').numberFormat(function(it){
        return function(it){
          return it + "萬人";
        }(
        thousand(
        Math.round(
        it / 10)));
      });
      function gc_linechart_animation() {
        var waypoint = new Waypoint({
          element: $('.people-pp-chart'),
          handler: function(direction) {
            drawRatio();
            drawAverage();
            drawPopulation();
            this.destroy();
          },
          offset: '90%'
        })
      }
      gc_linechart_animation();
    });
  }
});