let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4, 5]
       
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4, 5]
        
    },
    {
        activeVerse: 3,
        activeLines: [1]
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
        activeVerse: 3,
        activeLines: [5]
    },
    {
        activeVerse: 4,
        activeLines: [1],
    },
    {
        activeVerse: 4,
        activeLines: [2]
    },
    {
        activeVerse: 4,
        activeLines: [3],
    },
    {
        activeVerse: 4,
        activeLines: [4]
    },
    {
        activeVerse: 4,
        activeLines: [5]
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
    },
    {
        activeVerse: 5,
        activeLines: [5]
    },
     {
        activeVerse: 6,
        activeLines: [1, 2, 3, 4, 5]
    }
]
// TODO add svgUpdate fields to keyframes

// TODO define global variables

const height = 300;
const width = 300;
let clicked = 0;
let checkPie = false;
let chartData;

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

async function loadData(){
    await d3.csv("data.csv").then(data => {
        chartData = data;
    })
    await d3.csv("data.csv").then(data => {
        chartData = data;
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

async function initialize() {
    await loadData();
    initializeSVG();
    drawKeyframe(keyframeIndex);

    redHover();
    purpleHover();
}


initialize();
