
import {
    AccountBox,
    Article,
    Group,
    Home,
    ModeNight,
    Person,
    Settings,
    // Storefront,
  } from "@mui/icons-material";
  import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Switch,
  } from "@mui/material";
  import ExploreIcon from '@mui/icons-material/Explore';
  import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../redux/AllReducers/themeSlice";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";

  
  const LeftSidePanel = () => {
    const theme = useTheme();
    // const backgroundColor = theme.palette.background.paper;
    const color = theme.palette.secondary.main;
    const appearance = useSelector((state) => state.appearance)
    const dispatch = useDispatch()
    return (
      <Box width={230} height={'100vh'} p={2} sx={{ backgroundColor: theme.palette.background.paper }} position={'fixed'}>
      <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#home">
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Homepage" sx={{color:color}}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="#simple-list" sx={{color:color}}>
                <ListItemIcon>
                  <Article />
                </ListItemIcon>
                <ListItemText primary="Pages" color={color} />
              </ListItemButton>
            </ListItem>
            <Link to={"/chats"} style={{textDecoration:'none', color:'inherit'}}>
            <ListItem disablePadding sx={{color:color}}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Chats" />
              </ListItemButton>
            </ListItem>
            </Link>
            <Link to={"/discover"} style={{textDecoration:'none', color:'inherit'}}>
            <ListItem disablePadding sx={{color:color}}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <ExploreIcon />
                </ListItemIcon>
                <ListItemText primary="Explore" />
              </ListItemButton>
            </ListItem>
            </Link>
            <ListItem disablePadding sx={{color:color}}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Friends" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{color:color}}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{color:color}}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <AccountBox />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{color:color}}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <ModeNight />
                </ListItemIcon>
                <Switch onChange={e=>dispatch(changeMode(appearance === "light" ? "dark" : "light"))}/>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
    );
  };
  
  export default LeftSidePanel;