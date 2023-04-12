import React from "react";
function DetailViewModal({ open, onClose, recordIndex }) {
  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="delete_record_modal">
          <h2>Detail View</h2>
          {recordIndex.heading.map((headings, index) => (
            <div key={headings}>
              {headings} : {recordIndex.row[index]}
            </div>
          ))}
          <button onClick={onClose}>Cancel</button>
        </div>
      </>
    );
  }
}

export default DetailViewModal;
