// temporary, for experimenting - might be more permanent, tbd

import React, {useContext, useEffect, useState} from "react"

import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContext"
import D3Chart from "./D3Chart"
import processChart from "../custom_hooks/processChart"
import ChartBudgetForm from "./ChartBudgetForm";
import addBudgetLine from "../custom_hooks/addBudgetLine"

function ChartContainer() {

    const {data} = useContext(DataContext)

    const [weekMonth, setWeekMonth] = useState("month")
    const [budgetVsUsers, setBudgetVsUsers] = useState(false)

    const [userRole, setUserRole] = useState("userName")

    const budgetDefault = {budgetVal: undefined, startDate: null, duration: 12}
    const [budgetSettings, setBudgetSettings] = useState(budgetDefault)


    function resetBudget() {
        setBudgetSettings(budgetDefault)
    }

    function handleViewChange(e) {
        setBudgetVsUsers(JSON.parse(e.target.value))
        resetBudget()
    }

    function handleAreaChange(e) {
        setUserRole(e.target.value)
    }

    let projId = useParams()
    const selectedProj = data.find((proj) => proj.proj === projId.proj)
    console.log(selectedProj)

    let [teamData, usersData] = processChart(selectedProj, weekMonth, userRole)
    console.log(teamData, usersData, "chartBudgetTest")

    if (budgetSettings.budgetVal) {
        teamData = addBudgetLine(teamData, budgetSettings, weekMonth)
    }

    useEffect(() => {
        resetBudget()
    }, [projId])

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
                    <ChartBudgetForm setBudgetSettings={setBudgetSettings} defaultVals={budgetDefault}/>
                    :
                    <label>
                    Choose an Area Breakdown
                        <select onChange={handleAreaChange}>
                            <option value="userName">By User</option>
                            <option value="role">By Role</option>
                        </select>
                    </label>
                }
            </div>
            <D3Chart 
                teamData={teamData} 
                usersData={usersData} 
                budgetVsUsers={budgetVsUsers}
                includeBudget={budgetSettings.budgetVal ? true : false}
                userRole={userRole}
            />
        </div>
    )
}

export default ChartContainer