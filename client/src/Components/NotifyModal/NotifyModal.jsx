import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListSubheader,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllNotifies,
  updateNotify,
  updateSound,
} from "../../redux/AllReducers/notifySlice";
import emptyNotification from "../../Images/notice.png";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "../../Axios/axiosInstance";

export default function NotifyModal() {
  const notify = useSelector((state) => state.notify);
  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  let newArray = notify.data.filter((item) => item.isRead === false);

  const handleSound = () => {
    dispatch(updateSound(!notify.sound));
  };

  const handleIsRead = (msg) => {
    axios
      .patch(`/api/isReadNotify/${msg._id}`, null)
      .then(() => {
        const data = {
          ...msg,
          isRead: true,
        };
        dispatch(updateNotify(data));
      })
      .catch((err) => console.log("Error in isread patch request:", err));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRemove = () => {
    handleOpenModal();
  };

  const confirmRemove = () => {
    axios
      .delete("/api/deleteAllNotify")
      .then(() => {
        dispatch(deleteAllNotifies([]));
      })
      .catch((err) => {
        console.log("err while clearin all notification" + err);
      });
    handleCloseModal();
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          maxHeight: 360,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Notifications
            <Box display="flex" justifyContent="space-between">
              {notify?.sound ? (
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={handleSound}
                >
                  <NotificationsIcon fontSize="small" color="success" />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={handleSound}
                >
                  <NotificationsOffIcon fontSize="small" color="error" />
                </IconButton>
              )}

              {notify.data.length !== 0 && (
                <IconButton
                  aria-label="delete"
                  size="small"
                  sx={{
                    marginLeft: 1,
                  }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                  <Typography
                    variant="body1"
                    component="span"
                    color="error"
                    onClick={handleRemove}
                  >
                    Delete All
                  </Typography>
                </IconButton>
              )}
            </Box>
          </ListSubheader>
        }
      >
        {notify.data.length === 0 ? (
          <ListItem alignItems="flex-start">
            <img src={emptyNotification} alt="empty-notification" />
          </ListItem>
        ) : (
          notify.data.map((msg, index) => (
            <>
              <ListItem key={index} sx={{
                display:"flex",
                justifyContent:"space-between"
              }}>
                {/* <Box display="flex" justifyContent="space-between"> */}
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    to={msg.url}
                    onClick={() => handleIsRead(msg)}
                  >
                    <Box display="flex">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={msg.user.profilePicture}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={msg.user.username}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {msg.text}
                            </Typography>
                            {msg.content && (
                              <Typography>
                                {msg.content.slice(0, 20)}...
                              </Typography>
                            )}
                            <Typography
                              fontSize="small"
                              component="h6"
                              variant="body1"
                            >
                              {moment(msg.createdAt).fromNow()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Box>
                  </Link>
                  <Box>
                    <ListItemAvatar
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {msg.image && <Avatar alt="Remy Sharp" src={msg.image} />}
                      {!msg.isRead && (
                        <CircleIcon fontSize="small" color="error" />
                      )}
                    </ListItemAvatar>
                  </Box>
                {/* </Box> */}
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))
        )}
      </List>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirmation</DialogTitle>
        {newArray.length === 0 ? (
          <DialogContent>
            <p>Are you sure you want to delete all notifications ?</p>
          </DialogContent>
        ) : (
          <DialogContent>
            <p>{`You have ${newArray.length} unread notifications. Are you sure you want to delete all?`}</p>
          </DialogContent>
        )}
        {/* <DialogContent>
            <p>Are you sure you want to remove this comment?</p>
          </DialogContent> */}
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={confirmRemove} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
