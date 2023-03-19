import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

function LoginScreen() {
  // useState hook replaces local variables
  // set isLoggedIn as false
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // when user sucessfully logs in with their google account
  function handleSuccess(response) {
    // setIsLoggedIn(true);
    // decode the credentials
    let decoded = jwt_decode(response.credential);
    // console.log(decoded.email);
    // console.log(decoded.family_name);
    // console.log(decoded);
    // Axios call to our backend
    // TODO: axio call to our database to store the user
    axios
      .post("http://localhost:4000/addUser", {
        name: decoded.name,
        email: decoded.email,
      })
      .then((response) => {
        // handle success
        // if success store email in the localstorage
        localStorage.setItem("email", decoded.email);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });

    // Redirect to the homepage or any other page after successful login
    navigate("/yourapps");
  }
  return (
    <>
      <div>LoginScreen</div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
}

export default LoginScreen;
