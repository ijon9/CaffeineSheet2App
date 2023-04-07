import React, { useState, useEffect } from "react";
import "../../style/dsmodal.css";

function RecordModal({ open, onClose, onSubmit, records }) {
  const [inputs, setInputs] = useState([]);
  const [columnNames, setColumnNames] = useState([]);

  useEffect(() => {
    if (records && records.length > 0) {
      setColumnNames(records[0]);
    }
  }, [records]);

  const handleInputChange = (event, index) => {
    const value = event.target.value;
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(inputs);
    setInputs([]);
    onClose();
  };

  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="add_record_modal">
          <button onClick={onClose}>Close</button>
          <form onSubmit={handleSubmit}>
            {columnNames.map((columnName, index) => (
              <div key={index}>
                <label>
                  {columnName}:
                  <input
                    type="text"
                    value={inputs[index] || ""}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                </label>
              </div>
            ))}
            <button type="submit">Add</button>
          </form>
        </div>
      </>
    );
  }
}

export default RecordModal;
