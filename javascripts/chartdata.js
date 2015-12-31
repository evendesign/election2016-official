var worldOldPeopleData, taiwanOldPeopleData, foodCheckData, worldOldPeopleChart, taiwanOldPeopleChart, margin, defaultColor, peopleHighlightColor;
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
margin_adj = {
  top: 48,
  left: 100,
  right: 100,
  bottom: 36
};
defaultColor = function(it){
  return it.style({
    "fill": 'url(#themeGradient)'
  });
};
peopleHighlightColor = function(it){
  return it.style({
    "fill": function(it){
      if (it.key === "台灣平均") {
        return "orange";
      } else {
        return 'url(#themeGradient)';
      }
    }
  });
};
worldOldPeopleChart = barChart().data(worldOldPeopleData).container('.world-old-people-data').margin(margin).barHeight(36).barStyle(defaultColor);
taiwanOldPeopleChart = barChart().data(taiwanOldPeopleData).container('.taiwan-old-people-data').margin(margin).barHeight(36).barStyle(peopleHighlightColor);

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
    d3.tsv("./gc_linechart_data.tsv", function(err, data){
      var ratio, population, average, thousand, drawRatio, drawAverage, drawPopulation;
      ratio = _.map(function(it){
        return {
          "key": new Date(+it.year, 0, 1),
          "value": +it.ratio
        };
      })(
      data);
      population = _.map(function(it){
        return {
          "key": new Date(+it.year, 0, 1),
          "value": +it.population
        };
      })(
      data);
      average = _.map(function(it){
        return {
          "key": new Date(+it.year, 0, 1),
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
        it.value * 100));
      });
      drawAverage = lineChart().data([average]).container('.people-average-data').numberFormat(function(it){
        return it.value.toFixed(0) + "歲";
      });
      drawPopulation = lineChart().data([population]).container('.people-population-data').numberFormat(function(it){
        return function(it){
          return it + "萬人";
        }(
        thousand(
        Math.round(
        it.value / 10)));
      });
      drawRatio();
      drawAverage();
      drawPopulation();
      function gc_linechart_animation() {
        var waypoint = new Waypoint({
          element: $('.people-pp-chart'),
          handler: function(direction) {
            drawRatio.draw();
            drawAverage.draw();
            drawPopulation.draw();
            this.destroy();
          },
          offset: '90%'
        })
      }
      gc_linechart_animation();
    });
  }

  if ( $('.houseprice-to-income-chart').length != 0 ) {
    d3.tsv("./hp_linechart_data.tsv", function(err, data){
      var columns, ratio, thousand, drawRatio;
      columns = _.filter(function(it){
        return it !== "年度季別";
      })(
      _.keys(
      data[0]));
      ratio = _.sortBy(function(it){
        var pri;
        pri = ["全國", "台北市", "新北市"];
        return pri.indexOf(it[0]["label"]);
      })(
      _.map(function(c){
        return _.sortBy(function(it){
          return it.key;
        })(
        _.map(function(it){
          var d, y, m;
          d = it["年度季別"].split("Q");
          y = (+d[0]) + 1911;
          m = (+d[1]) * 3 - 1;
          return {
            "key": new Date(y, m, 1),
            "value": +it[c],
            "label": c
          };
        })(
        data));
      })(
      columns));
      thousand = d3.format("0,000");
      drawRatio = lineChart().data(ratio).container('.houseprice-to-income-chart').margin(margin_adj).color(function(it, i){
        var label;
        label = _.isType('Array', it)
          ? it[0]["label"]
          : it["label"];
        if (label === "全國" || label === "台北市" || label === "新北市") {
          return "rgba(80, 181, 132,1)";
        } else {
          return "rgba(241,240,117,0.5)";
        }
      }).numberFormat(function(it){
        var label;
        label = _.isType('Array', it)
          ? it[0]["label"]
          : it["label"];
        if (it.key.getFullYear() === 2002) {
          if (label === "全國") {
            return label + " " + it.value.toFixed(0) + " 年 ";
          } else if (label === "台北市") {
            return "雙北 6 年";
          } else {
            return "";
          }
        } else {
          if (label === "全國" || label === "台北市" || label === "新北市") {
            return _.Str.take(2)(
            label) + " " + it.value.toFixed(0) + " 年 ";
          } else {
            return "";
          }
        }
      }).w(960).xGridNumber(13).strokeWidth(4).tickValues([new Date(2002, 2, 1), new Date(2008, 2, 1), new Date(2015, 2, 1)]);
      drawRatio();
      function hp_linechart_animation() {
        var waypoint = new Waypoint({
          element: $('.houseprice-to-income-chart'),
          handler: function(direction) {
            drawRatio.draw();
            this.destroy();
          },
          offset: '90%'
        })
      }
      hp_linechart_animation();
    });
  }

  if ( $('.house-pp-chart').length != 0 ) {
    var emptyHouses, emptyHouseDount, lowUilization, electricHouseDount, selfOwned, selfHouseDount;
    emptyHouses = {
      "value": 0.2,
      "total": 1
    };
    emptyHouseDount = donutChart().data(emptyHouses).container('.empty-house-data').textFunc(function(it){
      return (it * 100).toFixed(0) + "%";
    });
    emptyHouseDount();
    lowUilization = {
      "value": 0.105,
      "total": 1
    };
    electricHouseDount = donutChart().data(lowUilization).container('.electric-house-data').textFunc(function(it){
      return (it * 100).toFixed(0) + "%";
    });
    electricHouseDount();
    selfOwned = {
      "value": 0.88,
      "total": 1
    };
    selfHouseDount = donutChart().data(selfOwned).container('.self-house-data').textFunc(function(it){
      return (it * 100).toFixed(0) + "%";
    });
    selfHouseDount();
    function hp_dountchart_animation() {
      var waypoint = new Waypoint({
        element: $('.house-pp-chart'),
        handler: function(direction) {
          emptyHouseDount.draw();
          electricHouseDount.draw();
          selfHouseDount.draw();
          this.destroy();
        },
        offset: '90%'
      })
    }
    hp_dountchart_animation();
  }

  if ( $('.health-care-spending-chart').length != 0 ) {
    d3.tsv("./healthcare_spending.tsv", function(err, data){
      var spending, thousand, scaleX, drawRatio;
      spending = _.map(function(it){
        return {
          "key": +it["year"],
          "value": +it["avg_spending"]
        };
      })(
      data);
      thousand = d3.format("0,000");
      scaleX = d3.scale.linear().domain([1991, 2013]).range([0, 960]);
      drawRatio = lineChart().data([spending]).container('.health-care-spending-chart').margin(margin_adj).numberFormat(function(it){
        return function(it){
          return it + " 萬元";
        }(
        function(it){
          return it.toFixed(1);
        }(
        it.value / 10000));
      }).w(960).xGridNumber(12).scaleX(scaleX).tickFormat(function(it){
        return it + "";
      });
      null;
      drawRatio();
      function health_spending_linechart_animation() {
        var waypoint = new Waypoint({
          element: $('.health-care-spending-chart'),
          handler: function(direction) {
            drawRatio.draw();
            this.destroy();
          },
          offset: '90%'
        })
      }
      health_spending_linechart_animation();
    });
  }

  if ( $('.sport-15aDay-mortality-chart').length != 0 ) {
    d3.tsv("./reduction.tsv", function(err, data){
      var curve, thousand, scaleX, drawRatio;
      curve = _.map(function(it){
        return {
          "key": +it["minimum"],
          "value": +it["reduction"]
        };
      })(
      data);
      thousand = d3.format("0,000");
      scaleX = d3.scale.linear().domain([15, 90]).range([0, 960]);
      drawRatio = lineChart().data([curve]).container('.sport-15aDay-mortality-chart').margin(margin_adj).numberFormat(function(it){
        return function(it){
          return "死亡率降 " + it + "%";
        }(
        function(it){
          return it.toFixed(0);
        }(
        it.value));
      }).tickValues([15, 30, 45, 60, 75, 90]).w(960).xGridNumber(10).scaleX(scaleX).tickFormat(null);
      drawRatio();
      function sport_mortality_linechart_animation() {
        var waypoint = new Waypoint({
          element: $('.sport-15aDay-mortality-chart'),
          handler: function(direction) {
            drawRatio.draw();
            this.destroy();
          },
          offset: '90%'
        })
      }
      sport_mortality_linechart_animation();
    });
  }

});
