import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome(props) {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  function addApp() {
    navigate("/addApp");
  }

  useEffect(() => {
    axios
      .get("http://localhost:4000/getUser")
      .then((response) => {
        // console.log("works");
        // console.log(response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleLogout() {
    axios
      .post("http://localhost:4000/logout", { email: user })
      .then((response) => {
        console.log(response);
        console.log("logging out");
        navigate("/");
      })
      .catch((error) => {
        console.log("ERROR");
        console.log(error);
      });
    // console.log("YOU CLICKED ME!");
  }

  // console.log(email);
  return (
    <div className="container">
      <div>hello user {user}</div>
      <div>My Apps</div>
      <button onClick={addApp}>+ Create App</button>
      <div>Table View</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AppHome;
