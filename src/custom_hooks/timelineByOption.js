import dateMath from "./dateMath"

const months3Ltr = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
}

function timelineByOption(data, option) {
    // console.log(data)

    function getMonth(date) {
        let month = date.slice(0, 2)
        let year = date.slice(6, 8)
        if (date.length > 8 && months3Ltr[month] !== date.slice(8, 11)) {
            month = (parseInt(month) + 1).toString().padStart(2, "0")
        }
        if (month === "13") {
            month = "01"
            year = (parseInt(year) + 1).toString()
        }
        return months3Ltr[month] + " '" + year
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
        let monthData = data.reduce((result, current) => {
            let month = getMonth(current.wk)
            if (!result[month]) {
                result[month] = {wk: month, budget: current.budget}
            } else {
                result[month].budget = current.budget
            }
            return result
        }, [])
        return Object.values(monthData)
    }

    return data
}

export default timelineByOption