import React from "react";

function ErrorModal({ closeError, incon }) {
  return (
    <>
      <div id="overlay">
        <div id="tv_modal">
          <div>Inconsistency in Datasource</div>
          {incon.map((i) => (
            <div>{i}</div>
          ))}
          <button onClick={closeError}>Close</button>
        </div>
      </div>
    </>
  );
}

export default ErrorModal;
