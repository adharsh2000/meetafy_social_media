import React, { useEffect, useState } from "react";
import UserNavbar from "../Components/UserNavbar/UserNavbar";
import { Box, CircularProgress, Grid, useTheme } from "@mui/material";
import LeftSidePanel from "../Components/LeftSidePanel/LeftSidePanel";
import DiscoverThumb from "../Components/Discover/DiscoverThumb";
import { useDispatch, useSelector } from "react-redux";
import { getPostsDiscover, setLoadingDiscover, updatePostDiscover } from "../redux/AllReducers/discoverSlice";
import axios from "../Axios/axiosInstance";
import LoadMoreButton from "../Components/LoadMoreButton/LoadMoreButton";


const Discover = () => {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;
  const [load, setLoad] = useState(false);
  const user = useSelector((state) => state.user);
  const discover = useSelector((state) => state.discover);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!discover?.firstLoad){
        dispatch(setLoadingDiscover(true));
        axios.get(`/api/postdiscover`)
        .then(({data})=>{
            console.log(data)
            dispatch(getPostsDiscover(data))
            dispatch(setLoadingDiscover(false));
        })
        .catch((err)=> console.error("Error fetching posts", err))
    }
    dispatch(setLoadingDiscover(false));
  },[dispatch,discover.firstLoad,user])

  const handleLoadMore = async () => {
    setLoad(true);
    axios.get(`/api//postdiscover?num=${discover.page * 9}`)
    .then(({data})=>{
        console.log(data)
        dispatch(updatePostDiscover(data))
        setLoad(false)
    })
    .catch((err)=>{
        console.error("Error fetching posts", err);
        setLoad(false)
    })
  }


  return (
    <Box>
      <UserNavbar />
      <Grid container>
        <Grid item bgcolor={backgroundColor} xs={2}>
          <LeftSidePanel />
        </Grid>
        <Grid item xs={10} display={"flex"} justifyContent={"center"}>
          <Box
            width={"90%"}
            height={"auto"}
            bgcolor={"white"}
            p={2}
            mt={3}
            borderRadius={2}
            display="flex"
            flexDirection="column"
            // justifyContent="center"
            alignItems="center"
          >
            {
                discover?.loading
                ? <CircularProgress/>
                : <DiscoverThumb posts={discover.posts} result={discover.result} />
            }
            {
                load && <CircularProgress/>
            }
            {
                !discover?.loading &&
                <LoadMoreButton result={discover.result} page={discover.page} load={load} handleLoadMore={handleLoadMore}/>
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Discover;


// import * as React from 'react';
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';

// function srcset(image, size, rows = 1, cols = 1) {
//   return {
//     src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
//     srcSet: `${image}?w=${size * cols}&h=${
//       size * rows
//     }&fit=crop&auto=format&dpr=2 2x`,
//   };
// }

// export default function Discover() {
//   return (
//     <ImageList
//       sx={{ width: 500, height: 450 }}
//       variant="quilted"
//       cols={4}
//       rowHeight={121}
//     >
//       {itemData.map((item) => (
//         <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
//           <img
//             {...srcset(item.img, 121, item.rows, item.cols)}
//             alt={item.title}
//             loading="lazy"
//           />
//         </ImageListItem>
//       ))}
//     </ImageList>
//   );
// }

// const itemData = [
//   {
//     img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
//     title: 'Breakfast',
//     rows: 2,
//     cols: 2,
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
//     title: 'Burger',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//     title: 'Camera',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//     title: 'Coffee',
//     cols: 2,
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//     title: 'Hats',
//     cols: 2,
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
//     title: 'Honey',
//     author: '@arwinneil',
//     rows: 2,
//     cols: 2,
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
//     title: 'Basketball',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
//     title: 'Fern',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
//     title: 'Mushrooms',
//     rows: 2,
//     cols: 2,
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//     cols: 2,
//   },
// ];