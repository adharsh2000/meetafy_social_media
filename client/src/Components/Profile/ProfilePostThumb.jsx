import { Chat, Favorite } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import BurstModeIcon from "@mui/icons-material/BurstMode";

const ProfilePostThumb = ({ posts, result }) => {
  if(result === 0) return (
    <Box sx={{
      width:'100%',
      height:'50vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
    }}>
      <Typography variant="h5" component="h3" color="red">
        Nothing Saved!
      </Typography>
    </Box>
    )
    
  return (
    <Box
      className="post_thumb"
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        justifyContent: "center",
        gridGap: "10px",
        overflow: "hidden",
        margin: "15px 0",
      }}
    >
      {posts?.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <Box
            className="post_thumb_display"
            sx={{
              minWidth: 300,
              height: 300,
              width: "100%",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img
              src={post.images[0].url}
              alt={post.images[0].url}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "#0008",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0,
                transition: "0.3s",
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <Typography
                sx={{ display: "flex", alignItems: "center", color: "white" }}
              >
                <Favorite sx={{ fontSize: "1.8rem", marginRight: "5px" }} />
                {post?.likes?.length}
              </Typography>

              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  marginLeft: 2,
                }}
              >
                <Chat sx={{ fontSize: "1.8rem", marginRight: "5px" }} />
                {post?.comments?.length}
              </Typography>
              {/* <BurstModeIcon sx={{ fontSize: "1.8rem", marginRight: "5px" }} /> */}
            </Box>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default ProfilePostThumb;
