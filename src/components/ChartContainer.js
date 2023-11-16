// temporary, for experimenting - might be more permanent, tbd

import React, {useContext, useEffect, useState} from "react"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

    const [weekMonth, setWeekMonth] = useState("month")
    const [budgetVal, setBudgetVal] = useState(null)
    const [projStartDate, setProjStartDate] = useState(null)
    const [projectMonths, setProjectMonths] = useState(12)
    const [budgetVsUsers, setBudgetVsUsers] = useState(false)

    function handleViewChange(e) {
        setBudgetVsUsers(JSON.parse(e.target.value))
        setBudgetVal(null)
    }

    function handlePlotBudget(event) {
        event.preventDefault();
        const inputValue = event.target.number.value;
        if (/^\d+$/.test(inputValue)) {
            const parsedNumber = parseInt(inputValue, 10);
            setBudgetVal(parsedNumber)
        } else {
            setBudgetVal(null)
        }
    }

    function handleChangeStart(date) {
        setProjStartDate(date.toString().slice(4, 15))
    }

    function handleLengthChange(e) {
        e.preventDefault()
        if (/^\d+$/.test(e.target.value)) {
            setProjectMonths(e.targetValue)
        }
    }

    let projId = useParams()

    const selectedProj = data.find((proj) => proj.proj === projId.proj)
    const graphData = processGraph(selectedProj)
    let [teamData, usersData] = processChart(selectedProj, weekMonth)

    if (budgetVal) {
        teamData = addBudgetLine(teamData, budgetVal, projectMonths, projStartDate, weekMonth)
        // teamData = extendData(teamData, projStartDate, projectMonths, weekMonth)
    }

    useEffect(() => {
        setBudgetVal(null)
    }, [projId])

    console.log("teamData", teamData)
    console.log("usersData", usersData)
    return (
        <div>
            Project: {selectedProj.proj}
            <br></br>
            <div>
                <label>
                    Choose a Time Breakdown
                    <select onChange={(e) => setWeekMonth(e.target.value)}>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                    </select>
                </label>
                <label>
                    Select a Data View
                    <select onChange={handleViewChange}>
                        <option value={false}>User Breakdown</option>
                        <option value={true}>Budget Compare</option>
                    </select>
                </label>
                { budgetVsUsers ? 
                    <>
                        <form onSubmit={handlePlotBudget}>
                            <label>
                                <input 
                                    type="text"
                                    name="number"
                                    placeholder="$_____"
                                />
                            </label>
                            <button type="submit">Apply Budget</button>
                        </form>

                        <label>
                            Change Default Project Start Date &#40;optional&#41;
                            <DatePicker
                                selected={projStartDate}
                                onChange={handleChangeStart}
                                dateFormat="MM/dd/yyyy"
                                isClearable
                                showYearDropdown
                                scrollableYearDropdown
                            />
                        </label>

                        <form onSubmit={handleLengthChange}>
                            <label>
                                Project Length &#40;months&#41;
                                <input 
                                    value={projectMonths}
                                    type="text"
                                    name="months"
                                    onChange={(e) => setProjectMonths(e.target.value)}
                                />
                            </label>
                            <button type="submit">Change Length</button>
                        </form>
                    </>
                    :
                    null
                }
            </div>
            <D3Chart 
                teamData={teamData} 
                usersData={usersData} 
                budgetVsUsers={budgetVsUsers}
                includeBudget={budgetVal ? true : false}
            />
        </div>
    )
}

export default ChartContainer