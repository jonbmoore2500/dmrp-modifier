function processFile(data) {

    // cut extra rows
    // populate object
    // create optional date sort function, can be added into the flow easily later if needed
    // sort names alphabetically

    function cutExtraData(data) {
        return data.split("\n").slice(2, -4).map((row) => {
            let fullSplit = row.split(",")
            return [fullSplit[0], (fullSplit[1] + "," + fullSplit[2]).slice(1, -1), fullSplit[3], parseFloat(fullSplit[5])]
        })
    }

    function createProjObj(data) { // absolutely reformat and break out smaller functions, works for the time being
        // make helper function to sort dates - currentyl sorted due to csv format, should still build function

        let totaledArr = []

        data.forEach((row) => {
            let i0 = totaledArr.findIndex(element => {
                return element["proj"].includes(row[0])
            })
            if (i0 >= 0) { // object with project name exists
                let i1 = totaledArr[i0]["users"].findIndex(element => {
                    return element["userName"].includes(row[1])
                })    
                if (i1 >= 0) { // user exists in project object
                    let i2 = totaledArr[i0]["users"][i1]["timeSheets"].findIndex(element => {
                        return element["sheetTitle"].includes(row[2]) // checks initial match of timesheet
                    }) 

                    if (row[2].includes("Adjusted")) { // catches Adjusted timesheets, includes in that billing week
                        i2 = totaledArr[i0]["users"][i1]["timeSheets"].findIndex(element => {
                            return element["sheetTitle"].includes(row[2].slice(0, 20))
                        }) 
                    }

                    if (i2 >= 0 ) { // timesheet exists, update hours value
                        totaledArr[i0]["users"][i1]["timeSheets"][i2]["hours"] += row[3]
                        if (row[2].includes("Adjusted")) {totaledArr[i0]["users"][i1]["timeSheets"][i2]["sheetTitle"] = row[2]} // changes week to adjusted for a given user if needed
                    } else { // timesheet does not exist, create it
                        totaledArr[i0]["users"][i1]["timeSheets"] = [{"sheetTitle": row[2], "hours": row[3]}, ...totaledArr[i0]["users"][i1]["timeSheets"]]
                    }
                } else { // user does not yet exist in project object, adds user to project object
                    totaledArr[i0]["users"] = [...totaledArr[i0]["users"], {"userName": row[1], "timeSheets": [{"sheetTitle": row[2], "hours": row[3]}]}].sort((a, b) => {
                        if (a["userName"] < b["userName"]) {
                            return -1
                        } else {
                            return 1
                        }
                    })
                }

                if (!row[2].includes("Adjusted") && !totaledArr[i0]["timeSheets"].includes(row[2])) {
                    totaledArr[i0]["timeSheets"] = [row[2], ...totaledArr[i0]["timeSheets"]]
                }
            } else { // object with project name does not yet exist, creates project object with first user and timesheet
                totaledArr.push({"proj": row[0], "users": [{"userName": row[1], "timeSheets": [{"sheetTitle": row[2], "hours": row[3]}]}], "timeSheets": [row[2]]})
            }
        })
        return totaledArr
    }

    let finalData = createProjObj(cutExtraData(data))

    return finalData
}

export default processFile