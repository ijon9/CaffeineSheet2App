import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AppHome() {
  const [user, setUser] = useState("");
  const [dataSources, setDataSources] = useState([]);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

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
      .post("http://localhost:4000/getDataSources", {
        appId: localStorage.currId,
      })
      .then((response) => {
        console.log(response.data);
        setDataSources(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  function handleBackToApp() {
    navigate("/yourapps");
  }

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

  function addDataSource() {
    navigate("/addDataSource");
  }

  function tableView(dataSource) {
    navigate("/tableView", { dataSource: dataSource });
  }

  return (
    <div className="container">
      <div>
        <div>{user}</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <div></div>
        <button onClick={handleBackToApp}>Back to app</button>
      </div>
      <div className="innerContainer">
        <div className="left">
          DataSources
          {dataSources.length > 0 ? (
            dataSources.map((dsource) => (
              <div> {dsource.name} </div>
              // <div key={app._id} onClick={() => openApp(app._id)} ><Link>{app.name}</Link></div>
            ))
          ) : (
            <div>You Have No data sources. CREATE SOME</div>
          )}
        </div>
        <div className="right">
          Views
          <div className="innerContainer">
            {dataSources.length > 0 ? (
              dataSources.map((dsource) => (
                <div>
                  <button className="left" onClick={tableView}>
                    Table View
                  </button>
                </div>
              ))
            ) : (
              <div>Nothing to view</div>
            )}
          </div>
        </div>
      </div>
      <button className="left" onClick={addDataSource}>
        Add DataSource
      </button>
    </div>
  );
}

export default AppHome;
