import React from "react";

function Record({ records }) {
  return (
    <div>
      <table>
        <tbody>
          {records.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Record;
