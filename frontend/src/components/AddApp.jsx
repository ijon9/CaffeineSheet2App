import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome(props) {
  axios.defaults.withCredentials = true;
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/getUser")
      .then((response) => {
        setUser(response.data.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  inputs.creator = user;

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "creator") {
      setInputs((values) => ({ ...values, [name]: user }));
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    // USE AXIOS TO ADD APP TO DATABASE
    axios
      .post("http://localhost:4000/addApp", {
        name: inputs.name,
        creator: inputs.creator,
        rolesheet: inputs.rolesheet,
        publish: inputs.publish,
      })
      .then((response) => {
        navigate("/yourapps");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <h1>Create App</h1>
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
          Creator:
          <br />
          <input
            type="text"
            name="creator"
            value={inputs.creator || ""}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Rolesheet URL:<br></br>
          <input
            type="text"
            name="rolesheet"
            value={inputs.rolesheet || ""}
            onChange={handleChange}
          />
        </label>
        <br />
        <div onChange={handleChange}>
          <input type="radio" value="yes" name="publish" /> Publish
          <input type="radio" value="no" name="publish" /> Don't Publish
        </div>
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}

export default AppHome;
