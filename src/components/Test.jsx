import React, { Component } from "react";
import * as d3 from "d3";

export class test extends Component {
  createGraph() {
    var svg = d3.select("#placeholder").append("svg");
    svg.attr("width", 250);
    svg.attr("height", 250);

    var rect = svg.append("rect");

    rect.attr("x", 50);
    rect.attr("y", 50);
    rect.attr("width", 20);
    rect.attr("height", 20);
  }

  createGraph2() {
    var data = this.props.proba;
    var scale = d3
      .scaleLinear()
      .domain([0, 1]) // Data space
      .range([0, 200]); // Pixel space

    var svg = d3
      .select("#placeholder")
      .append("svg")
      .attr("width", 250)
      .attr("height", 250);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        console.log(scale(d));
        return scale(d);
      })
      .attr("y", 50)
      .attr("width", 20)
      .attr("height", 20);
  }

  graph3() {
    var scale = d3
      .scaleLinear()
      .domain([1, 5]) // Data space
      .range([0, 200]); // Pixel space

    var svg = d3
      .select("#placeholder")
      .append("svg")
      .attr("width", 250)
      .attr("height", 250);

    function render(data, color) {
      // Bind data
      var rects = svg.selectAll("rect").data(data);

      // Enter
      rects
        .enter()
        .append("rect")
        .attr("y", 50)
        .attr("width", 20)
        .attr("height", 20);

      // Update
      rects.attr("x", scale).attr("fill", color);
    }

    render([1, 2, 2.5], "red");
    render([1, 2, 3, 4, 5], "blue");
  }

  graph4() {
    var scale = d3
      .scaleLinear()
      .domain([1, 5]) // Data space
      .range([0, 200]); // Pixel space

    var svg = d3
      .select("#placeholder")
      .append("svg")
      .attr("width", 250)
      .attr("height", 250);

    function render(data, color) {
      // Bind data
      var rects = svg.selectAll("rect").data(data);

      // Enter
      rects
        .enter()
        .append("rect")
        .attr("x", scale)
        .attr("y", 50)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color);

      // Update
      rects
        .attr("x", function(d) {
          console.log(scale(d));
          return scale(d);
        })
        .attr("fill", color);
      console.log(rects);

      // Exit
      rects.exit().remove();
    }

    setTimeout(function() {
      render([1, 2, 2.5], "red");
    }, 1000);
    setTimeout(function() {
      render([1, 2, 3, 4, 5], "blue");
    }, 2000);
    setTimeout(function() {
      render([1, 2], "green");
    }, 3000);
    setTimeout(function() {
      render([3, 4, 5], "cyan");
    }, 4000);
    setTimeout(function() {
      render([4, 5], "magenta");
    }, 5000);
  }

  graph5() {
    var outerWidth = 500;
    var outerHeight = 250;
    var margin = { left: 90, top: 30, right: 30, bottom: 30 };
    var barPadding = 0.2;

    var xColumn = "name";
    var yColumn = "population";

    var innerWidth = outerWidth - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top - margin.bottom;

    var svg = d3
      .select("#placeholder")
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight);
    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var xScale = d3.scaleOrdinal().rangeBands([0, innerWidth], barPadding);
    var xScale = d3
      .scaleBand()
      .domain([0, innerWidth])
      .range([0, innerWidth])
      .padding(barPadding);
    var yScale = d3.scaleLinear().range([innerHeight, 0]);

    function renderPlot(data) {
      console.log(data);
      xScale.bandwidth(
        data.map(function(d) {
          return d[xColumn];
        })
      );
      yScale.domain([
        0,
        d3.max(data, function(d) {
          return d[yColumn];
        })
      ]);

      var bars = g.selectAll("rect").data(data);
      bars
        .enter()
        .append("rect")
        .attr("width", xScale.rangeBand());
      bars
        .attr("x", function(d) {
          return xScale(d[xColumn]);
        })
        .attr("y", function(d) {
          return yScale(d[yColumn]);
        })
        .attr("height", function(d) {
          return innerHeight - yScale(d[yColumn]);
        });
      bars.exit().remove();
    }
    const data = {
      name: ["Shanghai", "Buenos Aires", "Mumbai"],
      population: [22315474, 13076300, 12691836]
    };
    renderPlot(data);
  }

  componentDidMount() {
    this.graph5();
  }
  componentDidUpdate() {}
  render() {
    return <div id="placeholder" className="container"></div>;
  }
}

export default test;
