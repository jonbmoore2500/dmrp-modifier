import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


function D3Chart({teamData, usersData, budgetVsUsers, includeBudget, userRole}) {
    const stackedChartRef = useRef()
    // const legendRef = useRef() // consider moving legend to its own div, outside chart svg

    // add tooltip https://observablehq.com/@d3/line-with-tooltip/2?intent=fork
    const width = 1200;
    const height = 700;
    const marginTop = 20;
    const marginRight = 10;
    const marginBottom = 140;
    const marginLeft = 50;
    
    // STACKED AREA CHART
    useEffect(() => {
        // COMMON CHART SETUP PROCESS
        const x = d3.scaleBand()
            .domain(usersData.map(d => d.date))
            .range([marginLeft, width - marginRight])

        let maxBudget = d3.max(teamData, d => d.budget);
        const teamsMax = teamData[teamData.length - 1]
        if (includeBudget && teamsMax.budget < teamsMax.expected) {
            maxBudget = d3.max(teamData, d => d.expected)
        } 

        // Round the maximum budget value to the nearest hundred or any desired round number
        const roundedMaxBudget = Math.ceil(maxBudget / 1000) * 1000

        const y = d3.scaleLinear()
            .domain([0, roundedMaxBudget + 500])
            .range([height - marginBottom, marginTop])

        const svg = d3.select(stackedChartRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;")

        svg.selectAll("*").remove()

        const line = d3.line()
            .x(d => x(d.date) + x.bandwidth() / 2)
            .y(d => y(d.budget))

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("d", line(teamData))

        if (budgetVsUsers && includeBudget) { // all expected-line-specific and diffArea rendering
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 80))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Expected vs Actual"));

            const lineExpect = d3.line()
                .x(d => x(d.date) + x.bandwidth() / 2)
                .y(d => y(d.expected));

            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("d", lineExpect(teamData));

            const colors = ["#de1a24", "#3f8f29"] // [red, green]

            svg.append("clipPath")
                .attr("id", "above")
                .append("path")
                .attr("d", d3.area()
                    .x(d => x(d.date) + x.bandwidth() / 2)
                    .y0(0)
                    .y1(d => y(d.budget))(teamData));

            svg.append("path")
                .attr("clip-path", "url(#above)")
                .attr("fill", colors[1])
                .attr("d", d3.area()
                    .x(d => x(d.date) + x.bandwidth() / 2)
                    .y0(height)
                    .y1(d => y(d.expected))(teamData))

            svg.append("clipPath")
                .attr("id", "below")
                .append("path")
                .attr("d", d3.area()
                    .x(d => x(d.date) + x.bandwidth() / 2)
                    .y0(0)
                    .y1(d => y(d.expected))(teamData))

            svg.append("path")
                .attr("clip-path", "url(#below)")
                .attr("fill", colors[0])
                .attr("d", d3.area()
                    .x(d => x(d.date) + x.bandwidth() / 2)
                    .y0(height)
                    .y1(d => y(d.budget))(teamData))

        } else { // all users-area-specific rendering

            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 80))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Budget to date, by user or role"));

            const areaTooltip = d3.select("body")
                .append("div")
                    .attr("id", "chart")
                    .attr("class", "tooltip") 

            const mouseover = function(d) {
                areaTooltip.style("opacity", .8)
                d3.select(this).style("opacity", .5)
            }
            const mouseleave = function(d) {
                areaTooltip.style("opacity", 0)
                d3.select(this).style("opacity", 1)
            }


                    




            const series = d3.stack()
                .keys(d3.union(usersData.map(d => d.user)))
                .value(([, D], key) => D.get(key).budget)
                (d3.index(usersData, d => d.date, d => d.user))

            const color = d3.scaleOrdinal()
                .domain(series.map(d => d.key))
                .range(d3.schemeTableau10)
    
            const area = d3.area()
                .x(d => x(d.data[0]) + x.bandwidth() / 2)
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))

            svg.append("g")
                .selectAll()
                .data(series, d => d.key)
                .join("path")
                    .attr("fill", d => color(d.key))
                    .attr("d", area)
                    .on("mouseover", mouseover)
                    .on("mouseleave", mouseleave)
                .append("title")
                    .text(d => d.key)

            generateLegend(svg, color, series)

        }

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .attr("transform", "rotate(-60)")
            .style("text-anchor", "end")

    }, [teamData, usersData]);

    function findLongestUser(users) {
        let length = users[0].user.length 

        users.forEach((u) => {
            length = Math.max(length, u.user.length)
        })
        return length
    }

    function generateLegend(svg, color, series) {
        const legendItems = series.map(d => ({
            user: d.key,
            color: color(d.key)
        }))

        const longest = findLongestUser(legendItems)
    
        const legend = svg.append("g")
            .attr("transform", `translate(${width / 8}, 0)`)
    
        const legendRectSize = 12;
        const legendSpacing = 6;
        const legendHeight = legendRectSize + legendSpacing;
        const legendWidth = longest * 10

        legend.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight * legendItems.length + legendSpacing)
            .attr("x", -legendSpacing / 2)
            .attr("y", 0)
            .style("fill", "#fff")

        legend.selectAll("rect.legend-swatch")
            .data(legendItems)
            .enter()
            .append("rect")
            .attr("class", "legend-swatch")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("x", 0)
            .attr("y", (d, i) => i * (legendRectSize + legendSpacing) + legendSpacing)
            .style("fill", d => d.color)
    
        legend.selectAll("rect")
            .data(legendItems)
            .enter()
            .append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("x", 0)
            .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
            .style("fill", d => d.color)
    
        legend.selectAll("text")
            .data(legendItems)
            .enter()
            .append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", (d, i) => i * (legendRectSize + legendSpacing) + (legendRectSize / 2)  + legendSpacing)
            .attr("dy", "0.35em")
            .text(d => d.user)
    
        return legend
    }

  return (
    <div>
        {/* <div ref={legendRef}></div> */}
        <svg ref={stackedChartRef} id="stackedChart">
        </svg>
    </div>
    
  );
};
  
export default D3Chart;