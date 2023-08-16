import React from 'react'
import { Box, Grid } from '@mui/material'
import UserNavbar from '../Components/UserNavbar/UserNavbar'
import LeftSidePanel from '../Components/LeftSidePanel/LeftSidePanel'
import RightSidePanel from '../Components/RightSidePanel/RightSidePanel'
import Feed from '../Components/Feed/Feed'
// import { useDispatch, useSelector } from 'react-redux'
// import {  loadMorePosts } from '../redux/AllReducers/postSlice'
// import Stories from '../Components/Stories/Stories'



const Userhome = () => {
  // const dispatch = useDispatch()
  // const {posts} = useSelector((state) => state)
  // console.log(posts?.page);
  // useEffect(() => {
  //   const limit = 9;
  //   dispatch(loadMorePosts(limit))
  // },[posts?.page,dispatch])

  return (
    <Box>
      <UserNavbar/>
      {/* <Stack direction="row" spacing={2} justifyContent="space-between">
        <LeftSidePanel />
        <Feed/>
        <RightSidePanel/>
        </Stack> */}

<Grid container spacing={2}>
      <Grid item xs={2}>
        <LeftSidePanel />
      </Grid>
      <Grid item xs={6}>
        <Feed />
      </Grid>
      <Grid item xs={4}>
        <RightSidePanel />
      </Grid>
    </Grid>
    </Box>
  )
}

export default Userhome
