import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
    styled,
    CircularProgress,
    Slide,
    Alert,
  } from "@mui/material";
import BrandLogo from '../BrandLogo/BrandLogo';
import axios from '../../Axios/axiosInstance'
import { useDispatch, useSelector } from 'react-redux';
import { clearLoad, setLoad } from '../../redux/AllReducers/loadingReducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { USER_REFRESH_TOKEN, USER_TOKEN } from '../../Constants/Constants';
import { setUser } from '../../redux/AllReducers/userSlice';
import { setAuth } from '../../redux/AllReducers/authReducer';
import GoogleIcon from "../../Images/google.png"

const LeftBox = styled(Box)(({ theme }) => ({
    flex: "1",
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "@media (max-width: 600px)": {
        padding: '10px',
      },
  }));
  
  const LoginButton = styled(Button)(({theme})=> ({
      backgroundColor: "black",
      color: "white",
      //do this for the login button
      
  }))
  
  const GoogleButton = styled(Button)(({theme}) => ({
      mb: 1,
      color: "black",
      borderColor: "black",
      "&:hover": {
        borderColor: "black",
      },
  }))
  
  const Logo = styled(Typography)(({ theme }) => ({
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  }));
  

const LoginForm = () => {
  const initialState = {email:'',password: ''};
  const [userData, setUserData] = useState(initialState)
  const [error, setError] = useState("")
  const containerRef = useRef()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(state => state.load)

  const handleChangeInput = (event) => {
      const {name, value} = event.target
      setUserData({...userData, [name]:value})
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(userData);
    dispatch(setLoad(true))
    axios.post('/api/login',userData,{
      headers:{
        'Authorization':`Bearer ${localStorage.getItem(USER_TOKEN)}`
        }
    })
    .then(({data}) => {
      localStorage.setItem(USER_TOKEN,data.accessToken)
      localStorage.setItem(USER_REFRESH_TOKEN,data.refreshToken)
      toast.success(data?.msg)
      dispatch(setAuth())
      dispatch(setUser(data.user))
      navigate('/');
      dispatch(clearLoad())
    })
    .catch((err)=>{
      // console.log(err?.response?.data?.msg);
      dispatch(clearLoad())
      toast.error(err?.response?.data?.msg)
    })
    
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('googleToken');
    console.log(token);

    if (token) {
      localStorage.setItem(USER_TOKEN,token)
      dispatch(setAuth())
      // dispatch(setUser(data.user))
      navigate('/');
    }

    const status = searchParams.get('authentication');
    if (status === 'failed') {
      setError('Google authentication failed');
    }
  }, [dispatch,navigate]);

  // useEffect(() => {
  //   const status = searchParams.get("authentication")
  //   if (status === "failed") {
  //     setError("Google authentication failed")
  //   }
  // }, [])

  const handleGoogleAuth = async () => {
    try {
      window.open("http://localhost:4000/api/auth/google", "_self")
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
      <LeftBox>
        <ToastContainer/>
          <Logo component={"h2"} variant="h4">
            {/* MEETAFY */}
            <BrandLogo/>
          </Logo>
          <Typography component={"h2"} variant="h4">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container>
            <Grid item xs={12} ref={containerRef}>
              {error && (
                <Slide
                  direction="up"
                  in={error}
                  container={containerRef.current}
                >
                  <Alert variant="filled" severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                </Slide>
              )}
            </Grid>
          </Grid>
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
                  onChange={handleChangeInput}
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
                  onChange={handleChangeInput}
                />
              </Grid>
            </Grid>
            <LoginButton
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              sx={{
                marginTop: "10px",
                "&:hover": {
                    backgroundColor: "secondary.main",
                  },
              }}
            >
                    {!loading ? <CircularProgress  sx={{ color: "white" }} size="1.5rem"/> : "Login"}
            </LoginButton>
            <GoogleButton
              type="button"
              fullWidth
              variant="outlined"
              size="medium"
              sx={{
                marginTop: "10px",
              }}
              onClick={handleGoogleAuth}
            >
              <img src={GoogleIcon} alt="success_img"  style={{width:'25px'}}/> Login with google
            </GoogleButton>
            <Grid container sx={{ justifyContent: "center", mt: 1 }}>
              <Grid item>You don't have an account? <Link to={"/register"} style={{ textDecoration: 'none' }}>Signup</Link></Grid>
            </Grid>
          </Box>
        </LeftBox>
  )
}

export default LoginForm
