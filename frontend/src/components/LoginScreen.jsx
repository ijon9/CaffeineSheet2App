import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // credentialResponse
  function handleSuccess(response) {
    setIsLoggedIn(true);
    console.log("logged in");
    console.log(response);
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
