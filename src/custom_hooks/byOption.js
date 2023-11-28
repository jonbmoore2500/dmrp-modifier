import dateMath from "./dateMath"

const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function byOption(teams, users, option) {

    const userCount = users.length / teams.length

    function getMonth(date, adjust = 0) {
        let month = parseInt(date.slice(0, 2)) // 1 based month num. 1 = jan, 2 = feb...
        let year = parseInt(date.slice(6, 8))// self explanatory
        if (date.length > 20 && monthsArr[month - 1] !== date.slice(23, 26)) { // if date is partial week and should be the next month, add 1 to month. date long enough to include month name, that month doesn't match months arr
            month++
        }
        month = month + adjust 
        if (month >= 12) {
            month = month % 12
            year++
        } else if (month < 1) {
            month += 12
            year--
        }
        return `${monthsArr[month]} '${year.toString()}`
    }

    function addZero(teamData, usersData, zero) {
        teamData = [{date: zero, budget: 0}, ...teamData]
        const usersSubset = [...usersData.slice(0, userCount)].map((x) => {
            return {...x, budget: 0, date: zero}
        })
        usersData = [...usersSubset, ...usersData]
        return [teamData, usersData]
    }

    function weekHelper(data, indexDiff) {
        return data.reduce((result, current, i, arr) => {
            const currentWk = current.date.slice(0, 8)
            const next = i + indexDiff <= arr.length - 1 ? arr[i + indexDiff].date.slice(0, 8) : null 
            if (currentWk !== next) {
                result.push({...current, date: dateMath(currentWk, 9)})
            }
            return result
        }, [])
    }

    function monthHelper(data, hasUser) {
        return data.reduce((result, current) => {
            let month = getMonth(current.date)
            let key = hasUser ? month + current.user : month
            if (!result[key]) {
                result[key] = hasUser
                ? { date: month, user: current.user, role: current.role, budget: current.budget }
                : { date: month, budget: current.budget }
            } else {
                result[key].budget = current.budget
            }
            return result
        }, [])
    }

    if (option === "week") {
        teams = weekHelper(teams, 1)
        users = weekHelper(users, userCount)
        const zeroWeek = dateMath(teams[0].date, -7)
        return addZero(teams, users, zeroWeek)
    }

    if (option === "month") {
        const zeroMonth = getMonth(teams[0].date, -1) 
        teams = [...Object.values(monthHelper(teams, false))]
        users = [...Object.values(monthHelper(users, true))]
        return addZero(teams, users, zeroMonth)
    }
}

export default byOption