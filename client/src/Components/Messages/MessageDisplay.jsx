import {
  Avatar,
  Box,
  Card,
  IconButton,
  Popover,
  //  CardContent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteData } from "../../utils/helper";
import { deleteMessages } from "../../redux/AllReducers/messageSlice";
import axios from "../../Axios/axiosInstance";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import MissedVideoCallIcon from "@mui/icons-material/MissedVideoCall";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import Times from "./Times";

const MessageDisplay = ({ user, msg, data, isPurple }) => {
  const currentUser = useSelector((state) => state.user);
  const socket = useSelector((state) => state?.socket?.socket);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMessage = () => {
    if (data) {
      const newData = DeleteData(data, msg?._id);
      // const newMsg = {newData, _id:msg.recipient};
      console.log({ newData, _id: msg.recipient });
      dispatch(deleteMessages({ newData, _id: msg.recipient }));
      const deletedMessage = { newData, _id: msg.recipient, id: msg.sender };
      socket.emit("deletedMessage", deletedMessage);
      axios
        .delete(`/api/message/${msg._id}`)
        .then(() => console.log("Deleted"))
        .catch((err) => console.error(`Error deleting message ${err}`));
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Avatar
          alt="logo"
          src={user?.profilePicture}
          sx={{ width: 20, height: 20 }}
        />
        <Typography component="h6" variant="body2" ml={1}>
          {user?.username}
        </Typography>
      </Box>
      {user?._id === currentUser?._id && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
        >
          <IconButton
            sx={{ cursor: "pointer" }}
            aria-label="delete"
            onClick={handleDeleteMessage}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </Popover>
      )}
      {msg?.media?.map((item, index) => (
        <Box
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          key={index}
        >
          {
            <img
              src={item?.url ? item?.url : URL.createObjectURL(item)}
              alt={item.name}
              loading="lazy"
              style={{
                width: "200px",
                marginTop: 3,
              }}
            />
          }
        </Box>
      ))}
      {msg?.text && (
        <Card
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          sx={{
            backgroundColor: isPurple ? "purple" : "initial",
            color: isPurple ? "white" : "initial",
            padding: `5px 10px`,
          }}
        >
          {/* <CardContent> */}
          <Typography component="h6" variant="body2">
            {msg?.text}
          </Typography>
          {/* </CardContent> */}
        </Card>
      )}

      {msg.call && (
        <Card
          aria-describedby={id}
          variant="contained"
          sx={{
            backgroundColor: isPurple ? "purple" : "initial",
            color: isPurple ? "white" : "initial",
            padding: `5px 10px`,
            display:"flex",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mr={1}>
            {msg.call.times === 0 ? (
              msg.call.video ? (
                <MissedVideoCallIcon color="error" />
              ) : (
                <PhoneDisabledIcon color="error" />
              )
            ) : msg.call.video ? (
              <VideocamIcon color="success" />
            ) : (
              <CallIcon color="success" />
            )}
          </Box>
          <Box display="flex" flexDirection='column'>
            <Typography component="h6" variant="body2">
              {msg.call.video ? "Video Call" : "Audio Call"}
            </Typography>
            <Typography component="h6" variant="body2" fontSize="small">
              {msg.call.times > 0 ? (
                <Times total={msg.call.times} />
              ) : (
                new Date(msg.createdAt).toLocaleTimeString()
              )}
            </Typography>
          </Box>
        </Card>
      )}

      <Box>
        <Typography
          component="h6"
          variant="body2"
          sx={{
            fontSize: "small",
          }}
        >
          {new Date(msg.createdAt).toLocaleString()}
        </Typography>
      </Box>
    </>
  );
};

export default MessageDisplay;
