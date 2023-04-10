import React from "react";
import "../../style/dsmodal.css";

function DeleteRecordModal({ open, onClose, onDelete, recordIndex }) {
  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="delete_record_modal">
          <h2>Delete Record</h2>
          <p>Are you sure you want to delete this record?</p>
          <button onClick={() => onDelete(recordIndex)}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </>
    );
  }
}

export default DeleteRecordModal;
