import React from "react";
import ReactDOM from 'react-dom';
import { ResultsTable } from "./ResultsTable";

export function ScanButton() {
    
    function generateTable() {        
        // Render results table by passing JSON data
        ReactDOM.render(
            <React.StrictMode>
              <ResultsTable/>
            </React.StrictMode>,
            document.getElementById('resultsTable')
          );
    }

    return (
        <div>
        <button className='scanButton' onClick={() => {generateTable()}}>Scan Matched Bets!</button>
        {/* <button className='scanButton' id='ScanButtonDemo' onClick={() => {generateTable(false)}}>Scan Matched Bets (DEMO)!</button> */}
        </div>
    );
}