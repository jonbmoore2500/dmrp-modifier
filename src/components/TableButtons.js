import React from "react"

function TableButtons({setShowIdle, showIdle, setWeeksNum, weeksNum, setShowRates, showRates}) {



    function handleReset() {
        setWeeksNum(4)
        setShowIdle(false)
        setShowRates(false)
    }

    return (
        <div className="buttonContainer">
            <div className="buttonDiv">
                <label>Toggle Idles?  </label>
                <button onClick={() => setShowIdle(!showIdle)}>{!showIdle ? "Show" : "Hide"}</button>
            </div>
            <div className="buttonDiv">
                <label>More Weeks?  </label>
                <button onClick={() => setWeeksNum(weeksNum + 3)}>More</button>
            </div>
            <div className="buttonDiv">
                <label>Show Rates?  </label>
                <button onClick={() => setShowRates(!showRates)}>{!showRates ? "Show" : "Hide"}</button>
            </div>
            <div className="buttonDiv">
                <label>Reset  </label>
                <button onClick={() => handleReset()}>Reset</button>
            </div>
        </div>
    )
}

export default TableButtons