import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome(props) {
  axios.defaults.withCredentials = true;
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    console.log("handleSubmit(spreadsheetID) == ", inputs.url.split("/")[5]);
    console.log("handleSubmit(range) == ", inputs.sheetIndex);

    // USE AXIOS TO ADD APP TO DATABASE
    axios
      .post("http://localhost:4000/addDataSource", {
        appId: localStorage.currId,
        name: inputs.name,
        url: inputs.url,
        sheetIndex: inputs.sheetIndex,
      })
      .then((response) => {
        navigate("/openApp");
      })
      .catch((error) => {
        console.log(error);
      });
    
    //just to check if i'm getting data from spreadsheet
    // axios
    //   .post("http://localhost:4000/googlesheet", {
    //     url: inputs.url,
    //     range: inputs.sheetIndex,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <div className="container">
      <h1>Create Sheet</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <br />
          <input
            type="text"
            name="name"
            value={inputs.name || ""}
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Sheet Index:
          <br />
          <input
            type="text"
            name="sheetIndex"
            value={inputs.sheetIndex || ""}
            onChange={handleChange}
          />
        </label>
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}

export default AppHome;
