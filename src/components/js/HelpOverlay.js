import React, {useState} from "react";
import { HelpInstructions } from "./HelpInstructions";

export function HelpOverlay() {
    const [modalVisible, setModalVisible] = useState(false);
    return (
      <div className="App">
        <button onClick={() => setModalVisible(true)}>Open Overlay</button>
        <HelpInstructions
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </div>
    );
}