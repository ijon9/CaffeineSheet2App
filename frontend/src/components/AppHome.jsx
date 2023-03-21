import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

    axios
      .post("http://localhost:4000/getApps", {
        email: user,
      })
      .then((response) => {
        setApplist(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

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

  function openApp(id) {
    localStorage.currId = id;
    navigate("/openApp");
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
          <div>App Name</div>
          {applist.length > 0 ? (
            applist.map((app) => (
              <div key={app._id} onClick={() => openApp(app._id)}>
                <Link>{app.name}</Link>
              </div>
            ))
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
