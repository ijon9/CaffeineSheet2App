import React from "react";
import "../../style/dsmodal.css";
import { useState } from "react";

function TableModal({ open, closetv, onSubmittv }) {
  const clearState = { name: "", datasource: "" };
  const [selectAction, setSelectAction] = useState("");
  const [inputs, setInputs] = useState({ clearState });

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmittv(inputs);
    setInputs(clearState);
  };

  const handleCheck = (event) => {
    const name = event.target.name;
    if(name === "add") {
      const curr = inputs.add;
      if(curr === undefined) { setInputs((values) => ({ ...values, [name] : true })) }
      else { setInputs((values) => ({ ...values, [name] : !curr })) }
    }
    if(name === "edit") {
      const curr = inputs.edit;
      if(curr === undefined) { setInputs((values) => ({ ...values, [name] : true })) }
      else { setInputs((values) => ({ ...values, [name] : !curr })) }
    }
    if(name === "delete") {
      const curr = inputs.delete;
      if(curr === undefined) { setInputs((values) => ({ ...values, [name] : true })) }
      else { setInputs((values) => ({ ...values, [name] : !curr })) }
    }
  };

  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="tv_modal">
          <button onClick={closetv}>close</button>
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
            </label>
            <br />
            <label>
              Data Source:
              <br />
              <input
                type="text"
                name="datasource"
                value={inputs.datasource || ""}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Roles seperated by /:
              <br />
              <input
                type="text"
                name="roles"
                value={inputs.roles || ""}
                onChange={handleInputChange}
              />
            </label>
            {/* <label>
              Columns Names seperated by /:
              <br />
              <input
                type="text"
                name="columns"
                value={inputs.columns || ""}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Filter (Enter Column Name):
              <br />
              <input
                type="text"
                name="filter"
                value={inputs.filter || ""}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              user_filter (Enter Column Name) : 
              <br />
              <input
                type="text"
                name="user_filter"
                value={inputs.user_filter || ""}
                onChange={handleInputChange}
              />
            </label>
            <br /> */}
            <input
              type="checkbox"
              value="add"
              onChange={handleCheck}
              name="add"
            />{" "}
            add
            <input
              type="checkbox"
              value="edit"
              onChange={handleCheck}
              name="edit"
            />{" "}
            edit
            <input
              type="checkbox"
              value="delete"
              onChange={handleCheck}
              name="delete"
            />{" "}
            delete
            <button type="submit">Submit</button>
          </form>
        </div>
      </>
    );
  }
}

export default TableModal;
