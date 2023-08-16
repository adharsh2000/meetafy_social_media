import React, { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { Box } from "@mui/material";

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);

  return (
    <div>
      <CommentCard
        comment={comment}
        post={post}
        commentId={comment._id}
        key={comment._id}
      >
        <Box pl="1rem" width="98.8%">
          {showRep.map(
            (item, index) =>
              item.reply && (
                <CommentCard
                  key={index}
                  comment={item}
                  post={post}
                  commentId={comment._id}
                />
              )
          )}
          {replyCm.length - next > 0 ? (
            <Box
              component="span"
              ml={1}
              onClick={() => setNext(next + 10)}
              sx={{
                cursor: "pointer",
                color: "crimson",
              }}
            >
              Show more reply...
            </Box>
          ) : (
            replyCm.length > 1 && (
              <Box
                component="span"
                ml={1}
                onClick={() => setNext(1)}
                sx={{
                  cursor: "pointer",
                  color: "crimson",
                }}
              >
                Hide reply...
              </Box>
            )
          )}
        </Box>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
