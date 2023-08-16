import { useTheme } from "@emotion/react";
import { Pets } from "@mui/icons-material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Fade,
  // InputBase,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { USER_TOKEN } from "../../Constants/Constants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../redux/AllReducers/authReducer";
import SearchBar from "../SearchBar/SearchBar";
import { clearUser } from "../../redux/AllReducers/userSlice";
import { setResetPost } from "../../redux/AllReducers/postSlice";
import NotifyModal from "../NotifyModal/NotifyModal";

// const StyledToolbar = styled(Toolbar)({
//   display: "flex",
//   justifyContent: "space-between",
// });

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  // Accessing a custom color from your theme
}));

const Search = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: "50px",
  width: "50%",
  height: "2.6rem",
  display: "flex",
  alignItems: "center",
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const LeftSide = styled(Box)(({ theme }) => ({
  flex: "1",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
}));

const MiddleSide = styled(Box)(({ theme }) => ({
  flex: "3",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const RightSide = styled(Box)(({ theme }) => ({
  flex: "1",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));
const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const notify = useSelector((state) => state.notify);
  const backgroundColor = theme.palette.primary.main;

  const [anchorEl, setAnchorEl] = useState(null);
  const openm = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem(USER_TOKEN);
    dispatch(clearAuth());
    dispatch(clearUser());
    dispatch(setResetPost());
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: backgroundColor }}>
      <StyledToolbar>
        <LeftSide>
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              MEETAFY
            </Typography>
          </Link>
          <Pets sx={{ display: { xs: "block", sm: "none" } }} />
        </LeftSide>
        <MiddleSide>
          <Search>
            {/* <Box component="form" width='100%'>
            <InputBase placeholder="search..." sx={{ color: "black",width:'90%' }} />
            </Box> */}
            <SearchBar />
          </Search>
        </MiddleSide>
        <RightSide>
          <Icons>
            {/* <Badge badgeContent={4} color="error">
              <Mail />
            </Badge> */}
            {notify?.data?.length > 0 ? (
              <>
              <Badge badgeContent={notify?.data?.length} color="error" 
              id="fade-button"
              aria-controls={openm ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openm ? 'true' : undefined}
              onClick={handleClick}
              >
                <NotificationsActiveIcon />
              </Badge>
              <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              anchorEl={anchorEl}
              open={openm}
              onClose={handleClose}
              TransitionComponent={Fade}
              >
                <NotifyModal/>
            </Menu>
              </>
            ) : (
              // <Badge>
                <NotificationsNoneIcon />
              //  </Badge> 
            )}
      
            {/* <Badge badgeContent={2} color="error">
               <Notifications />
            </Badge> */}
            <Avatar
              sx={{ width: 30, height: 30 }}
              src={user?.profilePicture}
              onClick={(e) => setOpen(true)}
            />
          </Icons>
          <UserBox onClick={(e) => setOpen(true)}>
            <Avatar sx={{ width: 30, height: 30 }} src="" />
            <Typography variant="span">John</Typography>
          </UserBox>
        </RightSide>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Link to={`/profile/${user?._id}`} style={{ textDecoration: "none" }}>
            Profile
          </Link>
        </MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default UserNavbar;
