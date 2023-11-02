import dateMath from "./dateMath"

const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function timelineByOption(data, option) {

    function getMonth(date, adjust = 0) {
        let month = parseInt(date.slice(0, 2))
        let year = parseInt(date.slice(6, 8))
        if (date.length > 8 && monthsArr[month - 1] !== date.slice(8, 11)) {
            month++
        }
        month = month + 1 + adjust
        if (month > 12) {
            month = month % 12
            year++
        }
        return monthsArr[month - 1] + " '" + year.toString()
    }

    if (option === "week") {
        return data.reduce((result, current, i, arr) => {
            const currentWk = current.wk.slice(0, 8)
            const next = i < arr.length - 1 ? arr[i + 1].wk.slice(0, 8) : null 
            if (currentWk !== next) {
                result.push({...current, wk: dateMath(currentWk)})
            }
            return result
        }, [])
    }

    if (option === "month") {
        let monthData = data.reduce((result, current, i, arr) => {
            let month = getMonth(current.wk)
            if (!result[month]) {
                result[month] = {wk: month, budget: current.budget}
            } else {
                result[month].budget = current.budget
            }
            // if (i === arr.length - 1) {
            //     result[month].wk = current.wk.slice(0, 8)
            // }
            return result
        }, [])
        const zeroMonth = getMonth(data[0].wk, -1)
        return [{wk: zeroMonth, budget: 0}, ...Object.values(monthData)]
    }

    return data
}

export default timelineByOption