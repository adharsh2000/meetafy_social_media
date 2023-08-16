import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommentMenu from "./CommentMenu";
import LikeButton from "../Post/LikeButton";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatePost } from "../../redux/AllReducers/postSlice";
import { DeleteData, EditData } from "../../utils/helper";
import axios from "../../Axios/axiosInstance";
import InputComments from "./InputComments"
import { updateDetailedPost } from "../../redux/AllReducers/detailedPostSlice";

const CommentCard = ({children, comment, post, commentId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [onReply, setOnReply] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
    setContent(comment?.content);
    setIsLike(false);
    setOnReply(false);
    if(comment.likes.find(like => like._id === user._id)){
      setIsLike(true)
    }
  }, [comment,user._id]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLike = () => {
    if(loadLike) return;
    setIsLike(true)

    setLoadLike(true)
    const newComment = {...comment, likes: [...comment.likes, user]};
    const newComments = EditData(post.comments, comment._id, newComment)
    const newPost = {...post, comments: newComments}
    // console.log(newPost);
    dispatch(setUpdatePost(newPost));
    axios.patch(`/api/comment/${comment._id}/like`)
    .then((res)=>console.log('liked'))
    .catch(()=>alert('Error updating Comment'));
    setLoadLike(false)
  };

  const handleUnLike = () => {
    if(loadLike) return;
    setIsLike(false)

    setLoadLike(true)
    const newComment = {...comment, likes: DeleteData(comment.likes, user._id)};
    const newComments = EditData(post.comments, comment._id, newComment);
    const newPost = {...post, comments: newComments};
    // console.log(newPost);
    dispatch(setUpdatePost(newPost))
    axios.patch(`/api/comment/${comment._id}/unlike`)
    .then((res)=>console.log('unliked'))
    .catch(()=>alert('Error updating Comment'));
    setLoadLike(false)
  };

  const handleUpdate = () => {
    if(comment.content !== content){
      const updatedComments = EditData(post.comments, comment._id, {...comment, content})
      const updatedPost = { ...post, comments: updatedComments };
      // console.log(updatedPost);
      dispatch(setUpdatePost(updatedPost));
      dispatch(updateDetailedPost(updatedPost));
      setOnEdit(false)
      axios.patch(`/api/comment/${comment._id}`,{content})
      .then((res)=>console.log('Comment Updated'))
      .catch(()=>alert('Error updating Comment'));
    }else{
      setOnEdit(false);
      dispatch(setUpdatePost(post));
    }
  }

  const handleReply = () => {
    if(onReply) return setOnReply(false)
    setOnReply({...comment, commentId})
    // console.log({...comment, commentId});
  }

  return (
    <Box
      p={1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ position: "relative" }}
    >
      <Link
        style={{ textDecoration: "none" }}
        to={`/profile/${comment?.user?._id}`}
      >
        <Box display={"flex"} alignItems={"center"} mb={1}>
          <Avatar
            alt="avatar-icon"
            src={comment?.user?.profilePicture}
            sx={{ width: 18, height: 18 }}
          />
          <Typography variant="body2" component={"h6"} ml={1} color="black">
            {comment?.user?.username}
          </Typography>
        </Box>
      </Link>
      <Box
        bgcolor="#eee"
        display={"flex"}
        justifyContent={"space-between"}
        sx={{
          borderRadius: "10px",
          borderTopLeftRadius: "0",
        }}
      >
        <Box p={1} width={'87%'}>
          {onEdit ? (
            <textarea
              rows={"5"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
              }}
            />
          ) : 
          (
            <Typography>
              {
                comment.tag && comment.tag._id !== comment.user._id &&
                <Link to={`/profile/${comment.tag._id}`} style={{ textDecoration: "none" }}>
                @{comment?.tag?.username}:
                </Link>
              }
              {content.length < 100
                ? content
                : readMore
                ? content + " "
                : content.slice(0, 100) + "...."}
              {content.length > 100 && (
                <Box
                  component="span"
                  onClick={() => setReadMore(!readMore)}
                  sx={{
                    fontSize: "13px",
                    color: "crimson",
                    cursor: "pointer",
                  }}
                >
                  {readMore ? "Show Less" : "Read More"}
                </Box>
              )}
            </Typography>
          )}
          <Box display={"flex"} pt={1}>
            <Typography
              mr={2}
              sx={{
                fontSize: "13px",
                color: "#9e9ea7",
              }}
            >
              {moment(comment?.createdAt).fromNow()}
            </Typography>
            <Typography
              mr={2}
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              {comment?.likes?.length} likes
            </Typography>
            {onEdit ? (
              <>
                <Typography
                mr={2}
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={handleUpdate}
                >
                  update
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => setOnEdit(false)}
                >
                  cancel
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={handleReply}
              >
                {onReply ? 'cancel' : 'replay'}
              </Typography>
            )}
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          {isHovered && (
            <CommentMenu
              post={post}
              comment={comment}
              user={user}
              setOnEdit={setOnEdit}
            />
          )}
          <LikeButton
            fontSize={"15px"}
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
        </Box>
      </Box>
      {
        onReply && 
        <InputComments post={post} onReply={onReply} setOnReply={setOnReply} >
          <Link to={`/profile/${onReply.user._id}`} style={{textDecoration: 'none'}}>
            @{onReply?.user?.username}:
          </Link>
        </InputComments>
      }
      {children}
    </Box>
  );
};

export default CommentCard;
