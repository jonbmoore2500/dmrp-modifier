import React, {useState, useEffect} from "react"
import popTable from "../custom_hooks/popTable"
import TableButtons from "./TableButtons"

function ProjTable({project}) {

    const [weeksNum, setWeeksNum] = useState(4)
    const [showIdle, setShowIdle] = useState(false)
    const [showRates, setShowRates] = useState(false)

    const fullTableObj = popTable(project) // populates master table object. manipulated below

    let tableHead = [...fullTableObj["head"]]
    let subHeader = ["Name", "Hourly Rate"].concat(Array.from({length: tableHead.length - 1}, () => [...["Hrs", "$"]]).flat())
    let tableRows = [...fullTableObj["rows"]]
    let totalRow = [...fullTableObj["totals"]]

    const [col2Left, setCol2Left] = useState(1)

    if (!showIdle) {
        tableRows = tableRows.filter((r) => r.slice(2, (weeksNum + 3) * 2).some((x) => parseFloat(x) > 0))
    }

    if (!showRates) {
        subHeader = subHeader.filter((_, i) => i % 2 === 0)
        tableRows = tableRows.map(r => r.filter((_, i) => i % 2 === 0))
        totalRow = totalRow.filter((_, i) => i % 2 === 0)
    }

    useEffect(() => {
        const table = document.getElementById(project.proj) // finds correct project table
        const col1 = table.querySelector('.leftRef') // finds reference cell from correct project table
        if (showRates) {
            const col1width = col1.offsetWidth
            setCol2Left(col1width)
        }
    }, [showRates, weeksNum, showIdle])

    return (
        <div>
            <div className="tableHead">
                <h4 id="tableCaption">{project.proj}</h4>
                <TableButtons 
                    setShowIdle={setShowIdle}
                    showIdle={showIdle}
                    setWeeksNum={setWeeksNum}
                    weeksNum={weeksNum}
                    setShowRates={setShowRates}
                    showRates={showRates}
                />
            </div>
            <div id="tableOuter">
                <table className="mainTable">
                    <thead>
                        <tr>
                            <th className="stickySpan" colSpan={showRates ? "2" : "1"}>{tableHead[0]}</th>
                            {tableHead.slice(1, weeksNum + 1).map((x, i) => (
                                <th key={x + i} className="" colSpan={showRates ? "2" : "1"}>{x}</th>
                            ))}
                        </tr>
                        <tr>
                            <th className="sticky leftRef">{subHeader[0]}</th>
                            {showRates ? <th className="rates" style={{left: col2Left}}>{subHeader[1]}</th> : null}
                            {subHeader.slice((showRates ? 2 : 1), (weeksNum + 1) * (showRates ? 2 : 1)).map((x, i) => (
                                <th key={x + i} className="">{x}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((r) => (
                            <tr key={r[0]}>
                                <td className="sticky">{r[0]}</td>
                                {showRates ? <td className="rates" style={{left: col2Left}}>${r[1]}</td> : null} 
                                {r.slice((showRates ? 2 : 1), (weeksNum + 1) * (showRates ? 2 : 1)).map((x, i) => (
                                    <td key={i} className={parseFloat(x) > 0 ? "positiveCell " : "zeroCell "}>
                                        {(showRates && i%2 === 1) ? "$" + x : x }
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <th className="sticky">{totalRow[0]}</th>
                            {showRates ? <th className="rates" style={{left: col2Left}}>{totalRow[1]}</th> : null}
                            {totalRow.slice((showRates ? 2 : 1), (weeksNum + 1) * (showRates ? 2 : 1)).map((x, i) => (
                                <th key={-i} className="totalCell">{(showRates && i%2 === 1 && i >= 0) ? "$" + x : x}</th>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjTable