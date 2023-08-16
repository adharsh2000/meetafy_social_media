import React, { useEffect, useState } from 'react'
import axios from '../../Axios/axiosInstance';
import ProfilePostThumb from './ProfilePostThumb';
import { Box, CircularProgress } from '@mui/material';
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton';
import { useSelector } from 'react-redux';

const ProfileSavedPosts = ({ dispatch}) => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [result, setResult] = useState(9);
    const [page, setPage] = useState(2);
    const [load, setLoad] = useState(false);
    const user = useSelector((state) => state.user)

    useEffect(() => {
        setLoad(true)
        axios.get(`/api/getSavePosts`)
        .then(res => {
            setSavedPosts(res.data.savePosts)
            setResult(res.data.result)
            setLoad(false)
        })
        .catch(err => {
            console.log(err);
        })
        return () => setSavedPosts([])
    },[user, dispatch])

    const handleLoadMore = async () => {
        setLoad(true)
        axios.get(`/api/getSavePosts?limit=${page * 9}`)
        .then(({data}) => {
          console.log(data);
          setSavedPosts(data.savePosts)
          setResult(data.result)
          setPage(page + 1)
        })
        .catch((err) => {
          console.log(err);
          setLoad(false)
        });
        setLoad(false)
    }

  return (
    <Box>
      <ProfilePostThumb posts={savedPosts} result={result}/>
      {
        load && <CircularProgress/>
      }
      <LoadMoreButton result={result} page={page} load={load} handleLoadMore={handleLoadMore} />
    </Box>
  )
}

export default ProfileSavedPosts
