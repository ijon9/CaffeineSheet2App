import React, { useEffect, useState } from "react";
import "../style/AppHome.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AppHome() {
  const [user, setUser] = useState("");
  const [dataSources, setDataSources] = useState([]);
  const [app, setApp] = useState({});
  const [inputs, setInputs] = useState({});
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

      axios
      .post("http://localhost:4000/getOneApp", {
        appId: localStorage.currId,
      })
      .then((response) => {
        setApp(response.data);
        const temp = {
          name: app.name,
          creator: app.creator,
          rolesheet: app.roleSheet,
          publish: app.published ? "yes" : "no"
        }
        setInputs(temp);
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
    navigate("/tableView", { dataSource: dataSource});
  }

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
    axios.post("http://localhost:4000/editApp", {
      appId: localStorage.currId,
      name: inputs.name,
      creator: inputs.creator,
      rolesheet: inputs.rolesheet,
      publish: inputs.publish
    })
    .then((response) => {
      navigate("/yourapps");
    })
    .catch((error) => {
      console.log(error);
    });
  };

  var publish;
  var notPublish;
  if(app.published) {
    publish = <input type="radio" value="yes" name="publish" defaultChecked/> 
    notPublish = <input type="radio" value="no" name="publish"/>
  }
  else {
    publish = <input type="radio" value="yes" name="publish" />
    notPublish = <input type="radio" value="no" name="publish" defaultChecked/>
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

      <form onSubmit={handleSubmit}>
        <label>
          App Name:
          <input
            type="text"
            name="name"
            value={inputs.name || app.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Creator:
          <input
            type="text"
            name="creator"
            value={inputs.creator || app.creator}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Rolesheet URL:
          <input
            type="text"
            name="rolesheet"
            value={inputs.rolesheet || app.roleSheet}
            onChange={handleChange}
          />
        </label>
        <br />
        <div onChange={handleChange}>
          {/* <input type="radio" value="yes" name="publish"></input> Publish
          <input type="radio" value="no" name="publish" /> Don't Publish */}
          {publish} Publish
          {notPublish} Don't Publish
        </div>
        <input type="submit" value="Edit App"/> <br/><br/>
      </form>
      <div className="innerContainer">
        <div className="left">
          DataSources
          {dataSources.length > 0 ? (
            dataSources.map((dsource) => (
              <div onClick={() => tableView(dsource.name)} ><Link>{dsource.name}</Link></div>
            ))
          ) : (
            <div>You Have No data sources. CREATE SOME</div>
          )}
        </div>
      </div>
      <button className="left" onClick={addDataSource}>
        Add DataSource
      </button>
    </div>
  );
}

export default AppHome;
