import React, {useState} from "react"

function ResultTable({tableData}) {

    const [projIndex, setProjIndex] = useState(-1)
    const [columnNum, setColumnNum] = useState(3)

    let selectedP = tableData[projIndex]

    let tableHead = []
    let tableRows = []

    function tableHelper(sheet, user) {
        let value = "0"
        let i = user["timeSheets"].findIndex(element => {return element["sheetTitle"].includes(sheet)})    
        if (i >= 0) {
            value = String(user["timeSheets"][i]["hours"])
            if (user["timeSheets"][i]["sheetTitle"].includes("Adjusted")) {
                value = value + " (Adj.)"
            }
        }
        return value
    }

    if (projIndex >= 0) {
        let timesheets = selectedP["timeSheets"].slice(0, columnNum)
        tableHead = ["Users", ...timesheets]
        tableRows = selectedP["users"].map((user) => {
            return [user["userName"], ...timesheets.map((sheet) => {return tableHelper(sheet, user)})] 
        })
    }

    return (
        <div id="tableOuter">
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
                <table id="tableInner">
                    <caption id="tableCaption">{selectedP.proj}</caption>
                    <thead>
                        <tr>
                            {tableHead.map((x) => (
                                <th key={x} className="tableHeader">{x}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((r) => (
                            <tr key={r[0]}>
                                <th className="tableUser">{r[0]}</th> 
                                {r.slice(1).map((x, i) => (
                                    <td key={i} className="tableValue">{x}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            <div className="buttonDiv">
                <label>Show More Timesheets?</label>
                <button onClick={() => setColumnNum(columnNum + 3)}>Show</button>
            </div>
            <div className="buttonDiv">
                <label>Reset</label>
                <button onClick={() => setColumnNum(3)}>Reset</button>
            </div>
        </div>
    )
}

export default ResultTable