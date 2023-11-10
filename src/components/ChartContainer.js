// temporary, for experimenting

import React, {useContext, useEffect, useState} from "react"
import { ComposedChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Area } from "recharts"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContext"
import D3Chart from "./D3Chart"
import processGraph from "../custom_hooks/processGraph"
import processChart from "../custom_hooks/processChart"
import timelineSlice from "../custom_hooks/timelineSlice"
import timelineByOption from "../custom_hooks/timelineByOption"
import addBudgetLine from "../custom_hooks/addBudgetLine"

function ChartContainer() {

    const {data} = useContext(DataContext)

    const [timeline, setTimeline] = useState("all")
    const [byOption, setByOption] = useState("all")
    const [normalized, setNormalized] = useState(false)
    const [budgetVal, setBudgetVal] = useState(null)
    const [projStartDate, setProjStartDate] = useState(null)
    const [projectMonths, setProjectMonths] = useState(12)

    function handlePlotBudget(event) {
        event.preventDefault();
        const inputValue = event.target.number.value;
        if (/^\d+$/.test(inputValue)) {
          const parsedNumber = parseInt(inputValue, 10);
          setBudgetVal(parsedNumber)
        }
    }

    let projId = useParams()
    const selectedProj = data.find((proj) => proj.proj === projId.proj)
    const graphData = processGraph(selectedProj)
    const [teamData, usersData] = processChart(selectedProj)

    useEffect(() => {
        setNormalized(false)
    }, [projId, timeline])

    useEffect(() => {
        setTimeline("all")
        setBudgetVal(null)
    }, [projId])
    // console.log("graphData", graphData)
    // console.log("chartData", teamData)
    return (
        <div>
            Project: {selectedProj.proj}
            <br></br>
            <D3Chart teamData={teamData} usersData={usersData}/>
            <ComposedChart width={1200} height={450} data={graphData} margin={{top:0, right: 30, bottom: 80, left:100}}>
                <XAxis dataKey="wk"
                    angle="-75"
                    dx={-5}
                    textAnchor="end"
                    interval={'preserveEnd'}
                />
                <CartesianGrid strokeDasharray="3 3"/>
                <YAxis tickFormatter={(value) => "$" + (value && value.toLocaleString())} />
                <Tooltip />
                <Line 
                    type="linear" 
                    dataKey="budget" 
                    formatter={(value) => "$" + (value && value.toLocaleString())} 
                    stroke="#8884d8"
                />
                <Area 
                    dataKey="actualVsExpect" 
                    stroke="#8884d8" 
                    fill="green"
                />
            </ComposedChart>
        </div>
    )
}

export default ChartContainer

// try d3 ? https://observablehq.com/@d3/difference-chart/2?intent=fork 
// https://www.influxdata.com/blog/guide-d3js-react/#:~:text=To%20create%20a%20bar%20chart,the%20chart%20to%20the%20page.&text=We%20use%20the%20useRef%20hook,use%20to%20render%20the%20chart.