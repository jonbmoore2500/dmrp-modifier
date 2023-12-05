function addBudgetLine(data, budgetSettings, weekMonth) {
    // {budgetVal: null, startDate: null, duration: 12} - for reference
    let timelineBreakdown = budgetSettings.duration
    if (weekMonth === "week") {
        timelineBreakdown = (52/12) * timelineBreakdown
    }
    const budgetUnitAmount = budgetSettings.budgetVal / timelineBreakdown

    const dateAdjust = budgetSettings.startDate ? budgetSettings.startDate.getDate() / 30 : 0

    let dataWithBudget = data.map((date, i) => {
        return {...date, expected: Math.floor((budgetUnitAmount * i) - (budgetUnitAmount * dateAdjust))}
    })

    return dataWithBudget
}

export default addBudgetLine





// HOLD ONTO THIS FOR A BIT
// function addBudgetLine(data, budgetVal, months) {

//     function handleRemainingDate(finalData, monthsSince) {
//         const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//         const monthInd = monthsArr.findIndex(element => finalData.slice(0, 3) === element)
//         const newMonthInd = [(monthInd + monthsSince)%12]
//         const year = parseInt(finalData.slice(5, 7)) + (newMonthInd < monthInd ? 1 : 0) // need to account for long projects that may hit the same month again
//         return monthsArr[newMonthInd] + " '" + year
//     }

//     function handleRemaining(arr) {
//         const remainingMonths = months + 1 - arr.length
//         let newArr = [...arr]
//         for (let x = 0; x < remainingMonths; x++) {
//             newArr.push({
//                 wk: handleRemainingDate(arr[arr.length-1].wk, x+1),
//                 expected: Math.floor((budgetVal/months)*(x + arr.length))
//             })
//         }
//         return newArr
//     }

//     let newData = data.map((month, i) => {
//         return {...month, expected: Math.floor((budgetVal/months)*i)}
//     }) // adds expected values to months with budget data

//     newData = handleRemaining(newData) // extends expected values into the future for total months of project, including generating date figures for x axis

//     return newData
// }

// export default addBudgetLine