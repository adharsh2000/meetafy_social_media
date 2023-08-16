import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserDetails, getId, setLoading } from "../../redux/AllReducers/profileSlice";
import EditProfile from "./EditProfile";
import FollowButton from "../FollowButton/FollowButton";
import Followers from "./Followers";
import Following from "./Following";

const ProfileHeader = ({id, user, profile, dispatch, setShowprogress}) => {
  // console.log(useParams());
  // const { id } = useParams();
  // const dispatch = useDispatch();
  // const useruser = useSelector((state) => state?.user)
  // const profile = useSelector((state) => state?.profile);

  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setShowFollwers] = useState(false)
  const [showFollowing, setShowFollwing] = useState(false)

  // useEffect(() => {
  //    if( id === useruser?._id){
  //     setUserData([useruser])
  //    }else{
  //     dispatch(getId(id));
  //     dispatch(setLoading(true));
  //     dispatch(fetchUserDetails(id));
  //     dispatch(setLoading(false));
  //     const newData = profile?.users?.filter(user => user?._id === id);
  //     console.log(newData);
  //     setUserData(newData);
  //    }
  // },[id, useruser, dispatch, profile.users]);

  useEffect(() => {
    if (id === user?._id) {
      setUserData([user]);
    } else {
      const newData = profile?.users?.filter(user => user?._id === id)
      setUserData(newData)
    }
  }, [id, user, dispatch, profile.users]);
  
  // useEffect(() => {
  //   if(showFollowers || showFollowing || onEdit){
      
  //   }else{

  //   }
  // })
  

  return (
    <Box width={"100%"} height={"13rem"} display={"flex"}>
      {
        userData.map(item => (
        <>
        <Box
        width={"50%"}
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection='column'
      >
        <Avatar
          alt="profile"
          src={item?.profilePicture}
          sx={{ width: 130, height: 130, marginBottom:'1rem' }}
        />
        {
          user._id === item._id
          ?  <Button variant="outlined" onClick={() => setOnEdit(true)}>Edit profile</Button>
          : <FollowButton otherUser={item} />
        }
      </Box>
      <Box width={"45%"} height={"auto"} p={3}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography>{item?.username}</Typography>
          {/* <Button>Edit profile</Button> */}
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} width={"70%"}>
          <Typography onClick={() => setShowFollwers(true)} sx={{
            cursor:"pointer",
            color:'crimson',
            fontWeight:'bold',
          }}>{item?.followers?.length} followers</Typography>
          <Typography onClick={() => setShowFollwing(true)} sx={{
            cursor:'pointer',
            color:'crimson',
            fontWeight:'bold',
          }}>{item?.following?.length} following</Typography>
        </Box>
        <Typography>{item?.fullname}</Typography>
        <Typography>{item?.email}</Typography>
        <Typography>{item?.address}</Typography>
        <Typography>{item?.bio}</Typography>
      </Box>
      {/* <Box width={'40rem'} bgcolor={'blue'} >
        <Box width={'30rem'} bgcolor={'green'}>
          <Avatar
            alt="Remy Sharp"   
            src="/static/images/avatar/1.jpg"
            sx={{ width: 56, height: 56 }}
          />
        </Box>
      </Box> */}
      {
        onEdit && <EditProfile setShowprogress={setShowprogress} setOnEdit={setOnEdit}/>
      }
      {
        showFollowers && <Followers users={item?.followers} showFollowers={showFollowers} setShowFollwers={setShowFollwers}/>
      }
      {
        showFollowing && <Following users={item?.following} showFollowing={showFollowing} setShowFollwing={setShowFollwing} />
      }
      </>
      ))
    }
    </Box>
  );
};

export default ProfileHeader;
