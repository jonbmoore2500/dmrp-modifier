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

    function dateMath(date) {
        let day = parseInt(date.slice(3, 5), 10)
        let month = parseInt(date.slice(0, 2), 10)
        let year = parseInt(date.slice(6), 10)

        function handleAdd2(monthDays) {
            const newDay = day + 2
            if (newDay > monthDays) {
                day = newDay - monthDays
                month += 1
            } else {
                day = newDay
            }
        }

        if (month === 2) { // feb
            let daysTotal = 28
            if (year % 4 === 0) { // handles leap years, will break in 2100
                daysTotal += 1
            }
            handleAdd2(daysTotal)
        } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) { // 31 day months
            handleAdd2(31)
        } else { // 30 day months
            handleAdd2(30)
        }

        if (month > 12) {
            month = 1
            year += 1
        }

        return month + "/" + day + "/" + year
    }

    let timesheets = project["timeSheets"].map(ts => [ts, ts]).flat()

    tableHead = ["Users", "Rates", ...timesheets.map((ts) => dateMath(ts.slice(0, 8)) + ts.slice(20))]

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