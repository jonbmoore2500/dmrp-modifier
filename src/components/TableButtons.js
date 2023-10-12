import React from "react"

function TableButtons({setShowIdle, showIdle, setWeeksNum, weeksNum, setShowRates, showRates}) {

    function handleReset() {
        setWeeksNum(4)
        setShowIdle(false)
        setShowRates(false)
    }

    return (
        <div className="buttonContainer">
            <div className="buttonDiv" id="btn1">
                <label>Toggle Idles?  </label>
                <button onClick={() => setShowIdle(!showIdle)}>{!showIdle ? "Show" : "Hide"}</button>
            </div>
            <div className="buttonDiv" id="btn2">
                <label>More Weeks?  </label>
                <button onClick={() => setWeeksNum(weeksNum + 3)}>More</button>
            </div>
            <div className="buttonDiv" id="btn3">
                <label>Show Rates?  </label>
                <button onClick={() => setShowRates(!showRates)}>{!showRates ? "Show" : "Hide"}</button>
            </div>
            <div className="buttonDiv" id="btn4">
                <label>Reset  </label>
                <button onClick={() => handleReset()}>Reset</button>
            </div>
        </div>
    )
}

export default TableButtons