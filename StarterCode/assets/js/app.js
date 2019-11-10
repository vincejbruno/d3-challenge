// @TODO: YOUR CODE HERE!

  //set svg dimensions
  var svgWidth = 750;
  var svgHeight = 500;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Load in the csv and print to the console
  d3.csv("./data.csv").then(function(data) {
    console.log(data);

    //Parse columns needed into integers
    data.forEach(function(povertyData) {
      povertyData.poverty = +povertyData.poverty;
      povertyData.healthcare = +povertyData.healthcare;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(data, d => d.poverty + 2)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([3, d3.max(data, d => d.healthcare + 2)])
      .range([height, 0]);  

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);    

    // Append Data to chartGroup
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "lightblue")
    .attr("stroke-width", "1")
    .attr("stroke", "white")
    .style("opacity", 2.0);

    //add our state abbreviations to the charts
    var circleLabels = chartGroup.selectAll(null)
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(function(d) { return d.abbr; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "8px")
    .attr("fill", "white")
    .attr("text-anchor", "middle");

    //add axis labels
    var yLabels = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)")
    .attr("font-weight",function(d,i) {return i*100+500;});

    var xLabels = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 40})`)
    .attr("class", "axisText")
    .text("Poverty (%)")
    .attr("font-weight",function(d,i) {return i*100+500;});

  });