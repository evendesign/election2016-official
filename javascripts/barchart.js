var _, barChart;
_ = require("prelude-ls");
barChart = function(){
  var chrt, gradientData, build, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 10,
    left: 80,
    right: 50,
    bottom: 20
  };
  chrt.w = 500 - chrt.margin.left - chrt.margin.right;
  chrt.h = null;
  chrt.barHeight = 25;
  chrt.barMargin = 5;
  chrt.duration = 2000;
  chrt.delay = 200;
  gradientData = [
    {
      "offset": "0%",
      "color": "rgb(80, 180, 115)"
    }, {
      "offset": "100%",
      "color": "rgb(80, 180, 115)"
    }
  ];
  build = function(){
    var svg, scaleX, scaleY, bars;
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    chrt.h = chrt.data.length * chrt.barHeight + (chrt.data.length - 1) * chrt.barMargin;
    svg = d3.select(chrt.container).insert("svg", "span").attr({
      "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
      "width": "100%",
      "height": "100%",
      "preserveAspectRatio": "xMinYMin meet"
    }).append("g").attr({
      "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
    });
    scaleX = d3.scale.linear().domain([
      0, d3.max(chrt.data, function(it){
        return it.value;
      })
    ]).range([0, chrt.w]);
    scaleY = function(i){
      return i * (chrt.barHeight + chrt.barMargin);
    };
    svg.append("linearGradient").attr({
      "id": "themeGradient",
      "gradientUnits": "userSpaceOnUse",
      "x1": 0,
      "x2": chrt.w,
      "y1": 0,
      "y2": 0
    }).selectAll("stop").data(gradientData).enter().append("stop").attr({
      "offset": function(it){
        return it.offset;
      },
      "stop-color": function(it){
        return it.color;
      }
    });
    bars = svg.selectAll(".bars").data(chrt.data);
    bars.enter().append("rect").attr({
      "width": 0,
      "class": "bars"
    });
    bars.transition().duration(chrt.duration).delay(function(it, i){
      return i * chrt.delay;
    }).attr({
      "width": function(it){
        return scaleX(
        it.value);
      },
      "height": function(){
        return chrt.barHeight;
      },
      "x": 0,
      "y": function(it, i){
        return scaleY(i);
      }
    }).style({
      "fill": 'url(#themeGradient)'
    });
    svg.selectAll(".name").data(chrt.data).enter().append("text").attr({
      "x": -30,
      "y": function(it, i){
        return scaleY(i) + chrt.barHeight / 2 + 7;
      },
      "class": "name"
    }).style({
      "text-anchor": "end"
    }).text(function(it){
      return it.key;
    });
    return svg.selectAll(".number").data(chrt.data).enter().append("text").attr({
      "x": function(it){
        return scaleX(
        it.value) - 5;
      },
      "y": function(it, i){
        return scaleY(i) + chrt.barHeight / 2 + 7;
      },
      "class": "number"
    }).style({
      "text-anchor": "end",
      "fill": "white"
    }).text(function(it){
      return it.value;
    });
  };
  for (i$ in chrt) {
    (fn$.call(this, i$));
  }
  return build;
  function fn$(it){
    build[it] = function(v){
      if (arguments.length === 0) {
        return chrt[it];
      } else {
        chrt[it] = v;
        return build;
      }
    };
  }
};