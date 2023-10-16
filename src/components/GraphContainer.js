import React, {useContext, useState} from "react"
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend, Label } from "recharts"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContext"
import processGraph from "../custom_hooks/processGraph"

function GraphContainer() {

    const {data} = useContext(DataContext)

    let projId = useParams()
    const selectedProj = data.find((proj) => proj.proj === projId.proj)
    const projData = processGraph(selectedProj)
    // console.log(projData)

    return (
        <div>
            Project: {selectedProj.proj}
            <br></br>
            
            <LineChart width={1200} height={400} data={projData} margin={{top:0, right: 0, bottom: 0, left:100}}>
                <XAxis dataKey="wk"/>
                <CartesianGrid strokeDasharray="3 3"/>
                <YAxis>
                    <Label value="In dollars" angle="-90" position="left" />
                </YAxis>
                <Tooltip />
                <Legend />
                <Line type="linear" dataKey="budget" />
            </LineChart>
        </div>
    )
}

export default GraphContainer