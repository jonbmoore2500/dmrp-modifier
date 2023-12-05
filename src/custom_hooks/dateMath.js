function dateMath(date, daysDifference = 0) {

    let [month, day, year] = date.split("/").map(element => parseInt(element)) 
    const newDay = day + daysDifference 

    if (newDay < 1) { // check needs to count back 1 month. must be done in advance to get new month value for calculating total days in month
        month--
        if (month < 1) {
            month = 12
            year--
        }
    } 

    function handleAdd(monthDays) {
        if (newDay < 1) {
            day = monthDays + newDay
            // already handled decrement month/year
        } else if (newDay > monthDays) {
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
        handleAdd(daysTotal)
    } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) { // 31 day months
        handleAdd(31)
    } else { // 30 day months
        handleAdd(30)
    }

    if (month > 12) {
        month = 1
        year++
    }

    return month + "/" + day + "/" + year
}

export default dateMath