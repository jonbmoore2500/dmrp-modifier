import React, {useState} from "react"
import processFile from "../custom_hooks/processFile"

function CSVImport({setData, setTitle}) {

    // turn into modal? just display file title in header?

    const [file, setFile] = useState(null)
    const [error, setError] = useState("")

    const fileReader = new FileReader()

    function handleOnChange(e) {
        setFile(e.target.files[0])
        setError("")
    }

    function handleOnSubmit(e) {
        e.preventDefault()
        if (file) {
            fileReader.onload = function (e) {
                const csvOutput = e.target.result 
                setData(processFile(csvOutput))
            }
            fileReader.readAsText(file)
        } else {
            setData([])
            setTitle("")
            setError("Please select a valid file")
        }
    }

    return (
        <div id="importForm">
            <h4>Import File:</h4>
            <form onSubmit={(e) => handleOnSubmit(e)}>
                <input 
                    type={"file"} 
                    id={"fileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />
                <br></br>
                <div id="submitBtnDiv">
                    <button type="submit" id="fileInputBtn">
                        Import
                    </button>
                    <p>{error}</p>
                </div>
            </form>
        </div>
    )
}

export default CSVImport