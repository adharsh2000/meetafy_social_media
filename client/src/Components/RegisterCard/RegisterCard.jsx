import React from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import WhiteBrandLogo from "../BrandLogo/WhiteBrandLogo";
import { Link } from "react-router-dom";

const LeftBox = styled(Box)(({ theme }) => ({
  flex: "1",
  // background: "rgba(39, 11, 96, 0.5)",
  // backgroundSize: "cover",
  padding: "50px",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  color: "white",
  background: `linear-gradient(rgba(39, 11, 96, 0.5), rgba(39, 11, 96, 0.5)),
    url("https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600") center`,
  backgroundSize: "cover",
  "@media (max-width: 600px)": {
    display: "none",
  },
}));

const RegisterCard = () => {
  return (
    <LeftBox>
      <Typography component={"h2"} variant="h4">
        {/* MEETAFY */}
        <WhiteBrandLogo />
      </Typography>
      <Typography component={"p"} variant="h8">
        Join Meetafy today and embark on a journey of exploration, connection,
        and personal growth. Let us help you expand your horizons and meet
        fascinating individuals who can enrich your life. Start your Meetafy
        experience now and discover a world of possibilities!
      </Typography>
      <Box component={"span"}>Do you have an account?</Box>
      <Button
        sx={{
          width: "50%",
          padding: "10px",
          border: "none",
          backgroundColor: "#938eef",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        <Link
          to={"/login"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Login Now!
        </Link>
      </Button>
    </LeftBox>
  );
};

export default RegisterCard;
