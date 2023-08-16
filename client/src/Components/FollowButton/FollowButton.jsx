import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../../redux/AllReducers/profileSlice";
import { setUser } from "../../redux/AllReducers/userSlice";
import axios from "../../Axios/axiosInstance";

const FollowButton = ({ otherUser }) => {
  //otherUser is the opposite user
  const [followed, setFollowed] = useState(false);
  const [load, setLoad] = useState(false)
  const {user} = useSelector((state) => state);
  const socket = useSelector((state) => state?.socket?.socket)
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if(user.following.find((item) => item._id === otherUser._id)){
  //     setFollowed(true)
  //   }
  // },[user.following, otherUser._id])

  useEffect(() => {
    if(user?.following?.find(item => item?._id === otherUser?._id)){
        setFollowed(true)
    }
    return () => setFollowed(false)
}, [user?.following, otherUser?._id])

  const handleFollow = async () => {
    if(load) return
    setFollowed(true)
    setLoad(true)
    const newUser = {...otherUser, followers:[...otherUser.followers, user]}
    // console.log(newUser);
    dispatch(follow(newUser));
    // socket.emit('follow', newUser)
    const newData = {...user, following:[...user.following, newUser]}
    dispatch(setUser(newData));
    await axios.patch(`/api/user/${otherUser._id}/follow`)
    .then(({data})=>{
      // console.log("success", data)
      socket.emit('follow', newUser)
      dispatch(setUser(...data?.newUser,newData))
    })
    .catch((err)=>{
      console.log(err)
    })
    setLoad(false);
    let msg;
     msg = {
      id: user._id,
      text: 'has started to follow you.',
      recipients: [newUser._id],
      url: `/profile/${user._id}`,
      user:user
    }

    await axios
    .post("/api/notify", msg)
    .then(({ data }) => {
      console.log(data);
      socket.emit("createNotify", {
        ...data.notify,
        user: {
          username: user.username,
          profilePicture: user.profilePicture,
        },
      });
    })
    .catch((err) => console.warn("Error in notifying post like"));
  }

  const handleUnfollow = async () => {
    if(load) return
    setFollowed(false)
    setLoad(true)
    const newUser = {
      ...otherUser,
      followers: otherUser.followers.filter(item => item._id !== user._id)
    }; 
    // console.log(newUser);
    dispatch(unfollow(newUser));
    // socket.emit('unFollow', newUser)
    const newData = {...user, following:user.following.filter(item => item._id !== newUser._id)}
    dispatch(setUser(newData))
    await axios.patch(`/api/user/${otherUser._id}/unfollow`)
    .then(({data})=>{
      socket.emit('unFollow', newUser)
      // console.log("success", data);
      dispatch(setUser(...data?.newUser,newData))
    })
    .catch((err)=>console.log(err))
    setLoad(false)
    let msg;
     msg = {
      id: user._id,
      text: 'has started to follow you.',
      recipients: [newUser._id],
      url: `/profile/${user._id}`,
    }

    await axios
    .delete(`/api/notify/${msg.id}?url=${msg.url}`, msg)
    .then(({ data }) => {
      console.log(data);
      socket.emit("removeNotify", {
        ...data.notify,
        user: {
          username: user.username,
          profilePicture: user.profilePicture,
        },
      });
    })
    .catch((err) => console.warn("Error in notifying post like"));
  }
  return (
    <>
      {followed ? (
        <Button variant="outlined" onClick={handleUnfollow}>UnFollow</Button>
      ) : (
        <Button variant="outlined" onClick={handleFollow}>follow</Button>
      )}
    </>
  );
};

export default FollowButton;
