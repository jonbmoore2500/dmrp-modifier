function processFile(data) {

    function cutExtraData(data) {
        let splitRows = data.split("\n")
        return splitRows.reduce(function (array, element) {
            if (element.slice(0, 5).includes("-")) {
                let fullSplit = element.replace(/"/g, "").split(",")
                array.push([fullSplit[0], (fullSplit[1] + "," + fullSplit[2]), fullSplit[3], parseFloat(fullSplit[5]), parseFloat(fullSplit[7])])
            }
            return array
        }, [])
    }

    function createProjObjs(rowsArr) {
        let projObjs = []

        function handleSort(arr, sortBy) {
            return arr.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1
                } else {
                    return 1
                }
            })
        }
        function handleSheet(row, projI, userI) {
            const i = projObjs[projI]["users"][userI]["timeSheets"].findIndex(element => {
                return element["sheetTitle"].includes(row[2].replace(" [Adjusted]", ""))
            })
            if (i >= 0 ) { // timesheet for user in proj exists, update hours
                projObjs[projI]["users"][userI]["timeSheets"][i]["hours"] += row[3]
                if (row[2].includes("Adjusted")) {projObjs[projI]["users"][userI]["timeSheets"][i]["sheetTitle"] = row[2]} // changes week to adjusted for a given user if needed
            } else { 
                projObjs[projI]["users"][userI]["timeSheets"] = [{"sheetTitle": row[2], "hours": row[3]}, ...projObjs[projI]["users"][userI]["timeSheets"]]
            }
            projObjs[projI]["users"][userI]["rate"] = [projObjs[projI]["users"][userI]["rate"], row[4]].sort(function (a, b) {return b-a})[0] // checks for higher rate, reassigns if needed
        }
        function handleUser(row, projI) {
            const userI = projObjs[projI]["users"].findIndex(element => {
                return element["userName"].includes(row[1])
            }) 
            if (userI >= 0) { // user exists in proj, move to timeSheet
                handleSheet(row, projI, userI)
            } else {
                projObjs[projI]["users"] = handleSort([...projObjs[projI]["users"], {"userName": row[1], "timeSheets": [{"sheetTitle": row[2], "hours": row[3]}], "rate": row[4]}], "userName")
            }
        }
        function handleProj(row) {
            const projI = projObjs.findIndex(element => {
                return element["proj"].includes(row[0])
            })
            if (projI >= 0) { // proj exists, move to user
                handleUser(row, projI)
                if (!row[2].includes("Adjusted") && !projObjs[projI]["timeSheets"].includes(row[2])) {
                    projObjs[projI]["timeSheets"] = [row[2], ...projObjs[projI]["timeSheets"]]
                }
            } else {
                projObjs = handleSort([...projObjs, ({"proj": row[0], "users": [{"userName": row[1], "timeSheets": [{"sheetTitle": row[2], "hours": row[3]}], "rate": row[4]}], "timeSheets": [row[2]]})], "proj")
            }
        }

        rowsArr.forEach((row) => {
            handleProj(row) // starts function chain, see above
        })
        return projObjs
    }

    return createProjObjs(cutExtraData(data))
}

export default processFile