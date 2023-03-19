import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome(props) {
  const navigate = useNavigate();
  function addApp() {
    navigate("/addApp")
  }
  // todo: show unique users
  const [email, setEmail] = useState(localStorage.getItem("email"));
  console.log(email);
  return (
    <div className="container">
      <div>hello user {email}</div>
      <div>My Apps</div>
      <button onClick={addApp}>+ Create App</button>
      <div>Table View</div>
    </div>
  );
}

export default AppHome;
