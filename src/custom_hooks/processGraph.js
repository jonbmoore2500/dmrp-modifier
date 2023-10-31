function processGraph(project) {

    let graphData = []
    let runningTotal = 0

    project.timeSheets.forEach((w) => {
        graphData.unshift({wk: w})
    })

    return graphData.map((week) => {
        let budget = runningTotal
        project.users.forEach((user) => {
            let sheet = user.timeSheets.find((x) => x.sheetTitle === week.wk)
            if (sheet) {
                budget += user.rate * sheet.hours
                runningTotal = budget
            }
        })
        let newObj = {wk: week.wk.slice(0, 8) + week.wk.slice(23, 26), budget: budget}
        return newObj
    })
}

export default processGraph