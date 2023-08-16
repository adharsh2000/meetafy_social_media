import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from "@mui/material/Modal";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Avatar,
  Badge,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  styled,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { checkImage, imageUpload } from "../../utils/imageUploads";
import { toast } from "react-toastify";
import ProfileValid from "../../utils/ProfileEditValid";
import axios from "../../Axios/axiosInstance";
import { setUser } from "../../redux/AllReducers/userSlice";

const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "auto",
  marginTop: "1.5rem",
});


export default function EditProfile({ setOnEdit, setShowprogress }) {
  const handleClose = () => setOnEdit(false);
  const fileInputRef = useRef(null);

  const initialState = {
    fullname: "",
    mobile: "",
    address: "",
    bio: "",
    gender: "",
  };

  const [userData, setUserData] = useState(initialState);
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch()
  const { fullname, mobile, address, bio, gender } = userData;
  const user = useSelector((state) => state.user);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    setUserData(user)
  },[user])

  const handleInput = (e) => {
    const {name , value} = e.target;
    setUserData({...userData, [name]:value});   
  }

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const err = checkImage(file)
    if(err) return toast.error(err.toString());
    setAvatar(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { errMsg, errLength } = ProfileValid(userData)
    if (errLength > 0) {
        Object.values(errMsg).forEach((error) => {
          return toast.error(error);
        });
      }
    let media;
    handleClose(false)
    setShowprogress(true)
    if(avatar) media = await imageUpload([avatar]);
    axios.patch("/api/user",{
        ...userData,
        profilePicture: avatar ? media[0].url : user.profilePicture
    })
    .then(()=>{
        !errMsg && toast.success("Profile updated successfully")
        const data = {
            ...userData,
            profilePicture: avatar ? media[0].url : user.profilePicture,
    }
    dispatch(setUser(data))
    setShowprogress(false)
    })
    .catch(({response})=>{
        setShowprogress(false)
        toast.error("Oops somthing wrong try again later!");
    })

  }

  return (
    <div>
      <SytledModal
        open={setOnEdit}
        onClose={(e) => handleClose(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={400}
          height="auto"
          bgcolor={"background.paper"}
          color={"text.primary"}
          p={3}
          borderRadius={2}
          component={"form"}
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                    <IconButton
                    aria-label="select file"
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    //backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                      zIndex:'1'
                    }}
                    onClick={handleButtonClick}
                  >
                    <PhotoCameraIcon sx={{ color: "#fff" }} />
                  </IconButton> 
                }
              >
                <Avatar alt="Travis Howard" src={avatar ? URL.createObjectURL(avatar) : user?.profilePicture} sx={{ width: 80, height: 80 }} />
              </Badge>
              <input
                type="file"
                ref={fileInputRef}
                style={{
                  display: "none",
                }}
                // multiple
                accept="image/*"
                name="file"
                onChange={changeAvatar}
              />
            </Grid>
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
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="mobile"
                label="Mobile"
                type="text"
                id="mobile"
                autoComplete="mobile"
                color="secondary"
                variant="filled"
                size="small"
                value={mobile}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="address"
                label="Address"
                type="text"
                id="address"
                autoComplete="address"
                color="secondary"
                variant="filled"
                size="small"
                value={address}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="bio"
                label="Bio"
                type="bio"
                autoComplete="bio"
                color="secondary"
                variant="filled"
                size="small"
                id="filled-multiline-static"
                multiline
                rows={4}
                value={bio}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                name="gender"
                row
                sx={{ justifyContent: "space-between" }}
                // defaultValue="male"
                value={gender}
                onChange={handleInput}
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
            Save
          </Button>
        </Box>
        </SytledModal>
    </div>
  );
}
