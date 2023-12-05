import React, {useState, useEffect, useRef } from "react"
import popTable from "../custom_hooks/popTable"
import TableButtons from "./TableButtons"
import BottomBtns from "./BottomBtns"

function ProjTable({project}) {

    // generating table with contents
    const [weeksNum, setWeeksNum] = useState(4)
    const [showIdle, setShowIdle] = useState(false)
    const [showRates, setShowRates] = useState(false)
    const tableRef = useRef(null)

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
    // end generating table with contents


    // handle copy content
    let isSelecting = false
    let startCell = null
    let endCell = null

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let timer = setTimeout(() => setCopied(false), 2500)
        return () => {
            clearTimeout(timer)
        }
    }, [copied])

    useEffect(() => {
        function handleClickOut(e) {
            if (tableRef.current && !tableRef.current.contains(e.target)) handleCancel()
        }
        document.addEventListener('click', handleClickOut)
        return () => document.removeEventListener('click', handleClickOut)
    }, [tableRef])

    function handleMouseDown(cell) {
        isSelecting = true
        startCell = cell.split("x")
        setCopied(false)
    }
    
    function handleClick(cell) {
        startCell = cell.split("x")
        isSelecting = true 
        handleMouseOver(cell)
        isSelecting = false
    }

    function handleMouseOver(cell) {
        if (!isSelecting) return 

        const table = document.getElementById(`${project.proj}table`)
        const allCells = Array.from(table.getElementsByClassName('data'))
        const corners = [ 
            [Math.min(parseInt(startCell[0]), parseInt(cell.split("x")[0])), Math.min(parseInt(startCell[1]), parseInt(cell.split("x")[1]))],
            [Math.max(parseInt(startCell[0]), parseInt(cell.split("x")[0])), Math.max(parseInt(startCell[1]), parseInt(cell.split("x")[1]))]
        ]
        allCells.forEach((cell) => {
            let split = cell.id.split("x")
            if (split[0] >= parseInt(corners[0][0]) && split[0] <= parseInt(corners[1][0]) && split[1] >= parseInt(corners[0][1]) && split[1] <= parseInt(corners[1][1])) {
                cell.classList.add('selected')
            } else {
                cell.classList.remove('selected')
            }
        })
    }

    function handleClipboard() {
        if (startCell) {
            const table = document.getElementById(`${project.proj}table`)
            const corners = [ 
                [Math.min(parseInt(startCell[0]), parseInt(endCell[0])), Math.min(parseInt(startCell[1]), parseInt(endCell[1]))],
                [Math.max(parseInt(startCell[0]), parseInt(endCell[0])), Math.max(parseInt(startCell[1]), parseInt(endCell[1]))]
            ]
            const rowLength = corners[1][1] - corners[0][1] + 1
            const selecteds = Array.from(table.getElementsByClassName('selected')).map(x => x.innerHTML)
            const selectedRows = []
            for (let i = 0; i < selecteds.length; i += rowLength) {
                const row = selecteds.slice(i, i + rowLength).join("\t")
                selectedRows.push(row)
            }
            navigator.clipboard.writeText(selectedRows.join("\n")).then(function() {
                handleCancel()
                setCopied(true)
            })
        }
    }

    function handleCancel() {
        const table = document.getElementById(`${project.proj}table`)
        const allCells = Array.from(table.getElementsByClassName('data'))
        startCell = null
        endCell = null
        allCells.forEach((cell) => {
            cell.classList.remove('selected')
        })
        setCopied(false)
    }

    function handleMouseUp(cell) {
        isSelecting = false
        endCell = cell.split("x")
    }
    // end handle copy content

    return (
        <div className="projMasterDiv">
            <div className="tableHead">
                <h3 className="tableCaption">{project.proj}</h3>
                <TableButtons 
                    setShowIdle={setShowIdle} showIdle={showIdle}
                    setWeeksNum={setWeeksNum} weeksNum={weeksNum}
                    setShowRates={setShowRates} showRates={showRates}
                />
            </div>
            <div id="tableOuter">
                <table className="mainTable" id={`${project.proj}table`} ref={tableRef}>
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
                        {tableRows.map((r, ind) => (
                            <tr key={r[0]}>
                                <td className="sticky userName">{r[0]}</td>
                                {showRates ? <td className="rates userRate" style={{left: col2Left}}>${r[1]}</td> : null} 
                                {r.slice((showRates ? 2 : 1), (weeksNum + 1) * (showRates ? 2 : 1)).map((x, i) => (
                                    <td 
                                        key={i} 
                                        id={`${ind}x${i}`}
                                        className={parseFloat(x) > 0 ? "positiveCell data" : "zeroCell data"}
                                        onMouseDown={(e) => handleMouseDown(e.target.id)}
                                        onMouseUp={(e) => handleMouseUp(e.target.id)}
                                        onMouseOver={(e) => handleMouseOver(e.target.id)}
                                        onClick={(e) => handleClick(e.target.id)}
                                    >
                                        {(showRates && i%2 === 1) ? `$${parseFloat(x).toFixed(2)}` : x }
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <th className="sticky">{totalRow[0]}</th>
                            {showRates ? <th className="rates" style={{left: col2Left}}>{totalRow[1]}</th> : null}
                            {totalRow.slice((showRates ? 2 : 1), (weeksNum + 1) * (showRates ? 2 : 1)).map((x, i) => (
                                <th key={-i} className="totalCell">{(showRates && i%2 === 1 && i >= 0) ? `$${parseFloat(x).toFixed(2)}` : x}</th>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <BottomBtns handleClipboard={handleClipboard} handleCancel={handleCancel} copied={copied} proj={project.proj}/>
        </div>
    )
}

export default ProjTable