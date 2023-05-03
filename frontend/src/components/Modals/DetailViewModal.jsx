import React from "react";
import { useState,useEffect } from "react";

function DetailViewModal({ open, onClose, recordIndex, onSubmit, edit, editableColumns }) {
  const [editedRecord, setEditedRecord] = useState([]);

  useEffect(() => {
    if (recordIndex) {
      setEditedRecord(recordIndex.row);
    }
  }, [recordIndex]);

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newEditedRecord = [...editedRecord];
    newEditedRecord[index] = value;
    setEditedRecord(newEditedRecord);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (recordIndex) {
      onSubmit(editedRecord);
    }
    onClose();
  };

  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="delete_record_modal">
          <h2>Detail View</h2>
          <form onSubmit={handleSubmit}>
            {recordIndex.heading.map((headings, index) => (
              <div key={headings}>
                <label>
                  {headings}:{" "}
                  {edit ? <input
                    type="text"
                    value={editedRecord[index] || ""}
                    onChange={(event) => handleInputChange(event, index)}
                    disabled={
                      editableColumns !=null &&
                      editableColumns.length >! 0 &&
                      !editableColumns.includes(headings)
                    }
                  /> : editedRecord[index]}
                  
                </label>
              </div>
            ))}
            {edit ? <button type="submit">Save</button> : "" }
            <button onClick={onClose}>Cancel</button>
          </form>
        </div>
      </>
    );
  }
}

export default DetailViewModal;