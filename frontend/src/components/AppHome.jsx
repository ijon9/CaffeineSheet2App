import React from "react";
import "../style/AppHome.css";
import axios from "axios";

function AppHome(props) {
  console.log(props.user);
  // axios call to database and grab user
  // todo: show unique users
  // axios
  //   .get("http://localhost:4000/addUser", {
  //     name: decoded.name,
  //     email: decoded.email,
  //   })
  //   .then((response) => {
  //     // handle success
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     // handle error
  //     console.log(error);
  //   });

  return (
    <div className="container">
      <div>My Apps</div>
      <div>Table View</div>
    </div>
  );
}

export default AppHome;
