import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Box, Container, Typography} from "@mui/material";

function LoginScreen() {
  // useState hook replaces local variables
  // set isLoggedIn as false
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  // when user sucessfully logs in with their google account
  function handleSuccess(response) {
    // setIsLoggedIn(true);
    // decode the credentials
    let decoded = jwt_decode(response.credential);
    // Axios call to our backend
    // TODO: axio call to our database to store the user
    axios
      .post("http://localhost:4000/addUser", {
        name: decoded.name,
        email: decoded.email,
      })
      .then((response) => {
        // Redirect to the homepage or any other page after successful login
        navigate("/yourapps");
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  return (
    <Box
      sx={{
        mt: "11%",
        mr: "4%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Container maxWidth="xs">
        <Typography
          sx={{
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "bold",
            display: "inline",
          }}
          variant="h1"
        >
          Sheet
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "bold",
            display: "inline",
            color: "#68DF5E",
          }}
          variant="h1"
        >
          2
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "bold",
            display: "inline",
          }}
          variant="h1"
        >
          App
        </Typography>
        <Box sx={{ mt: "30%", ml:"25%" }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default LoginScreen;
