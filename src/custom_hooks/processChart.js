import byOption from "./byOption"

function processChart(project, weekMonth) {

    let teamData = []
    let usersData = []

    let userTotals = {} // initiate empty obj
    project.users.forEach((u) => { // add each user to obj w/ name as key and 0 as value (to be adjusted later)
        userTotals[u.userName] = 0
    })

    for (let i = project.timeSheets.length - 1; i >= 0; i--) { // iterate through timesheets backwards, ie. chronological
        let runningTotal = 0 // track total to date across multiple users
        project.users.forEach((u) => { // iterate through users
            const sheet = u.timeSheets.find((x) => x.sheetTitle === project.timeSheets[i]) // find timesheet obj
            let budgToDate = userTotals[u.userName] // given user's total to date
            if (sheet) { // if sheet, handles new data object to array
                const budgTotal = (sheet.hours * u.rate) + budgToDate
                const data = {date: project.timeSheets[i], user: u.userName, budget: budgTotal}
                usersData.push(data)
                userTotals[u.userName] = budgTotal
                runningTotal += budgTotal
            } else { // if no sheet, still adds user's budget to running total and obj to usersData with no budget change
                runningTotal += budgToDate
                const data = {date: project.timeSheets[i], user: u.userName, budget: budgToDate}
                usersData.push(data)
            }
        })
        teamData.push({date: project.timeSheets[i], budget: runningTotal})
    }

    [teamData, usersData] = byOption(teamData, usersData, weekMonth)

    return [teamData, usersData] 
}

export default processChart