import React, { useEffect, useState } from "react";
import CommentDisplay from "./CommentDisplay";
import { Box } from "@mui/material";

const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);
  const [replyComments, setReplyComments] = useState(false);


  useEffect(() => {
    const newCm = post.comments.filter(cm => !cm.reply)
    setComments(newCm);
    setShowComments(newCm.slice(newCm.length - next))
  },[post.comments, next]);

  useEffect(() => {
    const newRep = post.comments.filter(cm => cm.reply)
    setReplyComments(newRep)
  },[post.comments])

  return (
    <div>
      {showComments.map((comment, index) => (
        <CommentDisplay key={index} comment={comment} post={post} replyCm={replyComments.filter(item => item.reply === comment._id)}/>
      ))}
      {
        comments.length - next > 0
        ? <Box component="span" ml={1} onClick={() => setNext(next + 10)} 
        sx={{
          cursor: 'pointer',
          color: 'crimson',
        }}
        >
          See more comments...
        </Box>
        : comments.length > 2 &&
        <Box component="span" ml={1} onClick={() => setNext(2)}
        sx={{
          cursor: 'pointer',
          color: 'crimson',
        }}
        >
        Hide comments...
      </Box>
      }
    </div>
  );
};

export default Comments;
