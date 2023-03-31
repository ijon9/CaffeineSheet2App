import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [user, setUser] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:4000/getUser")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <div>
      <div>{user}</div>
      <div>HomePage</div>
      <div>Browse Apps</div>
      <Link to="/yourapps">Your Apps</Link>
    </div>
  );
}

export default HomePage;
