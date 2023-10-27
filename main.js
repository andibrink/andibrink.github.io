let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawRoseColors
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawVioletColors
    },
    {
        activeVerse: 3,
        activeLines: [1],
        svgUpdate: drawRoseColors
    },
    {
        activeVerse: 3,
        activeLines: [2],
        svgUpdate: () => highlightColor("Red", "red")//Note the slightly weird syntax here as we want to pass values to the function so we have to use an anonymous function to do this otherwise svgUpdate will just be bound to the result of running that function with those arguments
    },
    {
        activeVerse: 3,
        activeLines: [3],
        svgUpdate: () => highlightColor("White", "white")
    },
    {
        activeVerse: 3,
        activeLines: [4],
        svgUpdate: () => highlightColorMultiple("Red","Pink","White","Yellow","Orange")
    },
    {
        activeVerse: 4,
        activeLines: [1],
        svgUpdate: clickRedBar
    },
    {
        activeVerse: 4,
        activeLines: [2]
    },
    {
        activeVerse: 4,
        activeLines: [3],
        svgUpdate: reorderBars
    },
    {
        activeVerse: 4,
        activeLines: [4]
    },
    {
        activeVerse: 5,
        activeLines: [1],
        svgUpdate: () => {checkPie = true; drawVioletColors();}
    },
    {
        activeVerse: 5,
        activeLines: [2]
    },
    {
        activeVerse: 5,
        activeLines: [3]

    },
    {
        activeVerse: 5,
        activeLines: [4]
    }
]
// TODO add svgUpdate fields to keyframes

// TODO define global variables

const height = 300;
const width = 300;
let clicked = 0;
let checkPie = false;
let roseChartData;
let violetChartData;

// Declare global variables for the chart

// This will hold where the actual section of the graph where visual marks, in our case the bars, are being displayed
// Additionally we'll store the dimensions of this space too
let chart;
let chartWidth;
let chartHeight;

// Declare both scales too
let xScale;
let yScale;

let check = false;
let svg = d3.select("#svg");
let keyframeIndex = 0;

function drawKeyframe(kfi) {
    // TODO get keyframe at index position
    let kf = keyframes[kfi];
    // TODO reset any active lines
    resetActiveLines();
    // TODO update the active verse
    updateActiveVerse(kf.activeVerse);
    // TODO update any active lines
    for(line of kf.activeLines){
        updateActiveLine(kf.activeVerse, line);
    }
    // TODO update the svg
    if(kf.svgUpdate){
        // If there is we call it like this
        kf.svgUpdate();
    }
}


async function loadData(){
    await d3.json("../../assets/data/rose_colors.json").then(data => {
        roseChartData = data;
    })
    await d3.json("../../assets/data/violet_colors.json").then(data => {
        violetChartData = data;
    })
}

// TODO add event listeners to the buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

// TODO write an asynchronous loadData function
// TODO call that in our initalise function

// TODO draw a bar chart from the rose dataset
function drawRoseColors() {
    updateBarChart(roseChartData, "Distribution of Rose Colors");
}

// TODO draw a bar chart from the violet dataset
function drawVioletColors() {
    updateBarChart(violetChartData, "Distribution of Violet Colors");
}

// function drawVioletColorsPie() {
//     newPieChart(violetChartData, "Distribution of Violet Colors");
// }

function reorderBars() {
    check = true;
    updateBarChart([
        { "color": "Pink", "count": 42 },
        { "color": "Red", "count": 25 },
        { "color": "White", "count": 18 },
        { "color": "Orange", "count": 15 },
        { "color": "Yellow", "count": 12 },
      ], "Distribution of Rose Colors")
}


function highlightColor(colorName, highlightColor) {
    svg.selectAll(".bar")
        .transition()
        .duration(500)
        .attr("fill", function (d) {
            if (d.color === colorName) {
                return highlightColor;
            } else {
                return "#e09f3e"
            }
        })
}

function highlightColorMultiple(color1, color2, color3, color4, color5) {
    svg.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("fill", function (d) {
            if (d.color === color1) {
                return color1+"";
            } else if(d.color == color2) {
                return color2+"";
            } else if(d.color == color3) {
                return color3+"";
            } else if(d.color == color4) {
                return color4+"";
            } else if(d.color == color5) {
                return color5+"";
            }
        })
}

function updateBarChart(data, title = "") {
    if (checkPie) {
        chart.selectAll("*").remove();
        var data = data.map(d => d.count);
        var svg = d3.select("svg"),
            width = svg.attr("width"),
            height = svg.attr("height"),
            radius = Math.min(width, height) / 3,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var colorScale = d3.scaleOrdinal(['purple','blue','lavender','white','pink']);
        var pie = d3.pie();
        var arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius);
        var arcs = g.selectAll("arc")
                    .data(pie(data))
                    .enter()
                    .append("g")
                    .attr("class", "arc")

        arcs.append("path")
            .attr("fill", function(d, i) {
                return colorScale(i);
            })
            .attr("d", arc);
        if (title.length > 0) {
            svg.select("#chart-title")
                .text(title);
        }
    } else {
        xScale.domain(data.map(d => d.color));
        yScale.domain([0, d3.max(data, d => d.count)]).nice();

        const bars = chart.selectAll(".bar")
            .data(data, d => d.color);
        bars.exit()
            .remove();

        if(check==true) {
            bars.transition()
                .duration(1000)
                .attr("x", d => xScale(d.color))
                .attr("y", d => yScale(d.count))
                .attr("height", d => chartHeight - yScale(d.count));
        } else {
            bars.attr("x", d => xScale(d.color))
                .attr("y", d => yScale(d.count))
                .attr("height", d => chartHeight - yScale(d.count));
        }
        
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.color))
            .attr("y", chartHeight)
            .attr("height", 0)
            .attr("width", xScale.bandwidth())
            .attr("fill", "#e09f3e")
            .transition()
            .duration(1000)
            .attr("y", d => yScale(d.count))
            .attr("height", d => chartHeight - yScale(d.count));

        chart.select(".x-axis")
            .call(d3.axisBottom(xScale));

        chart.select(".y-axis")
            .call(d3.axisLeft(yScale));

        if (title.length > 0) {
            svg.select("#chart-title")
                .text(title);
        }
    }
}

function forwardClicked() {
    if (keyframeIndex < keyframes.length - 1) {
      keyframeIndex++;
      drawKeyframe(keyframeIndex);
    }
}
  
function backwardClicked() {
    if (keyframeIndex > 0) {
      keyframeIndex--;
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

function initializeSVG(){
    svg.attr("width",width);
    svg.attr("height",height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "#FFF3b0")
        .text("");
}


function clickRedBar(){
    const redBar = chart.select(".bar").filter(d => d.color == "Red"); //if element color is "Red"
    redBar.on("click", () => {
        clicked++;
        if (clicked%2==0) {
            d3.selectAll(".red-span").classed("red-text", false);
        } else {
            d3.selectAll(".red-span").classed("red-text", true); //selects all elements in class "red-span"
        }
    });
}

function redHover(){
    d3.select(".red-span").on("mouseover", () => highlightColor("Red", "red"));
    d3.select(".red-span").on("mouseout", () => highlightColor("Red", "#e09f3e"));
}

function purpleHover(){
    d3.select(".purp-span").on("mouseover", () => highlightColor("Purple", "purple"));
    d3.select(".purp-span").on("mouseout", () => highlightColor("Purple", "#e09f3e"));
}

async function initialize() {
    await loadData();
    initializeSVG();
    drawKeyframe(keyframeIndex);

    redHover();
    purpleHover();
}


initialize();
