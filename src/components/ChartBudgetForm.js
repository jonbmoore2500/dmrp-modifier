import React, {useState} from "react"
import DatePicker from 'react-datepicker';

function ChartBudgetForm({setBudgetSettings, defaultVals}) {

    const [budgetForm, setBudgetForm] = useState(defaultVals)

    function handlePlotBudget(e) {
        e.preventDefault();
        setBudgetSettings(budgetForm)
        // add reset after building heads up display in chart itself
        // i've gone overboard with the controlled form. I can't delete back to the first character in the budget field
    }

    function handleFormNumbers(e, field) {
        if (/^\d+$/.test(e.target.value) || e.target.value.length === 0) {
            let newObj = {...budgetForm}
            newObj[field] = e.target.value
            setBudgetForm(newObj)
        }
    }

    return (
        <form onSubmit={handlePlotBudget}>
            <label>
                <input 
                    value={budgetForm.budgetVal}
                    onChange={(e) => handleFormNumbers(e, "budgetVal")}
                    type="text"
                    name="budget"
                    placeholder="$_____"
                />
            </label>
            <label>
                Change Default Project Start Date &#40;optional&#41;
                <DatePicker
                    selected={budgetForm.startDate}
                    onChange={(date) => setBudgetForm({...budgetForm, startDate: date})}
                    dateFormat="MM/dd/yyyy"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    name="date"
                />
            </label>
            <label>
                Project Length &#40;months&#41;
                <input 
                    value={budgetForm.duration}
                    onChange={(e) => handleFormNumbers(e, "duration")}
                    type="text"
                    name="duration"
                />
            </label>
            <button type="submit">Apply Budget</button>
        </form>
    )
}

export default ChartBudgetForm
