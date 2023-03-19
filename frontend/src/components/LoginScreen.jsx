import React from "react";
import { GoogleLogin } from '@react-oauth/google';

function LoginScreen() {
  return (
    <>
    <div>LoginScreen</div>
    <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {console.log('Login Failed');}}/>
    </>
  );
  
}

export default LoginScreen;
