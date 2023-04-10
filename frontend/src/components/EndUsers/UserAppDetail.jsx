import React, { useEffect, useState } from "react";
import "../../style/AppHome.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function AppDetail() {
  let { id } = useParams();
  const [user, setUser] = useState("");
  const [app, setApp] = useState({});
  const [tableView, setTableView] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:4000/getUser")
      .then((response) => {
        setUser(response.data.email);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post("http://localhost:4000/getOneApp", { id: id })
      .then((response) => {
        setApp(response.data);
        setTableView(response.data.tViews);
      });
  }, [user]);

  function handleBackToApp() {
    navigate("/user/" + user);
  }

  return (
    <div>
      <div>{user}</div>
        App Name: {app.name} 
        <br />
      <div>
        <button onClick={handleBackToApp}>Back to apps</button>
      </div>
      <div className="left">
        Tables
        <div>
          {tableView.length > 0 ? (
            tableView.map((tv) => (
              <div key={tv._id}>
                <Link to={`/endUser/app/${id}/table/${tv._id}`}>{tv.view.name}</Link>
              </div>
            ))
          ) : (
            <div>No Table Views</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppDetail;
