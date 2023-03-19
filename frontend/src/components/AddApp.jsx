import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome(props) {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    // USE AXIOS TO ADD APP TO DATABASE
    navigate("/yourapps")
  }
  // todo: show unique users
  // const [email, setEmail] = useState(localStorage.getItem("email"));
  // console.log(email);

  return (
    <div className="container">
    <h1>Create App</h1>
    <form onSubmit={handleSubmit}>
        <label>Name:
        <br/>
        <input
          type="text"
          name="name"
          value={inputs.name || ""}
          onChange = {handleChange}
        />  
        </label>
        <br/>
        <label>Creator:<br/>
          <input 
            type="text"
            name="creator"
            value={inputs.creator || ""}
            onChange = {handleChange}
          />
        </label><br/>
        <label>Rolesheet URL:<br></br>
          <input 
            type="text"
            name="rolesheet"
            value={inputs.rolesheet || ""}
            onChange = {handleChange}
          />
        </label><br/>
        <div onChange={handleChange}>
          <input type="radio" value="yes" name="publish" /> Publish
          <input type="radio" value="no" name="publish" /> Don't Publish
        </div>
        <br/>
        <input type="submit" />
    </form>
    </div>
  );
}

export default AppHome;
