import React, {useState} from "react"
import popTable from "../custom_hooks/popTable"

function ProjTable({project}) {

    const [columnNum, setColumnNum] = useState(3)
    const [showIdle, setShowIdle] = useState(false)
    const [showRates, setShowRates] = useState(false)

    const fullTableObj = popTable(project) // populates master table object. manipulated below

    let tableHead = [...fullTableObj["head"]]
    let tableRows = [...fullTableObj["rows"]]
    let totalRow = [...fullTableObj["totals"]]

    if (!showIdle) {
        tableRows = tableRows.filter((r) => r.slice(1, columnNum + 2).reduce((a, c) => a + parseInt(c), 0) > 0)
    }

    if (!showRates) {
        tableHead = tableHead.filter((_, i) => i % 2 === 0)
        tableRows = tableRows.map(r => r.filter((_, i) => i % 2 === 0))
        totalRow = totalRow.filter((_, i) => i % 2 === 0)
    }

    function handleRatesToggle(showBool) {
        setShowRates(showBool)
        setColumnNum(columnNum * (showBool ? 2 : .5))
    }
    function handleReset() {
        setColumnNum(3)
        setShowIdle(false)
        setShowRates(false)
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
                    <label>Show Rates?  </label>
                    <button onClick={() => handleRatesToggle(!showRates)}>{!showRates ? "Show" : "Hide"}</button>
                </div>
                <div className="buttonDiv">
                    <label>Reset  </label>
                    <button onClick={() => handleReset()}>Reset</button>
                </div>
            </div>
            <div id="tableOuter">
                <table>
                    <thead>
                        <tr>
                            <th className="firstColumn headRow">{tableHead[0]}</th>
                            {tableHead.slice(1, columnNum + 2).map((x, i) => (
                                <th key={x + i} className="tableHeaderCell">{(showRates && i%2 === 0 && i > 0) ? null : x}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((r) => (
                            <tr key={r[0]}>
                                <th className="firstColumn tableBody">{r[0]}</th> 
                                {r.slice(1, columnNum + 2).map((x, i) => (
                                    <td key={i} className={parseFloat(x) > 0 ? ((showRates && i%2 === 1) ? "positiveCell tableValueCell dollar" : "positiveCell tableValueCell") : "zeroCell tableValueCell"}>
                                        {(showRates && i%2 === 0) ? "$" + x : x}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr className="totalRow">
                            <th className="firstColumn tableTotal">{totalRow[0]}</th>
                            {totalRow.slice(1, columnNum + 2).map((x, i) => (
                                <td key={-i} className="totalCell">{(showRates && i%2 === 0 && i > 0) ? "$" + x : x}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjTable