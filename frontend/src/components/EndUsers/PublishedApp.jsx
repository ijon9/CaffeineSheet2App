import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
function PublishedApp() {
  axios.defaults.withCredentials = true;
  let { userid } = useParams();
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  // gets all the apps
  useEffect(() => {
    axios.get("http://localhost:4000/getPublishedApp").then((response) => {
      setApps(response.data);
    });
  }, []);
  console.log(apps);
  function handleLogout() {
    axios
      .post("http://localhost:4000/logout", { email: userid })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div>Published Apps {userid}</div>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {apps.length > 0 ? (
          apps.map((app) => <div key={app._id}><Link to={`/userApp/${app._id}`}>{app.name}</Link></div>)
        ) : (
          <div>no app</div>
        )}
      </div>
    </div>
  );
}

export default PublishedApp;
