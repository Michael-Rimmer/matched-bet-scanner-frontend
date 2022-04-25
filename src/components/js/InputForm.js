import React from "react";
import ReactDOM from 'react-dom';
import { HelpOverlay } from "./HelpOverlay";
import { ScanButton } from "./ScanButton";

export function InputForm() {
    
    return (
        <>
        {/* <form>
            <label for='normalBetRadio'>Normal Bet</label>
            <input type='radio' id='normalBetRadio' name='betType' value='normal' checked/>
            <br/>
            <label for='snrBetRadio'>SNR Bet</label>
            <input type='radio' id='snrBetRadio' name='betType' value='snr'/>
            <br/>
            <label for="backStakeRadio">Back stake:</label>
            <input type="number" id="backStakeRadio" name="backStake" min="0"></input>
        </form> */}

        <div className="sidebyside"><ScanButton/></div>
        {/* <div class="sidebyside"><HelpOverlay/></div> */}
        
        </>
    );
}

// if back stake is updated then re-render table but only if table is already displayed. 
// but dont rescan when rerendering (only scan when button is pressed)