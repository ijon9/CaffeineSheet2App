import React from "react";
import "../../style/dsmodal.css";
import { useState } from "react";
function DatasourceModal({ open, closeDS, onSubmitds }) {
  const clearState = { name: "", url: "" };
  const [inputs, setInputs] = useState({ clearState });

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitds(inputs);
    setInputs(clearState);
  };
  if (!open) {
    return null;
  } else {
    return (
      <>
        <div id="overlay" />
        <div id="ds_modal">
          <button onClick={closeDS}>close</button>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <br />
              <input
                type="text"
                name="name"
                value={inputs.name || ""}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Data Source URL:
              <br />
              <input
                type="text"
                name="url"
                value={inputs.url || ""}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Key (use letter columns):
              <br />
              <input
                type="text"
                name="key"
                value={inputs.key || ""}
                onChange={handleInputChange}
              />
            </label>
            <br />

            <button type="submit">Submit</button>
          </form>
        </div>
      </>
    );
  }
}

export default DatasourceModal;
