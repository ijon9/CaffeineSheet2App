import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
function PublishedApp() {
  axios.defaults.withCredentials = true;
  let { userid } = useParams();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/getPublishedApp").then((response) => {
      setApps(response.data);
    });
  }, []);
  console.log(apps);
  return (
    <div>
      <div>PublishedApp {userid}</div>
      <div>
        {apps.length > 0 ? (
          apps.map((app) => <div key={app._id}>{app.name}</div>)
        ) : (
          <div>no app</div>
        )}
      </div>
    </div>
  );
}

export default PublishedApp;
