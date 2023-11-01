import React, {useState} from "react"

const DataContext = React.createContext()

function DataProvider({children}) {

    const [data, setData] = useState([])

    // console.log(data)

    return <DataContext.Provider value={{data, setData}}>{children}</DataContext.Provider>
}

export {DataContext, DataProvider}