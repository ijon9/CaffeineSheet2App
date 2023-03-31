import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";

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
        <Box sx={{ mt: "30%", ml: "25%" }}>
          <>
            <div>LoginScreen</div>
            <button onClick={() => login()}>Use Google Login</button>
          </>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginScreen;
