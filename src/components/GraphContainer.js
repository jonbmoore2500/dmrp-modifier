import React, {useContext, useEffect, useState} from "react"
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from "recharts"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContext"
import processGraph from "../custom_hooks/processGraph"
import timelineSlice from "../custom_hooks/timelineSlice"
import timelineByOption from "../custom_hooks/timelineByOption"

function GraphContainer() {

    const {data} = useContext(DataContext)

    const [timeline, setTimeline] = useState("all")
    const [byOption, setByOption] = useState("all")
    const [normalized, setNormalized] = useState(false)

    let projId = useParams()
    const selectedProj = data.find((proj) => proj.proj === projId.proj)
    const projData = processGraph(selectedProj)

    let dispData = timelineSlice(projData, timeline)
    if (dispData !== "invalid") {
        dispData = timelineByOption(dispData, byOption)
    }

    if (normalized) {
        let extra = dispData[0].budget
        dispData = dispData.map((x) => ({...x, budget: x.budget - extra}))
    }

    useEffect(() => {
        setNormalized(false)
    }, [projId, timeline])

    useEffect(() => {
        setTimeline("all")
    }, [projId])

    return (
        <div>
            Project: {selectedProj.proj}
            <br></br>
            <div>
                <span>View </span>
                <select onChange={(e) => setTimeline(e.target.value)}>
                    <option value="all">All</option>
                    <option value="year">Year</option>
                    <option value="ytd">YTD</option>
                    <option value="quar">Current Quarter</option>
                    <option value="month">Current Month</option>
                </select>
                <span> by </span>
                <select onChange={(e) => setByOption(e.target.value)}>
                    <option value="all">Week &#40;default&#41;</option>
                    <option value="week">Week &#40;joined&#41;</option>
                    <option value="month">Month</option>
                </select>
                <button onClick={() => setNormalized(!normalized)}>{normalized ? "Reset" : "Normalize to 0"}</button>
            </div>
            {dispData !== "invalid" ? 
                    <LineChart width={1200} height={450} data={dispData} margin={{top:0, right: 30, bottom: 80, left:100}}>
                        <XAxis dataKey="wk"
                            angle="-75"
                            dx={-5}
                            textAnchor="end"
                            // tickFormatter={(value) => value.slice(0, 26)}
                            interval={'preserveEnd'}
                        />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <YAxis tickFormatter={(value) => "$" + (value && value.toLocaleString())} />
                        <Tooltip />
                        <Line type="linear" dataKey="budget" formatter={(value) => "$" + (value && value.toLocaleString())} />
                    </LineChart>
                    :
                    <p>Your CSV does not contain any data for this time period</p>
            }

        </div>
    )
}

export default GraphContainer