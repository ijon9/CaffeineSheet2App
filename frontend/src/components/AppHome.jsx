import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AppHome() {
  const [user, setUser] = useState("");
  const [applist, setApplist] = useState([]);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  
  function addApp() {
    navigate("/addApp");
  }

  useEffect(() => {
    axios
      .get("http://localhost:4000/getUser")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      
  }, []);

  // Get apps which you have created
  // axios.post("http://localhost:4000/getApps", {
  //   email: user
  // })
  // .then((response) => {
  //   setApplist(response.data);
  //   console.log(applist)
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // });
  

  function handleLogout() {
    axios
      .post("http://localhost:4000/logout", { email: user })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <div>
        <div>{user}</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="innerContainer">
        <div className="left">My Apps</div>
        <div className="right">
          <div>Table View</div>
          {applist.length > 0 ? (
            <div>{user}</div>
            // applist.map(app => {
            //   <div> {app.name} </div>
            // })
          ) : (
            <div>You Have No App. CREATE SOME</div>
          )}
        </div>
      </div>
      <button onClick={addApp}>+ Create App</button>
    </div>
  );
}

export default AppHome;
