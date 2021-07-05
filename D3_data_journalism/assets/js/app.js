// Set chart area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(CensusData) {
  // Step 1: Parse Data/Cast as numbers
    // ==============================
  CensusData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });
   // Step 2: Create scale functions
    // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(CensusData, d => d.age))
    .range([0, width])
    .nice();

  var yLinearScale = d3.scaleLinear()
    .domain([6, d3.max(CensusData, d => d.smokes)])
    .range([height, 0])
    .nice();
  
  // Step 3: Create axis functions
    // ==============================
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);


// Step 4: Append Axes to the chart
    // ==============================
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
  chartGroup.append("g").call(yAxis);

// Step 5: Create scatter plot
    // ==============================
chartGroup.selectAll("circle")
.data(CensusData)
.enter()
.append("circle")
.attr("cx", d=>xLinearScale(d.age))
.attr("cy", d=>yLinearScale(d.smokes))
.attr("r", "10")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.8);

// Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>State: ${d.age}<br>age: ${d.smokes}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


// Add texts to each point
chartGroup.append("g")
  .selectAll('text')
  .data(CensusData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xLinearScale(d.age))
  .attr("y",d=>yLinearScale(d.smokes))
  .classed(".stateText", true)
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");
  
  // Create axes labels
  chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 13})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("Median Age");

        chartGroup.append("text")
        .attr("y", 0 - ((margin.left / 2) + 2))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Smokers (%)");

}).catch(function(error) {
  console.log(error);
});