import React from "react";

function Record({ records, onDelete, onDetailOpen }) {
  return (
    <div>
      <table>
        <tbody>
          {records.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
              {index !== 0 && (
                <td>
                  <button onClick={() => onDelete(index)}>Delete</button>
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
