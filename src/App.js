import React, {useContext} from "react"
import {BrowserRouter, Routes, Route, redirect} from "react-router-dom"
import {Outlet, NavLink} from "react-router-dom"
import './App.css';
import { DataContext } from "./contexts/DataContext";
import Header from './components/Header';
import CSVImport from './components/CSVImport';
import ResultTableCont from './components/ResultTableCont';
import GraphsLayout from "./components/GraphsLayout";
import GraphContainer from "./components/GraphContainer";

function App() {
  
  const {data} = useContext(DataContext)


  return (
    <div className="App">
      <div id="appHeader">
        <Header />
        <CSVImport/>
      </div>
      <div id="headerLineBreak"></div>
      <div id="appContentDiv">
        {data.length > 0 ? 
        <BrowserRouter>
          <div id="navLinkDiv">
            <NavLink to="/" className="topNavLink">Tables</NavLink>
            <NavLink to="/graphs" className="topNavLink">Graphs</NavLink>
          </div>
          <Routes>
            <Route exact path="/" element={<ResultTableCont tableData={data}/> } />
            <Route path="/graphs" element={<GraphsLayout />}>
              <Route path="/graphs:proj" element={<GraphContainer />} />
            </Route>
            {/* <Route path="/budget" element={<BudgetLayout />} >
              <Route path="/budget:proj" element={<BudgetContainer />} />
            </Route> */}
          </Routes>
        </BrowserRouter>
        : null}
      </div>
    </div>
  );
}

export default App;
