import React from "react"

function BottomBtns({handleClipboard, handleCancel, copied}) {

    return (
        <div className="copyBtnsDiv">
            <button onClick={() => handleClipboard()}>Copy to Clipboard</button>
            {copied ? <p>Copied</p> : <p></p>}
            <button onClick={() => handleCancel()}>Cancel Selection</button>
        </div>
    )
}

export default BottomBtns