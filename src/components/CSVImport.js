import React, {useState} from "react"
import processFile from "../custom_hooks/processFile"

function CSVImport({setData}) {

    const [file, setFile] = useState(null)

    const fileReader = new FileReader()

    function handleOnChange(e) {
        setFile(e.target.files[0])
    }

    function handleOnSubmit(e) {
        e.preventDefault()
        if (file) {
            fileReader.onload = function (e) {
                const csvOutput = e.target.result 
                // console.log(processFile(csvOutput))
                setData(processFile(csvOutput))
            }
            fileReader.readAsText(file)
        } else {
            console.log("Please select a file")
        }
    }

    return (
        <div id="importForm">
            <br></br>
            <h4>CSV Import</h4>
            <form onSubmit={(e) => handleOnSubmit(e)}>
                <input 
                    type={"file"} 
                    id={"fileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />
                <button type="submit">
                    Import
                </button>
            </form>
        </div>
    )
}

export default CSVImport