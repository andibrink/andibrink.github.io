let keyframes = [
  {
      activeVerse: 1,
      activeLines: [1, 2, 3, 4, 5],
  },
  {
      activeVerse: 2,
      activeLines: [1, 2, 3, 4, 5],
  },
  {
      activeVerse: 3,
      activeLines: [1],
      year: 2002
  },
  {
      activeVerse: 3,
      activeLines: [2],
      year: 2003
  },
  {
      activeVerse: 3,
      activeLines: [3],
      year: 2004
  },
  {
      activeVerse: 3,
      activeLines: [4],
      year: 2005
  },
  {
      activeVerse: 3,
      activeLines: [5],
      year: 2006
  },
  {
      activeVerse: 4,
      activeLines: [1],
      year: 2007
  },
  {
      activeVerse: 4,
      activeLines: [2],
      year: 2008
  },
  {
      activeVerse: 4,
      activeLines: [3],
      year: 2009
  },
  {
      activeVerse: 4,
      activeLines: [4],
      year: 2010
  },
  {
      activeVerse: 4,
      activeLines: [5],
      year: 2011
  },
  {
      activeVerse: 5,
      activeLines: [1],
      year: 2012
  },
  {
      activeVerse: 5,
      activeLines: [2],
      year: 2013
  },
  {
      activeVerse: 5,
      activeLines: [3],
      year: 2014
  },
  {
      activeVerse: 5,
      activeLines: [4],
      year: 2015
  },
  {
      activeVerse: 5,
      activeLines: [5],
      year: 2016
  },
   {
      activeVerse: 6,
      activeLines: [1, 2, 3, 4, 5],
      year: 2017
  }
]


const height = 300;
const width = 500;
const margin = {top: 50, right: 20, bottom: 30, left: 30};
let chartData;

let chart;
let chartWidth;
let chartHeight;

let xScale = d3.scaleTime().range([0, width]);
let yScale = d3.scaleLinear().range([height, 0]);

let valueline = d3.line()
.x(function (d) { return xScale(d.date); })
.y(function (d) { return yScale(d.close); });

let svg = d3.select("#svg");
let keyframeIndex = 0;
let year=2000;

function drawKeyframe(kfi) {
console.log("Drawing keyframe:", kfi);

let kf = keyframes[kfi];

resetActiveLines();

updateActiveVerse(kf.activeVerse);

for(line of kf.activeLines){
  updateActiveLine(kf.activeVerse, line);
}

if(kf.svgUpdate){

  kf.svgUpdate();
}
}

async function loadData(){
await d3.csv("data.csv").then(data => {
  const parseTime = d3.timeParse("%d-%b-%y");

    data.forEach(d => {
      d.date = parseTime(d.date);
      d.close = +d.close;
    });

    chartData = data;
})
}

function updateGraph(data, year) {

   const filteredData = data.filter(d => new Date(d.date).getFullYear() <= year);

   xScale.domain(d3.extent(filteredData, d => new Date(d.date)));
   yScale.domain([0, d3.max(filteredData, d => d.close)]);
 
   // Update the x-axis
   svg.select(".x-axis")
     .transition()
     .duration(1000)
     .call(d3.axisBottom(xScale));
 
   svg.select(".y-axis")
     .transition()
     .duration(1000)
     .call(d3.axisLeft(yScale));

   svg.select(".line")
    .data([filteredData])
    .transition()
    .delay(200)
    .duration(800)
    .attr("d", valueline);

   svg.select(".y-axis")
    .selectAll("text")
    .attr("dx", "-0.5em")
    .attr("dy", "0.25em")
    .style("text-anchor", "end");

   const newZoomExtent = [
    [0, 0],
    [xScale.range()[1], yScale.range()[0]]
    ];

  const newZoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [width, 0]]) // Restrict movement along the y-axis
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);


  svg.select("rect")
  .attr("class", "zoom-rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all") 
  .call(newZoom);
  
  svg.call(newZoom);

  function zoomed(event) {
    const newXScale = event.transform.rescaleX(xScale);

    svg.select(".x-axis").call(d3.axisBottom(newXScale));

    svg.select(".line").attr("d", valueline.x(d => newXScale(d.date)));

    xScale = newXScale;
  }

}

function forwardClicked() {
if (keyframeIndex < keyframes.length - 1) {
keyframeIndex++;
if(year<2018){
  year++;
  updateGraph(chartData, year);
}
drawKeyframe(keyframeIndex);
}
}

function backwardClicked() {
if (keyframeIndex > 0) {
keyframeIndex--;
if(year>2000){
  year--;
  updateGraph(chartData, year);
}
drawKeyframe(keyframeIndex);
}
}

function resetActiveLines() {
d3.selectAll(".line").classed("active-line", false);
}

function updateActiveVerse(id) {
d3.selectAll(".verse").classed("active-verse", false);
d3.select("#verse" + id).classed("active-verse", true);
scrollLeftColumnToActiveVerse(id);
}

function updateActiveLine(vid, lid) {
let thisVerse = d3.select("#verse"+vid);
thisVerse.select("#line" + lid).classed("active-line", true);
}

function scrollLeftColumnToActiveVerse(id) {
var leftColumn = document.querySelector(".left-column-content");
var activeVerse = document.getElementById("verse" + id);
var verseRect = activeVerse.getBoundingClientRect();
var leftColumnRect = leftColumn.getBoundingClientRect();
var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;
leftColumn.scrollTo({
  top: desiredScrollTop,
  behavior: 'smooth'
})
}

document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

function initializeSVG(){
// set the dimensions and margins of the graph
var width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.close); });

svg = d3.select("main").append("svg")
  .attr("width", (700 + margin.left + margin.right))
  .attr("height", (500 + margin.top + margin.bottom+50))
  .append("g")
      .attr("transform","translate(" + (margin.left)+ "," + (margin.top) + ")");

d3.csv("data.csv").then(function(data) {
  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  svg.append("g")
      .attr("class","x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));
      
});


svg.append("text")
.attr("x", (width / 2))             
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")  
.style("font-size", "20px")   
.style('fill', '#540b0e')
.text("Daily Bird Deaths at McCormick Place, Chicago IL");

svg.append("text")      // text label for the x axis
  .attr("x", (width+1) )
  .attr("y", (height-5) )
  .style("text-anchor", "end")
  .style("font-size", "15px")   
  .style('fill', '#540b0e')
  .text("Date");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y",14)
  .style("font-size", "15px")   
  .style('fill', '#540b0e')
  .style("text-anchor", "end")
  .text("Bird Deaths");

const zoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [width, 0]]) // Restrict movement along the y-axis
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

svg.append("rect")
  .attr("class", "zoom-rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .call(zoom);


svg.call(zoom);

function zoomed(event) {
  const newXScale = event.transform.rescaleX(x);

  svg.select(".x-axis").call(d3.axisBottom(newXScale));

  svg.select(".line").attr("d", valueline.x(d => newXScale(d.date)));

  xScale = newXScale;
}
}

async function initialize() {
await loadData();
initializeSVG();
drawKeyframe(keyframeIndex);
}

initialize();
