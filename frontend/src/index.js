import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style/index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="388672686786-fvfgrg7p3484ckh557liclfthd0jecv8.apps.googleusercontent.com"> <App /> </GoogleOAuthProvider>;
  </React.StrictMode>
);
