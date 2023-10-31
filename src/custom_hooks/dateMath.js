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

export default dateMath