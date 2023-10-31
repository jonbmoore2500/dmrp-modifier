import dayjs from "dayjs"

function timelineSlice(data, timeline) {
   
    const today = dayjs()
    let startDate = ""

    switch (timeline) {
        case "year":
            startDate = today.subtract("1", "year")
            break;
        case "ytd":
            startDate = today.set("month", 0).set("date", "1")
            break;
        case "quar":
            const curMonth = today.month() + 1
            let newMonth = curMonth - (curMonth % 3) + 1
            startDate = today.set("month", newMonth - 1).set("date", 1)
            break;
        case "month":
            startDate = today.subtract("1", "month")
            break;
        default:
            return data
    }
    
    if (startDate < dayjs(data[0].wk.slice(0, 8))) {
        // if start date is before the data starts, return full data
        return data
    } else {
        let startInd = data.findIndex(element => startDate.diff(dayjs(element.wk.slice(0, 8))) < 7 ) - 1

        if (startInd === -2) {
            // no data within time frame. example: going by most recent month but data ends before that point
            return "invalid"
        } else {
            // adjust data to fit timeframe based on 
            return data.slice(startInd, data.length)
        }
    }
}

export default timelineSlice