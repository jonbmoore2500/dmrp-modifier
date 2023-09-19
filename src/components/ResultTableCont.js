import React from "react"
import ProjTable from "./ProjTable"

function ResultTableCont({tableData}) {

    // anything else need to go here? maybe just for styling

    return (
        <div>
            <br></br>
            <div>
                {tableData.map((proj) => (
                    <div key={proj.proj}>
                        <ProjTable project={proj}/>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResultTableCont