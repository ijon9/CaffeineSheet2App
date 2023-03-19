import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  function handleSuccess(response) {
    setIsLoggedIn(true);
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
