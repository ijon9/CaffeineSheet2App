import React from "react";
import "../../style/dsmodal.css";
import { useState, useEffect } from "react";

function AddDetailViewModal({ open, closedv, onSubmitdv, allColumns }) {
  const clearState = { name: "", roles: "", editable: "" };
  const [inputs, setInputs] = useState({ clearState });
  const [colArr, setColArr] = useState([]);

  const resetColArr = () => {
    var arr = [];
    for(var i=0; i<allColumns.length; i++) {
      arr[i] = true;
    }
    setColArr(arr);
  }

  useEffect(() => {
    resetColArr();
  }, []);

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    var data = { inputs: inputs, colArr : colArr };
    onSubmitdv(data);
    setInputs(clearState);
    resetColArr();
  };

  const handleCheck = (event) => {
    const ind = event.target.value;
    var colArrCopy = JSON.parse(JSON.stringify(colArr));
    colArrCopy[ind] = !colArrCopy[ind];
    setColArr(colArrCopy);
  };

  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="tv_modal">
          <button onClick={closedv}>close</button>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <br />
              <input
                type="text"
                name="name"
                value={inputs.name || ""}
                onChange={handleInputChange}
              />
            </label> <br/>
            <ol>
            {allColumns.map((c, ind) => (
            <li>
              {c.name}  
              {colArr[ind] ? 
              <input
                type="checkbox"
                value={ind}
                onChange={handleCheck}
                name="col"
                defaultChecked
              />
              : <input
                type="checkbox"
                value={ind}
                onChange={handleCheck}
                name="col"
              />
              }
              
            </li>
            ))}</ol><br/>
            <label>
              Roles seperated by /:
              <br />
              <input
                type="text"
                name="roles"
                value={inputs.roles || ""}
                onChange={handleInputChange}
              />
            </label><br/>
            <label>
              Edit filter column name:
              <br />
              <input
                type="text"
                name="editFilter"
                value={inputs.editFilter || ""}
                onChange={handleInputChange}
              />
            </label><br/>
            <label>
              Editable columns seperated by /:
              <br />
              <input
                type="text"
                name="editable"
                value={inputs.editable || ""}
                onChange={handleInputChange}
              />
            </label><br/>
            <button type="submit">Submit</button>
          </form>
        </div>
      </>
    );
  }
}

export default AddDetailViewModal;
