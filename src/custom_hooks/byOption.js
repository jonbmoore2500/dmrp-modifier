import dateMath from "./dateMath"

const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function byOption(teams, users, option) {

    const userCount = users.length / teams.length

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

    function handleMinus1Week(date) {
        let [month, day, year] = date.split("/")

        if (day < 8) {
            let newDay = day - 7
            month = month - 1
            if (month < 1) {
                month = 12
                year -= 1
            }
            let daysTotal = 28
            if (month === 2) { // feb
                if (year % 4 === 0) { // leap year
                    daysTotal += 1
                }
            } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) { // 31 day months
                daysTotal = 31
            } else { // 30 day months
                daysTotal = 30
            }
            day = daysTotal + newDay
        } else {
            day -= 7
        }

        return month + "/" + day + "/" + year
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
                result.push({...current, date: dateMath(currentWk)})
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
        const zeroWeek = handleMinus1Week(teams[0].date)
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