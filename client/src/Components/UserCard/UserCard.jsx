import React from "react";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';

export default function Usercard({
  children,
  user,
  handleClose,
  setShowFollwers,
  setShowFollwing,
  msg,
  chat
}) {
  const handleCloseAll = () => {
    if (handleClose) handleClose();
    // if(setShowFollwers) handleClose();
    // if(setShowFollwing) handleClose();
  };

  const showMsg = (user) => {
    return (
      <>
        {(user.text)
            ? user.text
            : <ImageIcon color="success"/>
        }
      </>
    );
  };

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        p={2}
      >
        <Box width="25%">
          <Avatar alt="profile" src={user?.profilePicture} />
        </Box>
        <Box width="75%">
          {msg ? (
            <Link
              to={`/chats`}
              style={{ textDecoration: "none" }}
              onClick={handleCloseAll}
            >
              <Typography color={"black"}>{user?.username}</Typography>
              <Typography color={"black"}>
              {
                msg
                ? showMsg(user)
                : user.fullname
               }
              </Typography>
            </Link>
          ) : (
            <Link
              to={`/profile/${user?._id}`}
              style={{ textDecoration: "none" }}
              onClick={handleCloseAll}
            >
              <Typography color={"black"}>{user?.username}</Typography>
              <Typography color={"black"}>{user?.fullname}</Typography>
            </Link>
          )}
        </Box>
        <Box ml={2}>{children}</Box>
      </Box>
      <Divider />
    </>
  );
}
