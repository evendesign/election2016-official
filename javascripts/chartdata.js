$( document ).ready(function() {
  if ( $('.old-people-chart').length != 0 ) {
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

    margin_adj = {
      top: 48,
      left: 100,
      right: 100,
      bottom: 36
    };

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

    margin_adj = {
      top: 48,
      left: 100,
      right: 100,
      bottom: 36
    };

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

  if ( $('.hakka-speak-chart').length != 0 ) {
    childrenPercent = _.map(function(it){
      return {
        "languageText": "客家人的下一代",
        "identity": it <= 57
          ? "子女認為自己是客家人 57%"
          : it <= 57 + 8 ? "不知道 8%" : "子女認為自己不是客家人 35%",
        "language": it <= 50 ? "子女不會講客家語 50%" : "子女會講客家語 50%",
        "value": 1,
        "color": colorbrewer["BuGn"][9][~~(Math.random() * 7 + 2)]
      };
    })(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
    forceChildren = forceChart().container('.hakka-speak-chart').data(childrenPercent).labelYOffset(150).isCollide(false);
    forceChildren();
    childrenPercent = _.map(function(it){
      return {
        "languageText": "客家人客語使用狀況",
        "language": it <= 47
          ? "會說流利的客語 47%"
          : it <= 47 + 13 ? "普通 13%" : "客語不流利/不會說 40%",
        "willingness": it <= 76
          ? "有意願讓子女學習客語 76%"
          : it <= 76 + 16 ? "沒有意願讓子女學習客語 16%" : "未回答 8%",
        "value": 1,
        "color": colorbrewer["YlGn"][9][~~(Math.random() * 7 + 2)]
      };
    })(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
    forceLanguage = forceChart().container('.hakka-learn-chart').data(childrenPercent).labelYOffset(150).isCollide(false);
    forceLanguage();
    forceLanguage.draw("languageText"), forceChildren.draw("languageText");
    setInterval(function(){
      forceLanguage.draw("language"),forceChildren.draw("identity");
      force1Cut3time = setTimeout(function(){
        forceLanguage.draw("willingness"),forceChildren.draw("language");
        return clearTimeout(force1Cut3time);
      }, 4000);
    }, 4000);
  }

  if ( $('.world-best-food-culinary-journeys-chart').length != 0 ) {
    var interData, margin, colorFunc, firstBar2;
    interData = [
      {
        "key": "台灣",
        "value": 8242
      }, {
        "key": "菲律賓",
        "value": 1528
      }, {
        "key": "義大利",
        "value": 810
      }, {
        "key": "泰國",
        "value": 470
      }, {
        "key": "日本",
        "value": 443
      }, {
        "key": "馬來西亞",
        "value": 265
      }, {
        "key": "香港",
        "value": 236
      }, {
        "key": "印度",
        "value": 205
      }, {
        "key": "希臘",
        "value": 167
      }, {
        "key": "越南",
        "value": 162
      }
    ];
    margin = {
      top: 10,
      left: 120,
      right: 50,
      bottom: 20
    };
    colorFunc = function(it){
      return it.style({
        "fill": 'url(#themeGradient)'
      });
    };
    firstBar = barChart().data(interData).container('.world-best-food-culinary-journeys-chart').margin(margin).barHeight(25).barStyle(colorFunc);
    firstBar();
    function food_culinary_journeys_chart_chart_animation() {
      var waypoint = new Waypoint({
        element: $('.world-best-food-culinary-journeys-chart'),
        handler: function(direction) {
          firstBar.draw();
          this.destroy();
        },
        offset: '90%'
      })
    }
    food_culinary_journeys_chart_chart_animation();
  }

  if ( $('.medical-source-chart').length != 0 ) {
    d3.tsv("./source.tsv", function(err, data){
      var columns, ratio, drawRatio;
      columns = _.filter(function(it){
        return it !== "年度";
      })(
      _.keys(
      data[0]));
      ratio = _.sortBy(function(it){
        var pri;
        pri = ["家庭"];
        return pri.indexOf(it[0]["label"]);
      })(
      _.map(function(c){
        return _.sortBy(function(it){
          return it.key;
        })(
        _.map(function(it){
          return {
            "key": new Date(it["年度"], 1, 1),
            "value": +it[c],
            "label": c
          };
        })(
        data));
      })(
      columns));
      drawRatio = lineChart().data(ratio).container('.medical-source-chart').w(960).xGridNumber(13).strokeWidth(4).numberFormat(function(it){
        var label;
        label = _.isType('Array', it)
          ? it[0]["label"]
          : it["label"];
        return label + " " + it.value.toFixed(0) + "%";
      }).tickValues([new Date(1996, 1, 1), new Date(2013, 1, 1)]);
      drawRatio();
      function medical_source_chart_animation() {
        var waypoint = new Waypoint({
          element: $('.medical-source-chart'),
          handler: function(direction) {
            drawRatio.draw();
            this.destroy();
          },
          offset: '120%'
        })
      }
      medical_source_chart_animation();
    });
  }


  if ( $('.medical-dispute-chart').length != 0 ) {
    d3.tsv("./dispute.tsv", function(err, data){
      var columns, ratio, drawRatio;
      columns = _.filter(function(it){
        return it !== "year";
      })(
      _.keys(
      data[0]));
      ratio = _.sortBy(function(it){
        var pri;
        pri = ["件數"];
        return pri.indexOf(it[0]["label"]);
      })(
      _.map(function(c){
        return _.sortBy(function(it){
          return it.key;
        })(
        _.map(function(it){
          return {
            "key": new Date(it["year"], 1, 1),
            "value": +it[c],
            "label": c
          };
        })(
        data));
      })(
      columns));
      drawRatio = lineChart().data(ratio).container('.medical-dispute-chart').w(960).xGridNumber(13).strokeWidth(4).numberFormat(function(it){
        return "醫療鑑定" + it.value + " 件";
      }).tickValues([new Date(1987, 1, 1), new Date(2011, 1, 1)]);
      drawRatio();
      function medical_dispute_chart_animation() {
        var waypoint = new Waypoint({
          element: $('.medical-dispute-chart'),
          handler: function(direction) {
            drawRatio.draw();
            this.destroy();
          },
          offset: '120%'
        })
      }
      medical_dispute_chart_animation();
    });
  }

});
