import { Box, CircularProgress } from "@mui/material";
import React, { Suspense, useState } from "react";
import Stories from "../Stories/Stories";
import AddPost from "../AddPost/AddPost";
import { useDispatch, useSelector } from "react-redux";
import { loadMorePosts, setPage } from "../../redux/AllReducers/postSlice";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import PostCard from "../FallBackUis/PostCard";
const PostFeed = React.lazy(() => import('../Post/PostFeed'))

const Feed = () => {
  const { posts } = useSelector((state) => state);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const limit = 9;
  //   dispatch(loadMorePosts(limit));
  // }, [posts?.page, dispatch,profile,user]);

  const handleLoadMore = async () => {
    setLoad(true);
    const limit = posts?.page * 9;
    dispatch(loadMorePosts(limit));
    dispatch(setPage(posts.page + 1));
    setLoad(false);
  };

  return (
    <Box  ml={2}>
      <Stories />
      <AddPost />
      <Suspense fallback={<PostCard />}>
        {posts?.posts.map((post) => (
          <PostFeed key={post._id} post={post} />
        ))}
      </Suspense>
      {load && (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', my: 2 }}>
        <LoadMoreButton result={posts.result} page={posts.page} load={load} handleLoadMore={handleLoadMore} />
      </Box>
    </Box>
  );
};
//pt={3}
export default Feed;
