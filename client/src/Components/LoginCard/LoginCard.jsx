import React from "react";
import {
  Box,
  Button,
  Typography,
  styled,
  // CircularProgress,
} from "@mui/material";
import WhiteBrandLogo from "../BrandLogo/WhiteBrandLogo";
import { Link } from "react-router-dom";

const RightBox = styled(Box)(({ theme }) => ({
  flex: "1",
  // background: "rgba(39, 11, 96, 0.5)",
  // backgroundSize: "cover",
  padding: "50px",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  color: "white",
  background: `linear-gradient(rgba(39, 11, 96, 0.5), rgba(39, 11, 96, 0.5)),
    url("https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600") center`,
  backgroundSize: "cover",
  "@media (max-width: 600px)": {
    display: "none",
  },
}));

const SignupNowButton = styled(Button)(({ theme }) => ({
  width: "50%",
  padding: "10px",
  border: "none",
  backgroundColor: "#938eef",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
}));

const LoginCard = () => {
  return (
    <RightBox>
      <Typography component={"h2"} variant="h4">
        {/* MEETAFY */}
        <WhiteBrandLogo />
      </Typography>
      <Typography component={"p"} variant="h8">
        Meetafy is a platform designed to connect like-minded individuals, where
        you can meet new people, make friends, and explore shared interests.
        Whether you're looking for companionship, networking opportunities, or
        simply expanding your social circle, Meetafy provides a seamless and
        user-friendly experience.
      </Typography>
      <Box component={"span"}>Do you have an account?</Box>
      <SignupNowButton>
        <Link
          to="/register"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Signup Now!
        </Link>
      </SignupNowButton>
    </RightBox>
  );
};

export default LoginCard;
