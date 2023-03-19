import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";

function AppHome(props) {
  // todo: show unique users
  const [email, setEmail] = useState(localStorage.getItem("email"));
  return (
    <div className="container">
      <div>hello user {email}</div>
      <div>My Apps</div>
      <div>Table View</div>
    </div>
  );
}

export default AppHome;
