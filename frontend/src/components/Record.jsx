import React from "react";

function Record({ records, onDelete, onDetailOpen, del }) {
  return (
    <div>
      <table border="2px">
        <tbody>
          {records.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
              {index !== 0 && (
                <td>
                  {/* <button onClick={() => onDelete(index)}>Delete</button> */}
                  {(() => {
                    if (del) {
                      return (
                        <button onClick={() => onDelete(index)}>Delete</button>
                      );
                    } else {
                      return "";
                    }
                  })()}
                  <button onClick={() => onDetailOpen(index)}> Detail </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Record;
