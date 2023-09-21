function processFile(data) {

    function cutExtraData(data) {
        let splitRows = data.split("\n")
        return splitRows.reduce(function (array, element) {
            if (element.slice(0, 5).includes("-")) { // might need to determine more thorough check on useful rows than this
                let fullSplit = element.replace(/"/g, "").split(",")
                array.push([fullSplit[0], (fullSplit[1] + "," + fullSplit[2]), fullSplit[3], parseFloat(fullSplit[5]), parseFloat(fullSplit[7])])
            }
            return array
        }, [])
    }

    function createProjObj(data) { // absolutely reformat and break out smaller functions, works for the time being
        // make helper function to sort dates - currentyl sorted due to csv format, should still build function
        // make helper alphabetize function

        let totaledArr = []


        // function handleSort(arr, sortBy) {

        // }
        // function handleAdj() {

        // }
        // function handleSheet() {
            
        // }
        // function handleProj() {
            
        // }
        // function handleUser() {

        // }

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

                    if (row[4] > totaledArr[i0]["users"][i1]["rate"]) { // updates rate if needed
                        totaledArr[i0]["users"][i1]["rate"] = row[4]
                    }
                    
                } else { // user does not yet exist in project object, adds user to project object
                    totaledArr[i0]["users"] = [...totaledArr[i0]["users"], {"userName": row[1], "timeSheets": [{"sheetTitle": row[2], "hours": row[3]}], "rate": row[4]}].sort((a, b) => {
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
                totaledArr = [...totaledArr, ({"proj": row[0], "users": [{"userName": row[1], "timeSheets": [{"sheetTitle": row[2], "hours": row[3]}], "rate": row[4]}], "timeSheets": [row[2]]})].sort((a, b) => {
                    if (a["proj"] < b["proj"]) {
                        return -1
                    } else {
                        return 1
                    }
                })
            }
        })
        return totaledArr
    }

    let finalData = createProjObj(cutExtraData(data))

    return finalData
}

export default processFile