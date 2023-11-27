function processFile(data) {

    function cutExtraData(data) {
        let splitRows = data.split("\n")
        return splitRows.reduce(function (array, element) {
            if (element.slice(0, 5).includes("-")) {
                let fullSplit = element.replace(/"/g, "").split(",")
                if (!fullSplit[3].includes("Declined")) {
                    array.push([fullSplit[0], (fullSplit[1] + "," + fullSplit[2]), fullSplit[3], parseFloat(fullSplit[5]), parseFloat(fullSplit[7]), fullSplit[9]])
                }
            }
            return array
        }, [])
    }

    function createProjectObjectss(rowsArr) {
        
        function handleSort(arr, sortBy) {
            return arr.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1
                } else {
                    return 1
                }
            })
        }

        return rowsArr.reduce((resultArr, row) => {
            const [projectName, userName, sheetTitle, hours, rate, role] = row
            // prevent sorting for every row, checks to see if updates that might require sorting are made
            // only ever needed if proj or user don't exist yet. still checks again at the end, only needed if array.length > 1
            let sortProjs = false 
            let sortUsers = false
            
            let projIndex = resultArr.findIndex((projObj) => projObj.proj.includes(projectName))
            if (projIndex === -1) {
                resultArr.push({ proj: projectName, users: [], timeSheets: [] })
                projIndex = resultArr.length - 1
                sortProjs = true
            }
            let userIndex = resultArr[projIndex].users.findIndex((user) => user.userName.includes(userName));
            if (userIndex === -1) {
                resultArr[projIndex].users.push({ userName, timeSheets: [], rate, role })
                userIndex = resultArr[projIndex].users.length - 1
                sortUsers = true
            }
            const tsUserIndex = resultArr[projIndex].users[userIndex].timeSheets.findIndex(
                (timeSheet) => timeSheet.sheetTitle.includes(sheetTitle.replace(" [Adjusted]", ""))
            )
            if (tsUserIndex >= 0) {
                resultArr[projIndex].users[userIndex].timeSheets[tsUserIndex].hours += hours
                if (sheetTitle.includes('Adjusted')) {
                    resultArr[projIndex].users[userIndex].timeSheets[tsUserIndex].sheetTitle = sheetTitle
                }
            } else {
                const tsProjIndex = resultArr[projIndex].timeSheets.findIndex(
                    (timeSheet) => timeSheet === sheetTitle.replace(" [Adjusted]", "")
                )
                resultArr[projIndex].users[userIndex].timeSheets.unshift({ sheetTitle, hours });
                if (tsProjIndex === -1) {
                    resultArr[projIndex].timeSheets.unshift(sheetTitle)
                }
            }  
            resultArr[projIndex].users[userIndex].rate = Math.max(rate, resultArr[projIndex].users[userIndex].rate)
            if (sortUsers && resultArr[projIndex].users.length > 1) {
                resultArr[projIndex].users = handleSort(resultArr[projIndex].users, "userName")
            }
            if (sortProjs && resultArr.length > 1) {
                resultArr = handleSort(resultArr, "proj")
            }
            return resultArr
        }, [])                  
    }

    return createProjectObjectss(cutExtraData(data))
}

export default processFile