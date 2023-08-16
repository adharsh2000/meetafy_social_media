import { Card, styled } from "@mui/material";
import React from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
// import CommentMenu from "../Comments/CommentMenu";
import InputComments from "../Comments/InputComments";
import Comments from "../Comments/Comments";
// import PopperC from "../Comments/Popper";

const MainCard = styled(Card)(({ theme }) => ({
  width: "94%",
  margin: "0 auto", // Center the card horizontally
  marginBottom: theme.spacing(2), // Add vertical spacing
  boxShadow: theme.shape.shadow,
}));

const PostComponent = ({ post }) => {
  return (
    <MainCard>
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostFooter post={post} />

      <Comments post={post}/>
      <InputComments post={post}/>
      {/* <PopperC/> */}
      {/* <CommentMenu/> */}
    </MainCard>
  );
};

export default PostComponent;
