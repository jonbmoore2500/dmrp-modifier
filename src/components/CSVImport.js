import React, {useState, useContext} from "react"
import processFile from "../custom_hooks/processFile"
import { DataContext } from "../contexts/DataContext"

function CSVImport() {

    const [file, setFile] = useState(null)
    const [error, setError] = useState("")
    const {setData} = useContext(DataContext)

    const fileReader = new FileReader()

    function handleOnChange(e) {
        setFile(e.target.files[0])
        setError("")
    }

    function handleOnSubmit(e) {
        e.preventDefault()
        if (file) {
            fileReader.onload = function (e) {
                const data = processFile(e.target.result)
                setData(data)
            }
            fileReader.readAsText(file)
        } else {
            setData([])
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