import React, { useEffect, useState } from "react";
import UserNavbar from "../Components/UserNavbar/UserNavbar";
import { Box, CircularProgress, Grid, useTheme } from "@mui/material";
import LeftSidePanel from "../Components/LeftSidePanel/LeftSidePanel";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../Axios/axiosInstance";
import { getPost } from "../redux/AllReducers/detailedPostSlice";
import PostFeed from "../Components/Post/PostFeed";
import AddPost from "../Components/AddPost/AddPost";

const PostSingle = () => {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const user = useSelector((state) => state.user);
  const detailedPost = useSelector((state) => state.detailedPost);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`/api/post/${id}`)
      .then(({ data }) => {
        // console.log(data.post);
        dispatch(getPost(data.post));
      })
      .catch((err) => console.log("error", err));

    if (detailedPost?.length > 0) {
      const newArr = detailedPost?.filter((post) => post._id === id);
      setPost(newArr);
    }
  }, [detailedPost, dispatch, id, user]);

  return (
    <Box>
      <UserNavbar />
      <Grid container>
        <Grid item bgcolor={backgroundColor} xs={2}>
          <LeftSidePanel />
        </Grid>
        <Box sx={{ display: "none" }}>
          <AddPost />
        </Box>
        <Grid item xs={10} display={"flex"} justifyContent={"center"} pt={3}>
          {/* <Box
            width={"50rem"}
            height={"auto"}
            bgcolor={"white"}
            p={2}
            mt={3}
            borderRadius={2}
          > */}
          {post.length === 0 && <CircularProgress />}
          {post?.map((item) => (
            <PostFeed key={item._id} post={item} />
          ))}
          {/* </Box> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostSingle;
