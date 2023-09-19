import React, {useState} from "react"
import './App.css';
import Header from './components/Header';
import CSVImport from './components/CSVImport';
import ResultTableCont from './components/ResultTableCont';
// import ExportForm from './components/ExportForm';

function App() {
  
  const [processedData, setProcessedData] = useState([])


  return (
    <div className="App">
      <Header />
      <CSVImport setData={setProcessedData}/>
      {processedData.length > 0 ? <ResultTableCont tableData={processedData}/> : null}
      {/* <ExportForm /> */}
    </div>
  );
}

export default App;
