import React from "react"
import { useNavigate } from "react-router-dom"

function BottomBtns({handleClipboard, handleCancel, copied, proj}) {

    let navigate = useNavigate()
    function routeChange() {
        let path = `/graphs/${proj}`
        navigate(path)
    }

    return (
        <div className="copyBtnsDiv">
            <button onClick={() => handleClipboard()}>Copy to Clipboard</button>
            {copied ? <p>Copied</p> : <p></p>}
            <button onClick={() => handleCancel()}>Cancel Selection</button>
            <button onClick={routeChange}>Graph View</button>
        </div>
    )
}

export default BottomBtns