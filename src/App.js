import React from "react";
import "./App.css";
import Plate from "./component/plate/Plate";

function App() {
  return (
    <div className="App">
      <Plate item="60A001AA" />
      {/* <Plate item="00000AAA" />
      <Plate item="CMD0000" />
      <Plate item="D000000" />
      <Plate item="T000000" />
      <Plate item="X000000" />
      <Plate item="UN0000" />
      <Plate item="00H000000" />
      <Plate item="00M000000" /> */}
    </div>
  );
}

export default App;
