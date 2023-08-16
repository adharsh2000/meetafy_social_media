import React from "react";
import {
  Box,
  styled,
  // CircularProgress,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import RegisterForm from "../Components/RegisterForm/RegisterForm";
import RegisterCard from "../Components/RegisterCard/RegisterCard";
// import {Link} from 'react-router-dom'

const MainBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: "#805793",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
    height: '90vh'
  },
}));

const Register = () => {
  return (
    <MainBox component="main">
      <CssBaseline />
      <CardBox>
        <RegisterCard/>
        <RegisterForm/>
      </CardBox>
    </MainBox>
  );
};

export default Register;