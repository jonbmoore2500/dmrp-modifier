import React, {useState, useEffect} from "react"

const DataContext = React.createContext()

function DataProvider({children}) {

    const [data, setData] = useState([])

    useEffect(() => {
        const jsonData = localStorage.getItem("dmrpCsvData")
        if (jsonData) {
            const {data, expiry} = JSON.parse(jsonData)
            // console.log("data", data)
            if (new Date().getTime() <= expiry) {
                setData(data)
            } else {
                localStorage.removeItem("dmrpCsvData")
                console.log("Data expired")
            }
        }
    }, [])

    // console.log(data)

    return <DataContext.Provider value={{data, setData}}>{children}</DataContext.Provider>
}

export {DataContext, DataProvider}