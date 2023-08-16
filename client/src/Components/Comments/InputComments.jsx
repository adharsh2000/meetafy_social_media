import React, { useState } from "react";
import { EmojiEmotions } from "@mui/icons-material";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { Box, InputBase, Popper, Typography, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatePost } from "../../redux/AllReducers/postSlice";
import axios from "../../Axios/axiosInstance";
import { updateDetailedPost } from "../../redux/AllReducers/detailedPostSlice";

const InputBox = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: "0 10px",
    borderRadius: '50px',
    width: "100%",
    height: '2.6rem',
    display: 'flex',
    alignItems: 'center'
  }));

const InputComments = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState("");
  const socket = useSelector((state) => state?.socket?.socket)
//   const [showemoji, setShowemoji] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

//   const toggleEmojipicker = () => {
//     setShowemoji(!showemoji);
//   };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const addEmoji = (emoji) => {
    const updatedDescription = content + emoji.native;
    setContent(updatedDescription);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!content.trim()){
      if(setOnReply) return setOnReply(false)
        return ;
    }

    const newComment = { 
        content,
        likes: [],
        user: user,
        createdAt: new Date().toISOString(),
        reply: onReply && onReply.commentId,
        tag: onReply && onReply.user,
    }

    // console.log(newComment);

    const newPost = {...post, comments: [...post.comments, newComment]}
    // console.log(newPost);
    socket.emit('createComment', newPost)
    dispatch(setUpdatePost(newPost))
    const dataComment = {
        ...newComment,
        postId: post._id,
        postUserId:post.user._id
    }
    let msg;
    await axios.post('/api/comment',dataComment)
        .then(({data})=>{
            const newData = {...data?.newComment, user:user}
            const newPost = {...post, comments:[...post.comments, newData]}
            dispatch(setUpdatePost(newPost))
            dispatch(updateDetailedPost(newPost))
            msg = {
              id: data.newComment._id,
              text: data.newComment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
              recipients: data.newComment.reply ? [data.newComment.tag._id] : [post.user._id],
              url: `/post/${post._id}`,
              content: post.content, 
              image: post.images[0].url,
              user:user,
            }
        })
        .catch((err)=>{
            dispatch(setUpdatePost(post))
        })
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
    setContent("");
    if(setOnReply) return setOnReply(false)
  };

  return (
    <form action="">
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
      {children}
      <InputBox>
      <InputBase placeholder="Add your comments..." sx={{color:'black',width:'100%'}}
      type="text"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      />
      <EmojiEmotions
        color="primary"
        onClick={handleClick}
        aria-describedby={id}
        sx={{ cursor: "pointer" }}
      />
      <Popper id={id} open={open} anchorEl={anchorEl} placement='right-end'>
        <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
        <Picker
          onSelect={addEmoji}
        />
        </Box>
      </Popper>
      <Typography variant="body2" component={'span'}
      onClick={handleSubmit}
      p={1} sx={{
        cursor: 'pointer',
      }}>
        Post
      </Typography>
    </InputBox>
      </Box>
    </form>
  );
};

export default InputComments;
