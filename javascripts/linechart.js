var _, lineChart;
_ = require("prelude-ls");
lineChart = function(){
  var chrt, build, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 40,
    left: 40,
    right: 40,
    bottom: 40
  };
  chrt.w = 400 - chrt.margin.left - chrt.margin.right;
  chrt.h = 400 - chrt.margin.top - chrt.margin.bottom;
  chrt.duration = 2000;
  chrt.numberFormat = null;
  chrt.color = '#41afa5';
  chrt.strokeWidth = "3px";
  build = function(){
    var svg, extent, max, scaleX, scaleY, path, line, track, circle, translateAlong, addNumber, xAxis;
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    svg = d3.select(chrt.container).insert("svg", "span").attr({
      "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
      "width": "100%",
      "height": "100%",
      "preserveAspectRatio": "xMinYMin meet"
    }).append("g").attr({
      "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
    });
    extent = function(it){
      return d3.extent(it);
    }(
    _.flatten(
    _.map(function(row){
      return d3.extent(row, function(it){
        return it.key;
      });
    })(
    chrt.data)));
    max = function(it){
      return d3.max(it);
    }(
    _.flatten(
    _.map(function(row){
      return d3.max(row, function(it){
        return it.value;
      });
    })(
    chrt.data)));
    scaleX = d3.scale.linear().domain(extent).range([0, chrt.w]);
    scaleY = d3.scale.linear().domain([0, max]).range([chrt.h, 0]);
    path = d3.svg.line().x(function(it){
      return scaleX(
      it.key);
    }).y(function(it){
      return scaleY(
      it.value);
    });
    line = svg.selectAll(".line").data(chrt.data);
    line.enter().append("path").attr({
      "class": "line"
    });
    line.attr({
      "d": path
    }).style({
      "stroke": chrt.color,
      "stroke-width": chrt.strokeWidth,
      "fill": "none",
      "stroke-dasharray": function(){
        var l;
        l = d3.select(this).node().getTotalLength();
        return l + " " + l;
      },
      "stroke-dashoffset": function(){
        return d3.select(this).node().getTotalLength();
      }
    }).transition().duration(chrt.duration).style({
      "stroke-dashoffset": 0
    });
    track = line.attr({
      "d": path
    }).style({
      "fill": "none"
    });
    svg.selectAll(".blank").data(_.map(function(it){
      return _.head(
      it);
    })(
    chrt.data)).enter().append("circle").attr({
      "cx": function(it){
        return scaleX(
        it.key);
      },
      "cy": function(it){
        return scaleY(
        it.value);
      },
      "r": 5
    }).style({
      "fill": "white",
      "stroke": chrt.color,
      "stroke-width": chrt.strokeWidth
    });
    circle = svg.selectAll(".head").data(_.map(function(it){
      return _.head(
      it);
    })(
    chrt.data)).enter().append("circle").attr({
      "cx": 0,
      "cy": 0,
      "r": 5
    }).style({
      "fill": "white",
      "stroke": chrt.color,
      "stroke-width": chrt.strokeWidth
    });
    translateAlong = function(path){
      var l;
      l = path.getTotalLength();
      return function(d, i, a){
        return function(t){
          var p;
          p = path.getPointAtLength(t * l);
          return "translate(" + p.x + "," + p.y + ")";
        };
      };
    };
    circle.transition().duration(chrt.duration).attrTween("transform", translateAlong(
    track.node())).each("end", function(){
      return addNumber();
    });
    addNumber = function(){
      return svg.selectAll(".number").data(_.flatten(
      _.map(function(it){
        return [_.head(it), _.last(it)];
      })(
      chrt.data))).enter().append("text").text(function(it){
        if (chrt.numberFormat === null) {
          return it.value;
        } else {
          return chrt.numberFormat(
          it.value);
        }
      }).attr({
        "class": "number",
        "x": function(it){
          return scaleX(
          it.key);
        },
        "y": function(it){
          return scaleY(
          it.value) - 20;
        }
      }).style({
        "text-anchor": "middle",
        "opacity": 0
      }).transition().style({
        "opacity": 1
      });
    };
    xAxis = d3.svg.axis().scale(scaleX).tickValues(extent).tickFormat(d3.format("d")).orient("bottom");
    return svg.append("g").call(xAxis).attr({
      "transform": "translate(0," + chrt.h + ")",
      "class": "axis"
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