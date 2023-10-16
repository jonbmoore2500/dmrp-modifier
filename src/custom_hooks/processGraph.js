function processGraph(project) {
    console.log(project)
    
    let graphData = []
    let runningTotal = 0

    project.timeSheets.toReversed().forEach((w) => graphData.push({wk: w}))

    return graphData.map((week) => {
        // let hrs = 0
        let budget = runningTotal
        for (let i=0; i < project.users.length; i++) {
            let user = project.users[i]
            let sheet = user.timeSheets.find((x) => x.sheetTitle === week.wk)
            if (sheet) {
                // hrs += sheet.hours
                // console.log(sheet.hours)
                budget += user.rate * sheet.hours
                runningTotal = budget
            }
        }
        let newObj = {...week, budget: budget}
        return newObj
    })


    // return graphData
}

export default processGraph


    // const x = [{"wk": 1, "hrs": 3}, {"wk": 2, "hrs": 7}, {"wk": 3, "hrs": 20}, {"wk": 4, "hrs": 21}, {"wk": 5, "hrs": 22}]