import React from "react";
import { Box, Button, Typography, Grid, TextField, styled } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
// import {Link} from 'react-router-dom'

const Logo = styled(Typography)(({theme}) => ({
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]:{
        display: 'flex',
    }
}))

const Login = () => {
  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        backgroundColor: "#805793",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <CssBaseline/>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "row-reverse",
          backgroundColor: "white",
          borderRadius: "10px",
          minHeight: "600px",
          overflow: "hidden",
          "@media (max-width: 600px)": {
            width: '100%',
            margin: '10px',
          },
          "@media (max-width: 1200px)": {
            width: '100%',
            margin: '60px',
          },
        }}
      >
        <Box
          sx={{
            flex: "1",
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
        <Logo component={'h2'} variant="h4">
            MEETAFY
        </Logo>
          <Typography component={"h2"} variant="h4">
            Login 
          </Typography>
          <Box component="form" noValidate>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  autoComplete="email"
                  color="secondary"
                  variant="filled"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  color="secondary"
                  variant="filled"
                  size="small"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "secondary.main",
                },
              }}
              size="medium"
            >
              Login
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{
                mb: 1,
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                },
              }}
              size="medium"
            >
              Login With Google
            </Button>
            <Grid container sx={{ justifyContent: "center", mt: 1 }}>
              <Grid item>{"You don't have an account? Signup"}</Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
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
          }}
         
        >
          <Typography component={"h2"} variant="h4">
            MEETAFY
          </Typography>
          <Typography component={"p"} variant="h8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
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
            Signup Now!
          </Button>
        </Box>
      </Box>
      
    </Box>
  );
};

export default Login;
