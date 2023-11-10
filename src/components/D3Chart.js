import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


function D3Chart({teamData, usersData}) {
    const lineChartRef = useRef();

    // const stackedChartRef = useRef()

    // LINE CHART
    useEffect(() => {
        // Declare the chart dimensions and margins.
        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;
    
        // Declare the x (horizontal position) scale.
        const x = d3.scaleBand()
            .domain(teamData.map(d => d.date))
            .range([marginLeft, width - marginRight])
            .padding(0); // Adjust the padding as needed
    

        const maxBudget = d3.max(teamData, d => d.budget);

        // Round the maximum budget value to the nearest hundred or any desired round number
        const roundedMaxBudget = Math.ceil(maxBudget / 1000) * 1000;
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear()
            .domain([0, roundedMaxBudget + 500])
            .range([height - marginBottom, marginTop]);
    
        // Declare the line generator.
        const line = d3.line()
          .x(d => x(d.date))
          .y(d => y(d.budget));
    
        // Create the SVG container.
        const svg = d3.select(lineChartRef.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        svg.selectAll("*").remove();
    
        // Add the x-axis.
        svg.append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
    
        // Add the y-axis, remove the domain line, add grid lines, and a label.
        svg.append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(d3.axisLeft(y).ticks(height / 40))
          .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
          .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Daily close ($)"));
    
        // Append a path for the line.
        svg.append("path")
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line(teamData));
    }, [teamData]);


    // STACKED AREA CHART - currently breaks, need to fix usersData to include rows with no new data
    // useEffect(() => {
    //     const width = 928;
    //     const height = 500;
    //     const marginTop = 10;
    //     const marginRight = 10;
    //     const marginBottom = 20;
    //     const marginLeft = 40;

    //     console.log("usersData in useeffect", usersData)
    //     const series = d3.stack()
    //         .keys(d3.union(usersData.map(d => d.user)))
    //         .value(([, D], key) => D.get(key).budget) // Use a default value if budget is undefined
    //         (d3.index(usersData, d => d.date, d => d.user));

    //     const x = d3.scaleBand()
    //         .domain(usersData.map(d => d.date))
    //         .range([marginLeft, width - marginRight])
    //         .padding(0); // Adjust the padding as needed

    //     const y = d3.scaleLinear()
    //         .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    //         .rangeRound([height - marginBottom, marginTop]);

    //     const color = d3.scaleOrdinal()
    //         .domain(series.map(d => d.key))
    //         .range(d3.schemeTableau10);

    //     const area = d3.area()
    //         .x(d => x(d.data[0]))
    //         .y0(d => y(d[0]))
    //         .y1(d => y(d[1]))
          
    //     const svg = d3.select(stackedChartRef.current)
    //         .attr("width", width)
    //         .attr("height", height)
    //         .attr("viewBox", [0, 0, width, height])
    //         .attr("style", "max-width: 100%; height: auto;");

    //     svg.append("g")
    //         .attr("transform", `translate(${marginLeft},0)`)
    //         .call(d3.axisLeft(y).ticks(height / 80))
    //         .call(g => g.select(".domain").remove())
    //         .call(g => g.selectAll(".tick line").clone()
    //             .attr("x2", width - marginLeft - marginRight)
    //             .attr("stroke-opacity", 0.1))
    //         .call(g => g.append("text")
    //             .attr("x", -marginLeft)
    //             .attr("y", 10)
    //             .attr("fill", "currentColor")
    //             .attr("text-anchor", "start")
    //             .text("↑ Unemployed persons"));

    //     svg.append("g")
    //         .selectAll()
    //         .data(series, d => d.key) // Explicitly provide a key function
    //         .join("path")
    //             .attr("fill", d => color(d.key))
    //             .attr("d", area)
    //         .append("title")
    //             .text(d => d.key);

    //     svg.append("g")
    //         .attr("transform", `translate(0,${height - marginBottom})`)
    //         .call(d3.axisBottom(x).tickSizeOuter(0));
    // }, [usersData]);


  return (
    <div>
      <svg ref={lineChartRef} id="lineChart">
            <g className="x-axis" transform={`translate(0, 100)`}></g>
            <g className="y-axis"></g>
      </svg>
      {/* <svg ref={stackedChartRef} id="stackedChart">
      </svg> */}

    </div>
    
  );
};
  
export default D3Chart;