import React, { useState, useRef, useEffect } from "react";

import "../plate/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const Formats = [
  /^([0-9_]){2}[a-zA-Z_]{1}([0-9_]){3}[a-zA-Z_]{2}$/g, // 00 A 000 AA
  /^([0-9_]){5}[a-zA-Z_]{3}$/g, // 00 000 AAA
  /^(C|\_)(M|\_)(D|\_)([0-9_]){4}$/g, // CMD 00-00
  /^(D|\_)([0-9_]){6}$/g, // D 000000
  /^(T|\_)([0-9_]){6}$/g, // T 000000
  /^(X|\_)([0-9_]){6}$/g, // X 000000
  /^(U|\_)(N|\_)([0-9_]){4}$/g, // UN 0000
  /^([0-9_]){2}(H|\_)([0-9_]){6}$/g, // 00 H 000000
  /^([0-9_]){2}(M|\_)([0-9_]){6}$/g // 00 M 000000
  // /^(1|\_)(0|\_)(T|\_)(Z|\_)([0-9_]){3}$/g,    // 10 TZ 000
  // /^(1|\_)(8|\_)(M|\_)(X|\_)([0-9_]){3}$/g    // 10 MX 000
];

const Templates = [
  "00A000AA",
  "00000AAA",
  "CMD0000",
  "D000000",
  "T000000",
  "X000000",
  "UN0000",
  "00H000000",
  "00M000000"
  // '10TZ000',
  //'18MX000'
];

const Colors = [
  { backgroundColor: "#FFFFFF", color: "#000000" },
  { backgroundColor: "#FFFFFF", color: "#000000" },
  { backgroundColor: "#22B14C", color: "white", textAlign: "center" },
  { backgroundColor: "#22B14C", color: "white", textAlign: "center" },
  { backgroundColor: "#22B14C", color: "white", textAlign: "center" },
  { backgroundColor: "#22B14C", color: "white", textAlign: "center" },
  { backgroundColor: "#3F48CC", color: "white", textAlign: "center" },
  { backgroundColor: "#FFC913", color: "black" },
  { backgroundColor: "#FFC913", color: "black" }
];
String.prototype.splice = function(idx, str) {
  return this.slice(0, idx) + str + this.slice(idx);
};

