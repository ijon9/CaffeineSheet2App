import React from "react";

function DSColumn({ columns }) {
  return (
    <div>
      <table border="2px">
        <tr>
          <th>ColumnLetter</th>
          <th>initialValue</th>
          <th>label</th>
          <th>reference</th>
          <th>type</th>
          <th>key</th>
        </tr>
        {columns.map((c) => (
        <tr>
          <td>{c.colLetter}</td>
          <td>{c.initialValue === "" ? "none" : c.initialValue}</td>
          <td>{c.label ? "true" : "false"}</td>
          <td>{c.reference === "" ? "false" : c.reference}</td>
          <td>{c.type === "" ? "no type" : c.type}</td>
          <td>{c.key ? "true" : "false"}</td>
        </tr>
      ))}
      </table>
    </div>
  );
}

export default DSColumn;
