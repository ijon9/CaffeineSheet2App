import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [user, setUser] = useState("");
  const [developer, setDeveloper] = useState(false);
  // let developer = true;
  useEffect(() => {
    async function getuser() {
      axios
        .get("http://localhost:4000/getUserAndDevType")
        .then((response) => {
          setDeveloper(response.data.isDev);
          console.log(response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getuser();
  }, [developer]);

  return (
    <div>
      {developer ? (
        <div>
          <div>{user.email}</div>
          <div>HomePage</div>
          <div>Browse Apps</div>
          <Link to="/yourapps">Your Apps</Link>
        </div>
      ) : (
        <div>
          <div>{user.email}</div>
          not a developer <Link to="/login">Go Back</Link>
          <div key={user.userid}>
            <Link to={`/user/${user.userid}`}>Published apps</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
