import React, {useState} from "react"

function ResultTable({tableData}) {

    const [projIndex, setProjIndex] = useState(-1)
    const [columnNum, setColumnNum] = useState(3)

    let selected = tableData[projIndex]

    let tableHead = []
    let tableRows = []

    if (projIndex >= 0) {
        let timesheets = selected["timeSheets"].slice(0, columnNum)
        tableHead = ["Users", ...timesheets]
        tableRows = selected["users"].map((user) => {
            let row = [user["userName"]]
            timesheets.forEach((sheet) => { // create helper function later, handle in place for now
                let i = user["timeSheets"].findIndex(element => {
                    return element["sheetTitle"].includes(sheet)
                })    
                i >= 0 ? (row.push(user["timeSheets"][i]["hours"])) : row.push(0)
            })
            return row 
        })
    }

    console.log(tableHead)
    console.log(tableRows)
    return (
        <div>
            <form>
                <label>Choose a project</label>
                <select 
                    onChange={(e) => {
                        setProjIndex(e.target.value)
                        setColumnNum(3)
                    }} 
                    value={projIndex}
                >
                    <option value={-1}></option>
                    {tableData.map((proj, i) => (
                        <option key={proj.proj} value={i}>{proj.proj}</option>
                    ))}
                </select>
            </form>
            { projIndex < 0 ? <p>Please select a project</p> :
                <div>
                    <h3>{selected.proj}</h3>
                    <table>
                        <thead>
                            <tr>
                                {tableHead.map((x) => (
                                    <th key={x}>{x}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((r) => (
                                <tr key={r[0]}>
                                    {r.map((x, i) => (
                                        <td key={i}>{x}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            {/* button to show more columns - debug later*/}
            {/* <form> 
                <label>Show More Timesheets?</label>
                <button onClick={() => setColumnNum(columnNum + 3)}>Show</button>
            </form> */}
        </div>
    )
}

export default ResultTable