import React from "react";
import {
  Box,
  styled,
  // CircularProgress,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import LoginCard from "../Components/LoginCard/LoginCard";
import LoginForm from "../Components/LoginForm/LoginForm";
// import {Link} from 'react-router-dom'

const MainBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: "#805793",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "@media (max-width: 600px)": {
    //margin: '20px'
  },
}));

const CardBox = styled(Box)(({ theme }) => ({
  width: "50%",
  display: "flex",
  flexDirection: "row-reverse",
  backgroundColor: "white",
  borderRadius: "10px",
  minHeight: "600px",
  overflow: "hidden",
  "@media (max-width: 600px)": {
    width: "100%",
    margin: "10px",
  },
  "@media (max-width: 1200px)": {
    width: "100%",
    margin: "10px",
  },
}));

const Login = () => {
  return (
    <MainBox component="main">
      <CssBaseline />
      <CardBox>
        <LoginForm/>
        <LoginCard/>
      </CardBox>
    </MainBox>
  );
};

export default Login;