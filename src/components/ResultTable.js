import React, {useState} from "react"

function ResultTable({tableData}) {

    const [projIndex, setProjIndex] = useState(-1)
    const [columnNum, setColumnNum] = useState(3)
    const [showIdle, setShowIdle] = useState(false)

    let selectedP = tableData[projIndex]

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

    if (projIndex >= 0) {
        let timesheets = selectedP["timeSheets"].slice(0, columnNum)
        tableHead = ["Users", ...timesheets]
        tableRows = selectedP["users"].map((user) => [user["userName"], ...timesheets.map((sheet) => tableHelper(sheet, user))])
    }

    return (
        <div>
            <br></br>
            <form>
                <label>Choose a project: </label>
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
                    <h3 id="tableCaption">{selectedP.proj}</h3>
                    <div id="tableOuter">
                        <table>
                            <thead>
                                <tr>
                                    <th className="firstColumn">{tableHead[0]}</th>
                                    {tableHead.slice(1).map((x) => (
                                        <th key={x} className="tableHeaderCell">{x}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((r) => (
                                    <tr key={r[0]}>
                                        <th className="firstColumn">{r[0]}</th> 
                                        {r.slice(1).map((x, i) => (
                                            <td key={i} className={x > 0 ? "positiveCell tableValueCell" : "zeroCell tableValueCell"}>{x}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <br></br>

                    <div id="buttonOuter">
                        <div className="buttonDiv">
                            <label>Show More Timesheets?  </label>
                            <button onClick={() => setColumnNum(columnNum + 3)}>Show</button>
                        </div>
                        <div className="buttonDiv">
                            <label>Reset  </label>
                            <button onClick={() => setColumnNum(3)}>Reset</button>
                        </div>
                    </div>
                    
                </div>
            }

        </div>
    )
}

export default ResultTable