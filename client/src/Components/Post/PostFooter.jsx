import { Box, IconButton, Popper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useDispatch, useSelector } from "react-redux";
import LikeButton from "./LikeButton";
import { setUpdatePost } from "../../redux/AllReducers/postSlice";
import { setUser } from "../../redux/AllReducers/userSlice";
import axios from "../../Axios/axiosInstance";
import ShareModal from "../ShareModal/ShareModal";
import { ClientBaseUrl } from "../../Constants/Constants";

const PostFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const socket = useSelector((state) => state?.socket?.socket);

  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  //Likes
  useEffect(() => {
    if (post.likes.find((like) => like._id === user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, user._id]);

  // const handleLike = async () => {
  //   if(loadLike) return;
  //   setLoadLike(true)
  //   const newPost =  { ...post, likes: [...post.likes, user] };
  //   console.log(newPost);
  //   dispatch(setUpdatePost(newPost));
  //   axios.patch(`/api/post/${post._id}/like`)
  //   .then(({data })=>console.log(data?.msg))
  //   .catch(err => console.error("Error", err ))
  //   setLoadLike(false)
  // }

  const handleLike = async () => {
    let msg;
    if (loadLike) return;

    setLoadLike(true);

    const updatedPost = { ...post, likes: [...post.likes, user] };
    dispatch(setUpdatePost(updatedPost));
    
    await axios
    .patch(`/api/post/${post._id}/like`)
    .then(({ data }) => {
      console.log(data?.msg);
      socket.emit("likePost", updatedPost);
      })
      .catch((err) => {
        console.error("Error", err);
        dispatch(setUpdatePost(post));
      })
      .finally(() => {
        setLoadLike(false);
      });
    msg = {
      id: user._id,
      text: "like your post.",
      recipients: [post.user._id],
      url: `/post/${post._id}`,
      content: post.content,
      image: post.images[0].url,
      user:user,
    };
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
  };

  // const handleUnLike = async () => {
  //   if(loadLike) return;

  //   setLoadLike(true)
  //   const newPost = {...post, likes: post.likes.filter(like => like._id !== user._id)}
  //   console.log(newPost);
  //   // dispatch(setUpdatePost(newPost));
  //   axios.patch(`/api/post/${post._id}/unlike`)
  //   .then(({ data })=>{
  //     dispatch(setUpdatePost(newPost));
  //     console.log("data?.msg")
  //   })
  //   .catch(err => console.error("Error", err ))
  //   setLoadLike(false)
  // }

  const handleUnLike = async () => {
    let msg;
    if (loadLike) return;

    setLoadLike(true);

    const newPost = {
      ...post,
      likes: post.likes.filter((like) => like._id !== user._id),
    };
    console.log(newPost);

    dispatch(setUpdatePost(newPost));
    
    axios
    .patch(`/api/post/${post._id}/unlike`)
    .then(({ data }) => {
        socket.emit("unLikePost", newPost);
        console.log(data?.msg);
      })
      .catch((err) => {
        console.error("Error", err);
        dispatch(setUpdatePost(post));
      })
      .finally(() => {
        setLoadLike(false);
      });

      msg = {
        id: user._id,
        text: "like your post.",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        user:user,
      };

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
      .catch((err) => console.warn("Error in notifying post unlike"));
  };

  //Saved
  useEffect(() => {
    if (user.saved.find((id) => id === post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [user.saved, post._id]);

  const handleSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    const newUser = { ...user, saved: [...user.saved, post._id] };
    dispatch(setUser(newUser));
    axios
      .patch(`/api/post/savepost/${post._id}`)
      .then(({ data }) => console.log(data?.msg))
      .catch((err) => console.error("Error", err));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (saveLoad) return;

    setSaveLoad(true);
    const newUser = {
      ...user,
      saved: user.saved.filter((id) => id !== post._id),
    };
    dispatch(setUser(newUser));
    axios
      .patch(`/api/post/unsavepost/${post._id}`)
      .then(({ data }) => console.log(data?.msg))
      .catch((err) => console.error("Error", err));
    setSaveLoad(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <IconButton aria-label="chat">
            <ChatRoundedIcon />
          </IconButton>
          <IconButton aria-label="share" onClick={handleClick}>
            <SendRoundedIcon />
          </IconButton>
          <Popper id={id} open={open} anchorEl={anchorEl} placement="right">
            <Box
              sx={{
                p: 1,
                bgcolor: "background.paper",
                borderRadius: "5px",
                gap: "10px",
              }}
            >
              <ShareModal url={`${ClientBaseUrl}/post/${post._id}`} />
            </Box>
          </Popper>
        </Box>
        <Box>
          {saved ? (
            <IconButton aria-label="share" onClick={handleUnSavePost}>
              <BookmarkRoundedIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="share" onClick={handleSavePost}>
              <BookmarkBorderRoundedIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body2"
          display="block"
          ml={2}
          sx={{
            fontWeight: "bold",
          }}
        >
          {post?.likes?.length} Likes
        </Typography>
        <Typography
          variant="body2"
          display="block"
          mr={2}
          sx={{
            fontWeight: "bold",
          }}
        >
          {post?.comments?.length} Comments
        </Typography>
      </Box>
    </Box>
  );
};

export default PostFooter;
