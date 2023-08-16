import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UserNavbar from "../Components/UserNavbar/UserNavbar";
import LeftSidePanel from "../Components/LeftSidePanel/LeftSidePanel";
// import RightSidePanel from "../Components/RightSidePanel/RightSidePanel";
import ProfileHeader from "../Components/Profile/ProfileHeader";
import { useTheme } from "@emotion/react";
import ProfilePosts from "../Components/Profile/ProfilePosts";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchUserDetails,
  fetchUserProfilePosts,
  getId,
  // updateProfilePost,
} from "../redux/AllReducers/profileSlice";
import ProfileSavedPosts from "../Components/Profile/ProfileSavedPosts";
// import axios from "../Axios/axiosInstance";

const ProfilePage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const backgroundColor = theme.palette.background.paper;
  const [showprogress, setShowprogress] = useState(false);
  // const [saveTab, setSaveTab] = useState(false);
  const user = useSelector((state) => state.user);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("Posts");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (profile?.ids?.every((item) => item !== id)) {
      dispatch(getId(id));
      dispatch(fetchUserDetails(id));
      dispatch(fetchUserProfilePosts(id));
    }
  }, [id, user, profile.ids, dispatch]);

  return (
    <Box>
      <UserNavbar />
      <Grid container>
        <Grid item bgcolor={backgroundColor} xs={2}>
          <LeftSidePanel />
        </Grid>
        <Grid item xs={10} display={"flex"} justifyContent={"center"}>
          <Box
            width={"50rem"}
            height={"auto"}
            bgcolor={"white"}
            p={2}
            mt={3}
            borderRadius={2}
          >
            {profile.loading ? (
              <CircularProgress />
            ) : (
              <>
                <ProfileHeader
                  user={user}
                  profile={profile}
                  id={id}
                  dispatch={dispatch}
                  setShowprogress={setShowprogress}
                />
                {user?._id === id && (
                  <Box sx={{ width: "100%", color: "black" }}>
                    <Tabs centered value={activeTab} onChange={handleTabChange}>
                      <Tab label="Posts" value="Posts" />
                      <Tab label="Saved" value="Saved" />
                      {/* Add more Tab components as needed */}
                    </Tabs>
                  </Box>
                )}

                {profile.loading ? (
                  <CircularProgress />
                ) : (
                  <>
                    {activeTab === "Saved" ? (
                      <ProfileSavedPosts user={user} dispatch={dispatch}/>
                      ) : (
                        <ProfilePosts id={id} user={user} profile={profile} dispatch={dispatch}/>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showprogress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ProfilePage;
