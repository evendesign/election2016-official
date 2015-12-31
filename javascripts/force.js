var _, forceChart, cleanPunc, cleanName, parseData;
_ = require("prelude-ls");
forceChart = function(){
  var chrt, updateModel, build, buildOrder, buildGrid, groupData, ifNaN, buildGridOrder, addPosition, i$;
  chrt = {};
  chrt.container = null;
  chrt.data = null;
  chrt.margin = {
    top: 10,
    left: 10,
    right: 20,
    bottom: 20
  };
  chrt.w = 800 - chrt.margin.left - chrt.margin.right;
  chrt.h = 400 - chrt.margin.top - chrt.margin.bottom;
  chrt.svg = null;
  chrt.dtsr = 10;
  chrt.selector = 'cdots';
  chrt.grpLength = null;
  chrt.grpColLength = null;
  chrt.grpEntry = null;
  chrt.labelYOffset = 30;
  chrt.isCollide = true;
  chrt.isGooeye = false;
  updateModel = undefined;
  build = function(){
    var svgContainer, defs, g;
    if (chrt.data === null || chrt.container === null) {
      return;
    }
    if (chrt.svg === null) {
      svgContainer = d3.select(chrt.container).append("svg").attr({
        "viewBox": "0 0 " + (chrt.w + chrt.margin.left + chrt.margin.right) + " " + (chrt.h + chrt.margin.top + chrt.margin.bottom),
        "width": "100%",
        "height": "100%",
        "preserveAspectRatio": "xMinYMin meet"
      });
      defs = svgContainer.append("defs").append("filter").attr({
        "id": "gooeying"
      });
      defs.append("feGaussianBlur").attr({
        "in": "SourceGraphic",
        "stdDeviation": "5",
        "result": "blur"
      });
      defs.append("feColorMatrix").attr({
        "in": "blur",
        "mode": "matrix",
        "values": "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7",
        "result": "gooeying"
      });
      defs.append("feComposite").attr({
        "in": "SourceGraphic",
        "in2": "gooeying",
        "operator": "atop"
      });
      g = svgContainer.append("g").attr({
        "transform": "translate(" + chrt.margin.left + "," + chrt.margin.top + ")"
      });
      chrt.svg = g.append("g");
      if (chrt.isGooeye) {
        return chrt.svg.style({
          "filter": 'url(#gooeying)'
        });
      }
    }
  };
  buildOrder = function(data){
    var list;
    if (data.length === 0) {
      return console.log("not data to build order");
    } else {
      list = _.map(function(it){
        return it.key;
      })(
      _.sortBy(function(it){
        return it.value * -1;
      })(
      data));
      return function(key){
        return list.indexOf(
        key + "");
      };
    }
  };
  buildGrid = function(w, h, dataLength, xLength){
    var getHeight, xDomain, res$, i$, to$, ridx$, yDomain, padding, xScale, yScale, grid;
    if (!xLength) {
      xLength = 5;
    }
    getHeight = function(i){
      return Math.floor(
      i / xLength);
    };
    res$ = [];
    for (i$ = 0, to$ = Math.min(xLength, dataLength) - 1; i$ <= to$; ++i$) {
      ridx$ = i$;
      res$.push(ridx$);
    }
    xDomain = res$;
    res$ = [];
    for (i$ = 0, to$ = getHeight(
    dataLength - 1); i$ <= to$; ++i$) {
      ridx$ = i$;
      res$.push(ridx$);
    }
    yDomain = res$;
    padding = 1;
    xScale = d3.scale.ordinal().domain(xDomain).rangeRoundPoints([0, w], padding);
    yScale = d3.scale.ordinal().domain(yDomain).rangeRoundPoints([0, h], padding);
    return grid = function(i){
      return {
        "x": xScale(
        i % xLength),
        "y": yScale(
        getHeight(
        i))
      };
    };
  };
  groupData = function(data, groupFunc){
    return _.map(function(it){
      it.value = _.fold1(curry$(function(x$, y$){
        return x$ + y$;
      }))(
      _.map(function(it){
        return it.value;
      })(
      it.value));
      return it;
    })(
    d3.entries(
    _.groupBy(groupFunc)(
    data)));
  };
  ifNaN = function(it){
    if (isNaN(it)) {
      return 0;
    } else {
      return it;
    }
  };
  buildGridOrder = function(data, group){
    var groups, grid, order, gridOrder;
    groups = groupData(data, function(it){
      return it[group];
    });
    grid = buildGrid(chrt.w, chrt.h, groups.length);
    order = buildOrder(groups);
    return gridOrder = function(it){
      return {
        "x": function(it){
          return it.x;
        }(
        grid(
        order(
        it))),
        "y": function(it){
          return it.y;
        }(
        grid(
        order(
        it)))
      };
    };
  };
  addPosition = function(data, group){
    var gridOrder;
    gridOrder = buildGridOrder(data, group);
    return _.map(function(it){
      it.target = {};
      it.target.x = function(it){
        return it.x;
      }(
      gridOrder(
      it[group]));
      it.target.y = function(it){
        return it.y;
      }(
      gridOrder(
      it[group]));
      return it;
    })(
    data);
  };
  build.draw = function(group){
    var augmentData, collide, tick, forceLayout, node, label, gridOrder;
    augmentData = _.map(function(it){
      it.r = chrt.dtsr;
      return it;
    })(
    addPosition(chrt.data, group));
    collide = function(it){
      var margin, r, nx1, nx2, ny1, ny2;
      margin = 0;
      r = it.r;
      nx1 = it.x - r;
      nx2 = it.x + r;
      ny1 = it.y - r;
      ny2 = it.y + r;
      return function(quad, x1, y1, x2, y2){
        var x, y, l, r;
        if (quad.point && quad.point !== it) {
          x = it.x - quad.point.x;
          y = it.y - quad.point.y;
          l = Math.sqrt(x * x + y * y);
          r = it.r + quad.point.r + margin;
          if (l < r) {
            l = (l - r) / l * 0.5;
            it.x -= x *= l;
            it.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    };
    tick = function(it){
      var k, q, i, n;
      k = 0.1 * it.alpha;
      augmentData.forEach(function(o, i){
        o.y += (o.target.y - o.y) * k;
        return o.x += (o.target.x - o.x) * k;
      });
      if (chrt.isCollide) {
        q = d3.geom.quadtree(augmentData);
        i = 0;
        n = augmentData.length;
        while (++i < n) {
          q.visit(collide(augmentData[i]));
        }
      }
      return node.attr({
        "cx": function(it){
          return ifNaN(it.x);
        },
        "cy": function(it){
          return ifNaN(it.y);
        }
      });
    };
    forceLayout = d3.layout.force().nodes(augmentData).links([]).gravity(0).charge(-15).friction(0.7).size([chrt.w, chrt.h]).on("tick", tick);
    node = chrt.svg.selectAll("." + chrt.selector).data(augmentData);
    node.enter().append("circle").attr({
      "class": function(it, i){
        return chrt.selector;
      },
      "r": 0
    }).style({
      "fill": function(it){
        return it.color;
      }
    });
    node.attr({
      "r": function(it){
        return it.r;
      }
    }).call(forceLayout.drag);
    node.exit().transition().attr({
      "r": 0
    }).remove();
    forceLayout.start();
    label = chrt.svg.selectAll(".grp" + chrt.selector).data(groupData(augmentData, function(it){
      return it[group];
    }), function(it){
      return it.key;
    });
    label.exit().remove();
    gridOrder = buildGridOrder(augmentData, group);
    return label.enter().append("text").attr({
      "x": function(it){
        return function(it){
          return it.x;
        }(
        gridOrder(
        it.key));
      },
      "y": function(it){
        return function(it){
          return it.y + chrt.labelYOffset;
        }(
        gridOrder(
        it.key));
      },
      "class": function(it){
        return "grp" + chrt.selector + " grp" + it;
      }
    }).style({
      "text-anchor": "middle",
      "fill": "rgb(255, 255, 255)",
    }).text(function(it){
      if (it.key === "undefined") {
        return "all";
      } else {
        return it.key;
      }
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
cleanPunc = function(str){
  return str.replace(/-/g, " ").replace(/\//g, " ").replace(/\(/g, "").replace(/\)/g, "").replace(/&/g, "").replace(/[1]/g, " ").replace(/  /g, " ").replace(/   /g, " ").trim().toLowerCase();
};
cleanName = function(str){
  return str.replace(/,/g, "").replace(/"/g, "").replace(/\./g, "").replace(/'/g, "").replace(/-/g, "").replace(/ /g, "").toLowerCase();
};
parseData = function(tsvData){
  var rslt;
  rslt = [];
  tsvData.filter(function(it){
    it.name = cleanPunc(
    it.name);
    _.map(function(t){
      return rslt.push({
        "name": cleanPunc(
        it.name),
        "color": it.color,
        "tag": t
      });
    })(
    it.name.split(" "));
    return true;
  });
  return rslt;
};
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}