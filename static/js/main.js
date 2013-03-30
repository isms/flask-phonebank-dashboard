/*
 * Main d3.js control, adapted from Ollie Glaskovik's repo:
 *    https://github.com/ollieglass/pusher-d3-demo
*/

var NUMBER_OF_BARS = 15;
var WIDTH = 20
var HEIGHT = 40;

var t = 0; // start time (seconds since epoch)

// starting data sets
var data = [];
var data = d3.range(NUMBER_OF_BARS).map(function() {
  return { time: t, value: 0 };
});
var data2 = [];
var data2 = d3.range(NUMBER_OF_BARS).map(function() {
  return { time: t, value: 0 };
});

// globals
var calls = 0;
var signups = 0;

// ====================================
// d3 - static
// ====================================

var w = WIDTH;   // rect width - same for both charts
var h = HEIGHT;  // chart height - same for both charts

// set up calls chart
var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

var y = d3.scale.linear()
    .domain([0, 50])
    .rangeRound([0, h]);

var chart = d3.select("div#chart1").append("svg")
    .attr("class", "chart")
    .attr("width", w * data.length - 1)
    .attr("height", h);

chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d, i) { return x(i) - .5; })
    .attr("y", function(d) { return h - y(d.value) - .5; })
    .attr("width", w)
    .attr("height", function(d) { return y(d.value); });

chart.append("line")
    .attr("x1", 0)
    .attr("x2", w * data.length)
    .attr("y1", h - .5)
    .attr("y2", h - .5)
    .style("stroke", "#000");

// set up signups charts
var x2 = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

var y2 = d3.scale.linear()
    .domain([0, 5])
    .rangeRound([0, h]);

var chart2 = d3.select("div#chart2").append("svg")
    .attr("class", "chart2")
    .attr("width", w * data2.length - 1)
    .attr("height", h);

chart2.selectAll("rect")
    .data(data2)
    .enter().append("rect")
    .attr("x", function(d, i) { return x2(i) - .5; })
    .attr("y", function(d) { return h - y2(d.value) - .5; })
    .attr("width", w)
    .attr("height", function(d) { return y2(d.value); });

chart2.append("line")
    .attr("x1", 0)
    .attr("x2", w * data2.length)
    .attr("y1", h - .5)
    .attr("y2", h - .5)
    .style("stroke", "#000");

// ====================================
// d3 - update the chart
// ====================================

function update(counts) {
  var new_calls = counts['calls'];
  var new_signups = counts['signups'];
  // update chart with diffs, new activity since last update
  updateData(new_calls - calls, new_signups - signups);
  // update globals to new numbers
  calls = new_calls;
  signups = new_signups;
  // change text
  $('#count1').text(calls);
  $('#count2').text(signups);
};

function updateData(calls, signups) {
  t = t+1

  // update calls chart
  var result1 = { time: t, value: calls };
  data.shift();
  data.push(result1);

  // update signups chart
  var result2 = { time: t, value: signups };
  data2.shift();
  data2.push(result2);

  redraw();
}

function redraw() {
  // redraw calls chart
  var rect = chart.selectAll("rect")
      .data(data, function(d) { return d.time; });

  rect.enter().insert("rect", "line")
      .attr("x", function(d, i) { return x(i + 1) - .5; })
      .attr("y", function(d) { return h - y(d.value) - .5; })
      .attr("width", w)
      .attr("height", function(d) { return y(d.value); })
      .transition()
      .duration(800)
      .attr("x", function(d, i) { return x(i) - .5; });

  rect.transition()
      .duration(800)
      .attr("x", function(d, i) { return x(i) - .5; })
      .attr("y", function(d) { return h - y(d.value) - .5; })
      .attr("height", function(d) { return y(d.value); });

  rect.exit().transition()
      .duration(800)
      .attr("x", function(d, i) { return x(i - 1) - .5; })
      .remove();

  // redraw signups chart
  var rect2 = chart2.selectAll("rect")
      .data(data2, function(d) { return d.time; });

  rect2.enter().insert("rect", "line")
      .attr("x", function(d, i) { return x2(i + 1) - .5; })
      .attr("y", function(d) { return h - y2(d.value) - .5; })
      .attr("width", w)
      .attr("height", function(d) { return y2(d.value); })
      .transition()
      .duration(800)
      .attr("x", function(d, i) { return x2(i) - .5; });

  rect2.transition()
      .duration(800)
      .attr("x", function(d, i) { return x2(i) - .5; })
      .attr("y", function(d) { return h - y2(d.value) - .5; })
      .attr("height", function(d) { return y2(d.value); });

  rect2.exit().transition()
      .duration(800)
      .attr("x", function(d, i) { return x2(i - 1) - .5; })
      .remove();
}