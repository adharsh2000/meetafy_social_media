import React, { useState } from "react";
import './Style.css';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  styled,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import BrandLogo from "../BrandLogo/BrandLogo";
import { Link } from "react-router-dom";
import valid from "../../utils/valid";
import { setError } from "../../redux/AllReducers/errorSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../Axios/axiosInstance";
// import { setUser } from '../../redux/AllReducers/userSlice';
import { toast } from "react-toastify";

const RightBox = styled(Box)(({ theme }) => ({
  flex: "1",
  padding: "50px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    padding: "10px",
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "10px",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
  },
}));

const strengthLabels = ["weak", "medium", "strong"];
const RegisterForm = () => {
  const initialState = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "male",
  };
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const [userData, setUserData] = useState(initialState);
  const { fullname, username, email, password, cf_password } = userData;
  const errorMessage = useSelector((state) => state.error.errorMessage);
  // const message = useSelector(state => state.alert.message)
  //
  const [strength, setStrength] = useState("");

  const getStrength = (password) => {
    console.log(password);

    let strengthIndicator = -1;

    let upper = false,
      lower = false,
      numbers = false;

    for (let index = 0; index < password.length; index++) {
      let char = password.charCodeAt(index);
      if (!upper && char >= 65 && char <= 90) {
        upper = true;
        strengthIndicator++;
      }

      if (!numbers && char >= 48 && char <= 57) {
        numbers = true;
        strengthIndicator++;
      }

      if (!lower && char >= 97 && char <= 122) {
        lower = true;
        strengthIndicator++;
      }
    }

    setStrength(strengthLabels[strengthIndicator] ?? "");
  };

  //

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "password") {
      // Check password strength only when the "password" field is changed
      getStrength(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const check = valid(userData);
    if (check.errLength > 0) {
      dispatch(setError(check.errMsg));
      return;
    }
    axios
      .post("/api/register", userData)
      .then(({ data }) => {
        toast.success(data?.msg);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
      });
  };

  return (
    <RightBox>
      <Logo component={"h2"} variant="h4">
        {/* MEETAFY */}
        <BrandLogo />
      </Logo>
      <Typography component={"h2"} variant="h4">
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullname"
              label="Full Name"
              name="fullname"
              autoComplete="name"
              color="secondary"
              variant="filled"
              size="small"
              value={fullname}
              onChange={handleChangeInput}
              error={errorMessage && errorMessage.fullname}
              helperText={errorMessage && errorMessage.fullname}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="username"
              autoComplete="username"
              color="secondary"
              variant="filled"
              size="small"
              value={username}
              onChange={handleChangeInput}
              error={errorMessage && errorMessage.username}
              helperText={errorMessage && errorMessage.username}
            />
          </Grid>
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
              value={email}
              onChange={handleChangeInput}
              error={errorMessage && errorMessage.email}
              helperText={errorMessage && errorMessage.email}
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
              value={password}
              onChange={handleChangeInput}
              error={errorMessage && errorMessage.password}
              helperText={errorMessage && errorMessage.password}
            />

            <div className={`bars ${strength}`}>
              <div></div>
            </div>
            <div className="strength">
              {strength && <>{strength} password</>}
            </div>


          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="cf_password"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              color="secondary"
              variant="filled"
              size="small"
              value={cf_password}
              onChange={handleChangeInput}
              error={errorMessage && errorMessage.cf_password}
              helperText={errorMessage && errorMessage.cf_password}
            />
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              name="gender"
              row
              sx={{ justifyContent: "space-between" }}
              defaultValue="male"
              onChange={handleChangeInput}
            >
              <FormControlLabel
                control={<Radio size="small" color="secondary" />}
                label="male"
                value={"male"}
              />
              <FormControlLabel
                control={<Radio size="small" color="secondary" />}
                label="female"
                value={"female"}
              />
              <FormControlLabel
                control={<Radio size="small" color="secondary" />}
                label="other"
                value={"other"}
              />
            </RadioGroup>
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
          Register
        </Button>
        <Grid container sx={{ justifyContent: "center", mt: 1 }}>
          <Grid item>
            Already have an account?{" "}
            <Link to={"/login"} style={{ textDecoration: "none" }}>
              Login
            </Link>
          </Grid>
        </Grid>
      </Box>
    </RightBox>
  );
};

export default RegisterForm;
