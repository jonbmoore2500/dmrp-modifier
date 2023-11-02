import React, {useContext, useEffect, useState} from "react"
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from "recharts"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContext"
import processGraph from "../custom_hooks/processGraph"
import timelineSlice from "../custom_hooks/timelineSlice"
import timelineByOption from "../custom_hooks/timelineByOption"
import addBudgetLine from "../custom_hooks/addBudgetLine"

function GraphContainer() {

    const {data} = useContext(DataContext)

    const [timeline, setTimeline] = useState("all")
    const [byOption, setByOption] = useState("month")
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
    const projData = processGraph(selectedProj)

    let dispData = timelineSlice(projData, timeline)
    if (dispData !== "invalid") {
        dispData = timelineByOption(dispData, byOption)
    }

    if (normalized) {
        let extra = dispData[0].budget
        dispData = dispData.map((x) => ({...x, budget: x.budget - extra}))
    }

    if (budgetVal && byOption === "month") {
        dispData = addBudgetLine(dispData, budgetVal, projectMonths)
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
                    <option value="month">Month</option>
                    <option value="all">Week &#40;default&#41;</option>
                    <option value="week">Week &#40;joined&#41;</option>
                </select>
                <button onClick={() => setNormalized(!normalized)}>{normalized ? "Reset" : "Normalize to 0"}</button>
                <form onSubmit={handlePlotBudget}>
                    <label>
                        Plot total budget reference line. Must be an integer 
                        <input 
                            type="text"
                            name="number"
                        />
                    </label>
                    <button type="submit">Apply Budget</button>
                </form>
            </div>
            {dispData !== "invalid" ? 
                    <LineChart width={1200} height={450} data={dispData} margin={{top:0, right: 30, bottom: 80, left:100}}>
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
                        <Line 
                            type="linear" 
                            dataKey="expected" 
                            formatter={(value) => "$" + (value && value.toLocaleString())} 
                            stroke="#82ca9d"
                        />
                    </LineChart>
                    :
                    <p>Your CSV does not contain any data for this time period</p>
            }

        </div>
    )
}

export default GraphContainer