const Plate = ({ item }) => {
  const [carNumber, setCarNumber] = useState("");
  const [tmpNumber, setTmpNumber] = useState("");
  const [type, setType] = useState(0);
  const [isTemp, setTemp] = useState(false); // setting the template
  const [vLine, setVLine] = useState(true); //Vertical Line Visibility
  const [iconVisibility, setIconVisibility] = useState(true); //Coutry icon visiblity

  const [startSelection, setStart] = useState(0);
  const [endSelection, setEnd] = useState(1);
  const input = useRef();

  useEffect(() => {
    input.current.focus();
    input.current.setSelectionRange(startSelection, endSelection);
  });

  useEffect(() => {
    let cn = parseFormat(item);
    setCarNumber(cn);
  }, [item]);

  const isTemplate = cn => {
    let t_cn = cn.toUpperCase().replace(/\s|\-/g, "");
    console.log(t_cn);
    for (let i = 0; i < Templates.length; i++)
      if (t_cn === Templates[i]) return true;
    return false;
  };

  const isValid = cn => {
    return cnFormat(cn) !== -1;
  };

  const cnFormat = cn => {
    if (cn === undefined) return -1;
    let t_cn = cn.toUpperCase().replace(/\s|\-/g, "");
    for (let i = 0; i < Formats.length; i++) {
      if (t_cn.match(Formats[i]) !== null) return i;
    }
    return -1;
  };

  const parseFormat = cn => {
    let i = cnFormat(cn);
    setType(i);
    switch (i) {
      case 0:
        setIconVisibility(true);
        setVLine(true);
        return cn
          .splice(6, " ")
          .splice(3, " ")
          .splice(2, "  ");
      case 1:
        return cn.splice(5, " ").splice(2, "  ");
      case 2:
        setIconVisibility(false);
        setVLine(false);
        return cn.splice(5, "-").splice(3, " ");
      case 3:
        setIconVisibility(false);
        setVLine(false);
        return cn.splice(1, " ");
      case 4:
        setIconVisibility(false);
        setVLine(false);
        return cn.splice(1, " ");
      case 5:
        setIconVisibility(false);
        setVLine(false);
        return cn.splice(1, " ");
      case 6:
        setIconVisibility(false);
        setVLine(false);
        return cn.splice(2, " ");
      case 7:
        setIconVisibility(false);
        setVLine(true);
        return cn.splice(3, " ").splice(2, "  ");
      case 8:
        setIconVisibility(false);
        setVLine(true);
        return cn.splice(3, " ").splice(2, "  ");
      default:
        setIconVisibility(false);
        setVLine(false);
        return cn;
    }
  };

  const focusPlate = el => {
    el.focus();
    selectChar(el);
  };

  const selectChar = (el, isRight) => {
    if (isRight === true) {
      for (var i = el.selectionEnd; i < el.value.length; i++) {
        if (el.value[i] !== " " && el.value[i] !== "-") {
          el.setSelectionRange(i, i + 1);
          setStart(i);
          setEnd(i + 1);
          break;
        }
      }
    } else if (isRight === false) {
      for (var i = el.selectionStart; i > 0; i--) {
        if (el.value[i - 1] !== " " && el.value[i - 1] !== "-") {
          el.setSelectionRange(i - 1, i);
          setStart(i - 1);
          setEnd(i);
          break;
        }
      }
    }
  };

  const handle = event => {
    event.preventDefault();
    if (event.keyCode === 39 || event.keyCode === 37) {
      if (event.keyCode === 39) {
        selectChar(input.current, true);
        event.preventDefault();
      } else if (event.keyCode === 37) {
        selectChar(input.current, false);
        event.preventDefault();
      }
    } else if (
      (event.keyCode >= 48 && event.keyCode <= 90) ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    ) {
      let char = carNumber[input.current.selectionStart];
      if (isNumeric(char) && isNumeric(event.key)) {
        console.log(char);
        let str = setCharAt(carNumber, input.current.selectionStart, event.key);
        setCarNumber(str);
      } else if (isLetter(char) && isLetter(event.key)) {
        let str = setCharAt(carNumber, input.current.selectionStart, event.key);
        setCarNumber(str);
      }
    } else if (event.keyCode === 112) {
      if (type === cnFormat(carNumber) && isTemp) {
        parseFormat(carNumber);
        setTemp(false);
      } else if (type === Templates.length - 1) {
        setTmpNumber(parseFormat(Templates[0]));
        setTemp(true);
      } else {
        setTmpNumber(parseFormat(Templates[type + 1]));
        setTemp(true);
      }
    } else {
      focusPlate(input.current);
      event.preventDefault();
    }
  };

  const isLetter = str => {
    return str.length === 1 && str.match(/[a-z]/i);
  };
  const isNumeric = str => {
    return /^\d+$/.test(str);
  };

  const setCharAt = (str, index, chr) => {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  };

  const classVLine = vLine ? "vertical-line" : "vertical-line none";
  const classIcon = iconVisibility ? "country-icon" : "country-icon none";

  return (
    <div className="container-fluid mt-5">
      <div className="plate">
        <div className={classVLine}></div>
        <div className={classIcon}>UZ</div>

        <input
          onDragStart={() => {
            return false;
          }}
          onDrop={() => {
            return false;
          }}
          type="text"
          spellCheck={false}
          className="form-control"
          maxLength={12}
          id="car_number"
          name="number_plate"
          defaultValue={isTemp ? tmpNumber : carNumber}
          onKeyDown={handle}
          onMouseDown={handle}
          ref={input}
          style={Colors[type]}
        />
      </div>
    </div>
  );
};

export default Plate;
