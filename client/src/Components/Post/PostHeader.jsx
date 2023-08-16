// import { MoreHoriz } from "@mui/icons-material";
// import {
//   Avatar,
//   Box,
//   CardContent,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import moment from 'moment'

// const PostHeader = ({post}) => {
//   return (
//     <CardContent orientation="horizontal" sx={{ alignItems: "center", gap: 1 }}>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <Avatar
//             size="sm"
//             src={post?.user?.profilePicture}
//             sx={{ p: 0.5, border: "2px solid", borderColor: "background.body" }}
//           />
//           <Box>
//             <Typography variant="h6" fontWeight="lg" ml={2}>
//               {post?.user?.username}
//             </Typography>
//             {/* <Typography variant="p" fontWeight="" ml={2}>
//             just now
//           </Typography> */}
//             <Typography variant="body2" display="block" ml={2}>
//             {moment(post.createdAt).fromNow()}
//             </Typography>
//           </Box>
//         </Box>
//         <IconButton
//           variant="plain"
//           color="neutral"
//           size="sm"
//           sx={{ ml: "auto" }}
//         >
//           <MoreHoriz />
//         </IconButton>
//       </Box>
//     </CardContent>
//   );
// };

// export default PostHeader;

import { MoreHoriz } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CardContent,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
} from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPost,
  setDeletePost,
  setOnEdit,
} from "../../redux/AllReducers/postSlice";
import { Link } from "react-router-dom";
import axios from "../../Axios/axiosInstance";
import { toast } from "react-toastify";
import { ClientBaseUrl } from "../../Constants/Constants";

// const PostHeader = ({ post }) => {
//   const user = useSelector((state) => state?.user);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const dispatch = useDispatch();

//   const handleMenuOpen = (event) => {
//     setMenuOpen(true);
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuOpen(false);
//   };

//   const handleEditPost = () => {
//     dispatch(setOnEdit(true));
//     setMenuOpen(false);
//     dispatch(setCurrentPost(post));
//   };

//   const handleDeletePost = () => {
//     axios.delete(`/api/post/${post?._id}`)
//     .then(({data})=>{
//       console.log("deleted");
//       dispatch(setDeletePost(post))
//       toast.success(data?.msg)
//     })
//     .catch((err) => {
//       console.log("err"+err);
//     })
//   }

//   return (
//     <CardContent orientation="horizontal" sx={{ alignItems: "center", gap: 1 }}>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <Avatar
//             size="sm"
//             src={post?.user?.profilePicture}
//             sx={{ p: 0.5, border: "2px solid", borderColor: "background.body" }}
//           />
//           <Box>
//           <Link to={`/profile/${post?.user?._id}`} style={{ textDecoration: "none",color:"inherit" }}>
//             <Typography variant="h6" fontWeight="lg" ml={2}>
//               {post?.user?.username}
//             </Typography>
//             </Link>
//             <Typography variant="body2" display="block" ml={2}>
//               {moment(post.createdAt).fromNow()}
//             </Typography>
//           </Box>
//         </Box>
//         <IconButton
//           variant="plain"
//           color="neutral"
//           size="sm"
//           sx={{ ml: "auto" }}
//           onClick={handleMenuOpen}
//         >
//           <MoreHoriz />
//         </IconButton>
//       </Box>
//       <Menu
//         anchorEl={anchorEl}
//         open={menuOpen}
//         onClose={handleMenuClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//       >
//         {user?._id === post?.user?._id && (
//           <>
//             <MenuItem onClick={handleEditPost}>
//             <EditIcon sx={{ marginRight: "5px" }} />
//               Edit Post
//             </MenuItem>
//             <MenuItem onClick={handleDeletePost}>
//               <DeleteIcon sx={{ marginRight: "5px" }} />
//               Remove Post
//               </MenuItem>
//           </>
//         )}
//         <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
//       </Menu>
//     </CardContent>
//   );
// };

const PostHeader = ({ post }) => {
  const user = useSelector((state) => state?.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const socket = useSelector((state) => state?.socket?.socket)
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleEditPost = () => {
    dispatch(setOnEdit(true));
    setMenuOpen(false);
    dispatch(setCurrentPost(post));
  };

  const handleDeletePost = () => {
    setMenuOpen(false);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const confirmDeletePost = async () => {
    let msg;
    await axios
      .delete(`/api/post/${post?._id}`)
      .then(({ data }) => {
        console.log("deleted");
        dispatch(setDeletePost(post));
        toast.success(data?.msg);
        msg = {
          id: post._id,
          text: "added a new post",
          recipients: data.newPost.user.followers,
          url: `/post/${post._id}`,
        };
      })
      .catch((err) => {
        console.log("err" + err);
      });
    await axios
      .delete(`/api/notify/${msg.id}?url=${msg.url}`)
      .then(({ data }) => {
        console.log(data);
        socket.emit("removeNotify", msg);
      })
      .catch((err) => {
        console.log(err);
      });
    setConfirmationOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${ClientBaseUrl}/post/${post?._id}`);
    setMenuOpen(false);
  };

  return (
    <CardContent orientation="horizontal" sx={{ alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Avatar
            size="sm"
            src={post?.user?.profilePicture}
            sx={{ p: 0.5, border: "2px solid", borderColor: "background.body" }}
          />
          <Box>
            <Link
              to={`/profile/${post?.user?._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="h6" fontWeight="lg" ml={2}>
                {post?.user?.username}
              </Typography>
            </Link>
            <Typography variant="body2" display="block" ml={2}>
              {moment(post.createdAt).fromNow()}
            </Typography>
          </Box>
        </Box>
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ ml: "auto" }}
          onClick={handleMenuOpen}
        >
          <MoreHoriz />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user?._id === post?.user?._id && (
          <>
            <MenuItem onClick={handleEditPost}>
              <EditIcon sx={{ marginRight: "5px" }} />
              Edit Post
            </MenuItem>
            <MenuItem onClick={handleDeletePost}>
              <DeleteIcon sx={{ marginRight: "5px" }} />
              Remove Post
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleCopyLink}>
          <ContentCopyIcon sx={{ marginRight: "5px" }} />
          Copy Link
        </MenuItem>
      </Menu>
      <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove this post?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose}>Cancel</Button>
          <Button onClick={confirmDeletePost} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  );
};

export default PostHeader;
