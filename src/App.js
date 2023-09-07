import './App.css';
import Header from './components/Header';
import CSVImport from './components/CSVImport';
import ResultTable from './components/ResultTable';
import ExportForm from './components/ExportForm';

function App() {
  
  return (
    <div>
      <Header />
      <CSVImport />
      <ResultTable />
      <ExportForm />
    </div>
  );
}

export default App;
