import React from "react";

function Record({ columns }) {
  return (
    <div>
      <div>ColumnLetter initialValue label reference type key</div>
      {columns.map((c) => (
        <div>
          {c.colLetter} {c.initialValue == "" ? "none" : c.initialValue}{" "}
          {c.label ? "true" : "false"}{" "}
          {c.reference == "" ? "false" : c.reference}{" "}
          {c.type == "" ? "no type" : c.type} {c.key ? "true" : "false"}
        </div>
      ))}
    </div>
  );
}

export default Record;
