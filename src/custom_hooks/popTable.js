import dateMath from "./dateMath"

function popTable(project) {

    let tableHead = []
    let tableRows = []
    let totalRow = ["Totals:", ""]

    function tableHelper(sheet, user) {
        let value = "0"
        const i = user["timeSheets"].findIndex(element => element["sheetTitle"].includes(sheet))    
        if (i >= 0) {
            value = String(user["timeSheets"][i]["hours"])
            if (user["timeSheets"][i]["sheetTitle"].includes("Adjusted")) {
                value = value + " (Adj.)"
            }
        }
        return value
    }

    let timesheets = project["timeSheets"].map(ts => [ts, ts]).flat()

    tableHead = ["User", ...project["timeSheets"].map((ts) => dateMath(ts.slice(0, 8)) + ts.slice(20))]

    tableRows = project["users"].map((user) => {
        return [user["userName"], user["rate"], ...timesheets.map((sheet, i) => {
                let hours = tableHelper(sheet, user)
                if (i%2 === 0) {
                    return hours
                } else {
                    return String(parseFloat(hours) * parseFloat(user["rate"]))
                }
            })]
        })

    tableRows.reduce((prev, next) => next.map((_, i) => (prev[i] || []).concat(next[i])), []).slice(2) // transposes tableRows arr into columns
        .forEach((col) => totalRow.push(col.reduce((sum, num) => sum + parseFloat(num), 0.0))) // sums up each column and pushes to totalRow

    return {"head": tableHead, "rows": tableRows, "totals": totalRow}
}

export default popTable