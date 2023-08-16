// import React from "react";
// import { Box } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { useDispatch } from "react-redux";
// import { setUpdatePost } from "../../redux/AllReducers/postSlice";
// import axios from "../../Axios/axiosInstance";

// const CommentMenu = ({ post, comment, user, setOnEdit }) => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const dispatch = useDispatch()
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleEdit = () => {
//     setOnEdit(true);
//     handleClose();
//   };

//   const handleRemove = () => {
//     const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]
//     const newPost = {
//       ...post,
//       comments: post.comments.filter(cm => !deleteArr.find(item => cm._id === item._id))
//     }
//     console.log({newPost, post});
//     dispatch(setUpdatePost(newPost))
//     deleteArr.forEach(item => {
//       axios.delete(`/api/comment/${item._id}`)
//       .then(({data})=>{
//         console.log(data);
//       })
//       .catch((err)=>console.error('Error deleting Comment', err));
//     })
//     handleClose();
//   };

//   return (
//     <Box>
//       <IconButton
//         aria-label="more"
//         id="long-button"
//         aria-controls={open ? "long-menu" : undefined}
//         aria-expanded={open ? "true" : undefined}
//         aria-haspopup="true"
//         onClick={handleClick}
//       >
//         <MoreVertIcon sx={{ fontSize: "15px" }} />
//       </IconButton>
//       <Menu
//         id="long-menu"
//         MenuListProps={{
//           "aria-labelledby": "long-button",
//         }}
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//       >
//         {post.user._id === user._id || comment.user._id === user._id ? (
//           [
//             <MenuItem key="edit" onClick={handleEdit}>
//               <EditIcon sx={{
//                 marginRight:'5px'
//               }}/>
//               Edit
//             </MenuItem>,
//             <MenuItem key="remove" onClick={handleRemove}>
//               <DeleteIcon sx={{
//                 marginRight:'5px'
//               }}/>
//               Remove
//             </MenuItem>
//           ]
//         ) : (
//           <MenuItem onClick={handleRemove}>
//             <DeleteIcon sx={{
//                 marginRight:'5px'
//               }}/>
//             Remove
//           </MenuItem>
//         )}
//       </Menu>
//     </Box>
//   );
// };


// export default CommentMenu;

import React from "react";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatePost } from "../../redux/AllReducers/postSlice";
import axios from "../../Axios/axiosInstance";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { updateDetailedPost } from "../../redux/AllReducers/detailedPostSlice";

const CommentMenu = ({ post, comment, user, setOnEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const socket = useSelector((state) => state?.socket?.socket)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOnEdit(true);
    handleClose();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRemove = () => {
    handleClose();
    handleOpenModal();
  };

  const confirmRemove =  () => {
    let msg;
    if(post.user._id === user._id || comment.user._id === user._id){
    const deleteArr = [
      ...post.comments.filter((cm) => cm.reply === comment._id),
      comment,
    ];
    const newPost = {
      ...post,
      comments: post.comments.filter(
        (cm) => !deleteArr.find((item) => cm._id === item._id)
      ),
    };
    // console.log({ newPost, post });
    dispatch(setUpdatePost(newPost));
    socket.emit('deleteComment', newPost);
    dispatch(updateDetailedPost(newPost))
    deleteArr.forEach((item) => {
      axios
        .delete(`/api/comment/${item._id}`)
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => console.error("Error deleting Comment", err));

        msg = {
          id: item._id,
          text: comment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
          user:user,
        }

        axios
        .delete(`/api/notify/${msg.id}?url=${msg.url}`, msg)
        .then(({ data }) => {
          console.log(data);
          socket.emit("removeNotify", {
            ...data.notify,
            user: {
              username: user.username,
              profilePicture: user.profilePicture,
            },
          });
        })
        .catch((err) => console.warn("Error in notifying post like"));
    });
    }
    handleCloseModal();
  };

  return (
    <Box>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{ fontSize: "15px" }} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {post.user._id === user._id || comment.user._id === user._id ? (
          [
            <MenuItem key="edit" onClick={handleEdit}>
              <EditIcon sx={{ marginRight: "5px" }} />
              Edit
            </MenuItem>,
            <MenuItem key="remove" onClick={handleRemove}>
              <DeleteIcon sx={{ marginRight: "5px" }} />
              Remove
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleRemove}>
            <DeleteIcon sx={{ marginRight: "5px" }} />
            Remove
          </MenuItem>
        )}
      </Menu>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove this comment?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={confirmRemove} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentMenu;
