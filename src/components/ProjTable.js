import React, {useState} from "react"

function ProjTable({project}) {

    const [columnNum, setColumnNum] = useState(3)
    const [showIdle, setShowIdle] = useState(false)

    let tableHead = []
    let tableRows = []

    function tableHelper(sheet, user) {
        let value = "0"
        let i = user["timeSheets"].findIndex(element => element["sheetTitle"].includes(sheet))    
        if (i >= 0) {
            value = String(user["timeSheets"][i]["hours"])
            if (user["timeSheets"][i]["sheetTitle"].includes("Adjusted")) {
                value = value + " (Adj.)"
            }
        }
        return value
    }

    let timesheets = project["timeSheets"].slice(0, columnNum + 2) // calculates enough values to determine idle, display filters further down below in JSX
    tableHead = ["Users", ...timesheets]
    tableRows = project["users"].map((user) => [user["userName"], ...timesheets.map((sheet) => tableHelper(sheet, user))])
    if (!showIdle) {
        tableRows = tableRows.filter((r) => r.slice(1).reduce((a, c) => a + parseInt(c), 0) > 0)
    }

    return (
        <div>
            <div className="tableHead">
                <h4 id="tableCaption">{project.proj}</h4>
                <div className="buttonDiv">
                    <label>Toggle Idles?  </label>
                    <button onClick={() => setShowIdle(!showIdle)}>{!showIdle ? "Show" : "Hide"}</button>
                </div>
                <div className="buttonDiv">
                    <label>More Weeks?  </label>
                    <button onClick={() => setColumnNum(columnNum + 3)}>More</button>
                </div>
                <div className="buttonDiv">
                    <label>Reset  </label>
                    <button onClick={() => setColumnNum(3)}>Reset</button>
                </div>
            </div>
            <div id="tableOuter">
                <table>
                    <thead>
                        <tr>
                            <th className="firstColumn">{tableHead[0]}</th>
                            {tableHead.slice(1, columnNum + 1).map((x) => (
                                <th key={x} className="tableHeaderCell">{x}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((r) => (
                            <tr key={r[0]}>
                                <th className="firstColumn">{r[0]}</th> 
                                {r.slice(1, columnNum + 1).map((x, i) => (
                                    <td key={i} className={parseFloat(x) > 0 ? "positiveCell tableValueCell" : "zeroCell tableValueCell"}>{x}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjTable