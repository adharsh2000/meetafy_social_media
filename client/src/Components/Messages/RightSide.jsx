import { Box, Typography } from "@mui/material";
import React from "react";
import messageIcon from "../../Images/communication.png";

const RightSide = () => {
  return (
    <>
      <Box
        width="100%"
        height="100%"
        maxHeight={600}
        minHeight={600}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <img
          src={messageIcon}
          alt="logo/message"
          style={{ 
            display: "inherit",
            width:'10rem'
        }}
        />
        <Typography>
            Start a conversation with us to get started!
        </Typography>
      </Box>
    </>
  );
};

export default RightSide;
