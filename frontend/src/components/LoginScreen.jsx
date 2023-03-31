import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginScreen() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // when user sucessfully logs in with their google account
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await axios
        .post("http://localhost:4000/logUser", {
          code: codeResponse.code,
        })
        .then((response) => {
          navigate("/home");
        });
    },
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/spreadsheets profile email",
  });

  return (
    <>
      <div>LoginScreen</div>
      <button onClick={() => login()}>Use Google Login</button>
    </>
  );
}

export default LoginScreen;
