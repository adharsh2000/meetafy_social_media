import { Box, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProfilePostThumb from './ProfilePostThumb'
import axios from '../../Axios/axiosInstance';
import { updateProfilePost } from '../../redux/AllReducers/profileSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton';
// import LoadMoreButton from '../LoadMoreButton/LoadMoreButton'

const ProfilePosts = ({user, dispatch}) => {
  const {id} = useParams()
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);

  const profile = useSelector((state) => state.profile)
  useEffect(() => {
    if (profile && profile.posts && profile.posts.length > 0) {
      const postData = profile.posts.find((data) => data?._id === id);
      if (postData) {
        const { post } = postData;
        if (post !== posts) {
          setPosts(post);
        }
        setResult(postData.result);
        setPage(postData.page);
      }
    }
  }, [id, profile, posts]);

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await axios.get(`/api/user_posts/${id}?limit=${page * 9}`)
    .then(({data}) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

    const newData = {...res.data, page: page+1, _id:id};
    dispatch(updateProfilePost(newData))
    setLoad(false);
  }

  return (
    <Box>
      <ProfilePostThumb posts={posts} result={result}/>
      {
        load && <CircularProgress/>
      }
      <LoadMoreButton result={result} page={page} load={load} handleLoadMore={handleLoadMore} />
    </Box>
  )
}

export default ProfilePosts
